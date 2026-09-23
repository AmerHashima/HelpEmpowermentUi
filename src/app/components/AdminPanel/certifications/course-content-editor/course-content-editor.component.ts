import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CertificationService } from '../../../../Services/certification.service';
import { CourseTabContentService } from '../../../../Services/course-tab-content.service';
import { CourseCustomSection, CourseTabContent, CourseTabKey, CourseTabSection, CourseTabSectionItem } from '../../../../models/course-tab-content';
import { TranslateService } from '../../../../Services/translate.service';
import { forkJoin } from 'rxjs';
import { COURSE_CODE_TOKEN, COURSE_CONTENT_TEMPLATE } from './course-content.template';

@Component({
  selector: 'app-course-content-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-content-editor.component.html',
  styleUrl: './course-content-editor.component.scss'
})
export class CourseContentEditorComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly certifications = inject(CertificationService);
  private readonly contentService = inject(CourseTabContentService);
  private readonly translateService = inject(TranslateService);
  private readonly translationTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly lastAutoTranslations = new Map<string, string>();
  private readonly translationVersions = new Map<string, number>();
  private readonly objectIds = new WeakMap<object, number>();
  private nextObjectId = 1;

  readonly tabs = signal<CourseTabContent[]>([]);
  readonly activeKey = signal<CourseTabKey>('exam-simulator');
  readonly saving = signal(false);
  readonly loadingTemplate = signal(false);
  readonly templateLoaded = signal(false);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly currentCourseCode = signal('');
  readonly showAdvanced = signal(false);
  readonly rawSections = signal('[]');
  readonly translatingCount = signal(0);
  readonly activeTab = computed(() => this.tabs().find(x => x.tabKey === this.activeKey()));
  readonly customSections = computed(() =>
    (this.activeTab()?.content.sections ?? [])
      .filter((section): section is CourseCustomSection =>
        section.type === 'custom' && !!section.id && !!section.header && !!section.description)
      .sort((a, b) => a.orderNo - b.orderNo)
  );
  readonly builtInSections = computed(() =>
    (this.activeTab()?.content.sections ?? []).filter(section =>
      section.type !== 'custom' && section.type !== 'quizLevels')
  );
  readonly hasQuizLevels = computed(() =>
    (this.activeTab()?.content.sections ?? []).some(section => section.type === 'quizLevels')
  );
  private readonly labels: Record<string, string> = {
    benefits: 'Exam Benefits',
    outline: 'Course Outline',
    features: 'Course Features',
    audience: 'Audience',
    targetAudience: 'Target Audience',
    courseSessions: 'Course Sessions',
    agenda: 'Webinar Agenda',
    takeAway: 'Key Takeaways',
    instructorIntro: 'Instructor Introduction',
    instructorSkills: 'Instructor Skills',
    instructorCertifications: 'Instructor Certifications',
    faq: 'FAQs'
  };

  sectionLabel(section: CourseTabSection): string {
    return this.labels[section.type] ?? section.type;
  }

  hasItemDescription(section: CourseTabSection): boolean {
    return ['benefits', 'features', 'audience', 'agenda', 'takeAway', 'instructorSkills', 'faq']
      .includes(section.type);
  }

  localized(value: string | { en: string; ar: string } | undefined, lang: 'en' | 'ar'): string {
    return typeof value === 'string' ? value : value?.[lang] ?? '';
  }

  private objectKey(value: object): number {
    let id = this.objectIds.get(value);
    if (!id) {
      id = this.nextObjectId++;
      this.objectIds.set(value, id);
    }
    return id;
  }

  private autoTranslate(key: string, english: string, getArabic: () => string, setArabic: (value: string) => void): void {
    const version = (this.translationVersions.get(key) ?? 0) + 1;
    this.translationVersions.set(key, version);
    const oldTimer = this.translationTimers.get(key);
    if (oldTimer) clearTimeout(oldTimer);

    const text = english.trim();
    if (!this.lastAutoTranslations.has(key)) this.lastAutoTranslations.set(key, getArabic().trim());
    if (!text) return;

    this.translationTimers.set(key, setTimeout(() => {
      this.translationTimers.delete(key);
      const arabicBeforeRequest = getArabic().trim();
      if (arabicBeforeRequest !== (this.lastAutoTranslations.get(key) ?? '')) return;

      this.translatingCount.update(count => count + 1);
      this.translateService.translateEnToAr(text).subscribe({
        next: translated => {
          if (!translated || this.translationVersions.get(key) !== version || getArabic().trim() !== arabicBeforeRequest) return;
          this.lastAutoTranslations.set(key, translated);
          setArabic(translated);
          this.tabs.update(tabs => [...tabs]);
        },
        error: () => this.translatingCount.update(count => Math.max(0, count - 1)),
        complete: () => this.translatingCount.update(count => Math.max(0, count - 1))
      });
    }, 600));
  }

  setBannerEnglish(field: 'titlePart1' | 'titlePart2' | 'description', value: string): void {
    const tab = this.activeTab();
    if (!tab) return;
    tab.content.banner.en[field] = value;
    this.autoTranslate(`banner:${tab.courseCode}:${tab.tabKey}:${field}`, value,
      () => tab.content.banner.ar[field], translated => tab.content.banner.ar[field] = translated);
  }

  setSectionEnglish(section: CourseTabSection, field: 'header' | 'description', value: string): void {
    this.setSectionText(section, field, 'en', value);
    this.autoTranslate(`section:${this.objectKey(section)}:${field}`, value,
      () => this.localized(section[field], 'ar'), translated => this.setSectionText(section, field, 'ar', translated));
  }

  setItemEnglish(item: CourseTabSectionItem, field: 'title' | 'description', value: string): void {
    this.setItemText(item, field, 'en', value);
    this.autoTranslate(`item:${this.objectKey(item)}:${field}`, value,
      () => this.localized(item[field], 'ar'), translated => this.setItemText(item, field, 'ar', translated));
  }

  setCustomEnglish(section: CourseCustomSection, field: 'header' | 'description', value: string): void {
    section[field].en = value;
    this.autoTranslate(`custom:${this.objectKey(section)}:${field}`, value,
      () => section[field].ar, translated => section[field].ar = translated);
  }

  setSectionText(section: CourseTabSection, field: 'header' | 'description', lang: 'en' | 'ar', value: string): void {
    const current = section[field];
    section[field] = {
      en: this.localized(current, 'en'),
      ar: this.localized(current, 'ar'),
      [lang]: value
    };
  }

  setItemText(item: CourseTabSectionItem, field: 'title' | 'description', lang: 'en' | 'ar', value: string): void {
    const current = item[field];
    item[field] = {
      en: this.localized(current, 'en'),
      ar: this.localized(current, 'ar'),
      [lang]: value
    };
  }

  addItem(section: CourseTabSection): void {
    section.items.push({ title: { en: '', ar: '' }, description: { en: '', ar: '' } });
    this.tabs.update(items => [...items]);
  }

  removeItem(section: CourseTabSection, index: number): void {
    section.items.splice(index, 1);
    this.tabs.update(items => [...items]);
  }

  moveItem(section: CourseTabSection, index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= section.items.length) return;
    [section.items[index], section.items[target]] = [section.items[target], section.items[index]];
    this.tabs.update(items => [...items]);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Course id is missing.');
      this.loading.set(false);
      return;
    }
    this.certifications.getCertification(id).subscribe(course => {
      const courseCode = course.courseCode?.trim();
      if (!courseCode) {
        this.error.set('This course does not have a course code.');
        this.loading.set(false);
        return;
      }
      this.currentCourseCode.set(courseCode);

      this.contentService.getCourse(courseCode, true).subscribe({
        next: tabs => {
          const editableTabs = tabs.length ? tabs : this.createEmptyTabs(courseCode);
          this.tabs.set(editableTabs.sort((a, b) => a.orderNo - b.orderNo));
          this.select(this.activeKey());
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load the website content. Please try again.');
          this.loading.set(false);
        }
      });
    }, () => {
      this.error.set('Could not load the course. Please try again.');
      this.loading.set(false);
    });
  }

  private createEmptyTabs(courseCode: string): CourseTabContent[] {
    const keys: CourseTabKey[] = [
      'exam-simulator', 'recorded-course', 'live-course', 'webinar',
      'quiz-game', 'faq', 'reviews'
    ];

    return keys.map((tabKey, index) => ({
      oid: '',
      courseCode,
      tabKey,
      isEnabled: false,
      orderNo: index + 1,
      status: 'Draft',
      content: {
        banner: {
          en: { titlePart1: '', titlePart2: '', description: '' },
          ar: { titlePart1: '', titlePart2: '', description: '' },
          mediaUrl: '',
          mediaType: 'image'
        },
        sections: []
      }
    }));
  }

  loadTemplate(): void {
    const courseCode = this.currentCourseCode();
    if (!courseCode || this.loadingTemplate()) return;
    if (!confirm('Load the course template? This will replace the content currently shown in the editor.')) return;

    this.error.set('');
    this.loadingTemplate.set(true);
    try {
      const templateJson = JSON.stringify(COURSE_CONTENT_TEMPLATE);
      const clonedTabs = JSON.parse(
        templateJson.split(COURSE_CODE_TOKEN).join(courseCode)
      ) as CourseTabContent[];

      this.tabs.set(clonedTabs.sort((a, b) => a.orderNo - b.orderNo));
      if (!clonedTabs.some(tab => tab.tabKey === this.activeKey())) {
        this.select(clonedTabs[0].tabKey);
      }
      this.templateLoaded.set(true);
    } catch {
      this.error.set('Could not load the course template. Please try again.');
    } finally {
      this.loadingTemplate.set(false);
    }
  }

  select(key: CourseTabKey): void {
    this.activeKey.set(key);
    this.showAdvanced.set(false);
  }

  addSection(): void {
    const tab = this.activeTab();
    if (!tab) return;
    const nextOrder = Math.max(0, ...this.customSections().map(section => section.orderNo)) + 1;
    tab.content.sections.push({
      type: 'custom',
      id: globalThis.crypto?.randomUUID?.() ?? `section-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      header: { en: '', ar: '' },
      description: { en: '', ar: '' },
      orderNo: nextOrder,
      isEnabled: true,
      items: []
    });
    this.tabs.update(items => [...items]);
  }

  removeSection(section: CourseCustomSection): void {
    const tab = this.activeTab();
    if (!tab) return;
    tab.content.sections = tab.content.sections.filter(item => item !== section);
    this.tabs.update(items => [...items]);
  }

  moveSection(section: CourseCustomSection, direction: -1 | 1): void {
    const ordered = this.customSections();
    const index = ordered.indexOf(section);
    const target = ordered[index + direction];
    if (!target) return;
    [section.orderNo, target.orderNo] = [target.orderNo, section.orderNo];
    this.tabs.update(items => [...items]);
  }

  toggleAdvanced(): void {
    if (!this.showAdvanced()) {
      this.rawSections.set(JSON.stringify(this.activeTab()?.content.sections ?? [], null, 2));
    }
    this.showAdvanced.update(value => !value);
  }

  applyAdvanced(): void {
    const tab = this.activeTab();
    if (!tab) return;
    try {
      const parsed: unknown = JSON.parse(this.rawSections());
      if (!Array.isArray(parsed) || parsed.some(section =>
        !section || typeof section !== 'object' || typeof section.type !== 'string' ||
        !Array.isArray(section.items))) throw new Error('Invalid sections');
      tab.content.sections = parsed;
      this.tabs.update(items => [...items]);
      this.showAdvanced.set(false);
    } catch {
      alert('Sections JSON must be an array of sections with type and items.');
    }
  }

  save(): void {
    const tab = this.activeTab();
    if (!tab) return;
    this.error.set('');
    const tabsToSave = this.templateLoaded() ? this.tabs() : [tab];
    const invalid = tabsToSave.some(item => item.content.sections.some(section => {
      if (section.type !== 'custom') return false;
      const customSection = section as CourseCustomSection;
      return !customSection.header.en.trim() || !customSection.header.ar.trim() ||
        !customSection.description.en.trim() || !customSection.description.ar.trim();
    }));
    if (invalid) {
      alert('Complete the English and Arabic header and description for every custom section.');
      return;
    }
    this.saving.set(true);
    forkJoin(tabsToSave.map((item, index) => this.contentService.save({
      courseCode: item.courseCode, tabKey: item.tabKey, isEnabled: item.isEnabled,
      orderNo: item.orderNo, status: item.status, content: item.content
    }, index === tabsToSave.length - 1
      ? (tabsToSave.length > 1 ? 'All website content tabs were saved successfully.' : 'Website content saved successfully.')
      : ''))).subscribe({
      next: savedTabs => {
        this.tabs.update(items => items.map(item =>
          savedTabs.find(saved => saved.tabKey === item.tabKey) ?? item
        ));
        this.templateLoaded.set(false);
        this.saving.set(false);
      },
      error: () => {
        const message = 'Could not save the website content. Please try again.';
        this.error.set(message);
        this.saving.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.translationTimers.forEach(timer => clearTimeout(timer));
  }
}
