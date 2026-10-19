import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, OnDestroy, Output } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Article, ArticleBlockType, ArticleService } from '../../../../Services/article.service';
import { TranslateService } from '../../../../Services/translate.service';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({ selector: 'app-article-form', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './article-form.component.html', styleUrl: './article-form.component.scss' })
export class ArticleFormComponent implements OnDestroy {
  oid = input<string | null>(null); isOpen = input(false); @Output() saved = new EventEmitter<void>(); @Output() closed = new EventEmitter<void>();
  private fb = inject(FormBuilder); private articles = inject(ArticleService); private toast = inject(ToastingMessagesService); private translator = inject(TranslateService);
  private translationTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private translationVersions = new Map<string, number>();
  loading = false; uploading = false; translating = false; private translationsInProgress = 0;
  form = this.fb.group({ category: ['general'], courseCode: [''], slug: [''], titleEn: [''], titleAr: [''], summaryEn: [''], summaryAr: [''], coverImagePath: [''], coverImageAltEn: [''], coverImageAltAr: [''], publishedAt: [''], readingTimeMinutes: [5], status: ['Draft'], isFeatured: [false], blocks: this.fb.array([]) });
  get blocks(): FormArray { return this.form.controls.blocks; }
  constructor() { effect(() => { if (!this.isOpen()) return; const id = this.oid(); id ? this.load(id) : this.reset(); }); }
  private block(type: ArticleBlockType, value?: any) { return this.fb.group({ type: [type], textEn: [value?.textEn ?? ''], textAr: [value?.textAr ?? ''], itemsEn: [value?.itemsEn ?? []], itemsAr: [value?.itemsAr ?? []], imagePath: [value?.imagePath ?? ''], altEn: [value?.altEn ?? ''], altAr: [value?.altAr ?? ''], captionEn: [value?.captionEn ?? ''], captionAr: [value?.captionAr ?? ''], orderNo: [value?.orderNo ?? this.blocks.length + 1] }); }
  addBlock(type: ArticleBlockType) { this.blocks.push(this.block(type)); }
  removeBlock(index: number) { this.blocks.removeAt(index); this.renumber(); }
  moveBlock(index: number, direction: number) { const to = index + direction; if (to < 0 || to >= this.blocks.length) return; const item = this.blocks.at(index); this.blocks.removeAt(index); this.blocks.insert(to, item); this.renumber(); }
  addItem(block: any, field: 'itemsEn' | 'itemsAr') { block.controls[field].setValue([...(block.controls[field].value ?? []), '']); }
  removeItem(block: any, field: 'itemsEn' | 'itemsAr', index: number) { const values = [...(block.controls[field].value ?? [])]; values.splice(index, 1); block.controls[field].setValue(values); }
  updateItem(block: any, field: 'itemsEn' | 'itemsAr', index: number, event: Event, blockIndex?: number) { const values = [...(block.controls[field].value ?? [])]; values[index] = (event.target as HTMLInputElement).value; block.controls[field].setValue(values); if (field === 'itemsEn') this.autoTranslateListItem(block, blockIndex ?? 0, index, values[index]); }
  upload(event: Event, control: any) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; this.uploading = true; this.articles.uploadImage(file).subscribe({ next: name => { control.setValue(name); this.uploading = false; }, error: () => this.uploading = false }); }
  imageUrl(path?: string) { return this.articles.imageUrl(path); }
  submit() { if (this.form.invalid || this.loading) return; this.renumber(); const raw = this.form.getRawValue() as any; const payload: Article = { ...raw, courseCode: raw.courseCode || null, publishedAt: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : null, readingTimeMinutes: Number(raw.readingTimeMinutes || 0), blocks: raw.blocks }; this.loading = true; const request = this.oid() ? this.articles.updateArticle(this.oid()!, payload) : this.articles.createArticle(payload); request.subscribe({ next: () => { this.loading = false; this.saved.emit(); }, error: err => { this.loading = false; this.toast.showToast(err?.message || 'Could not save the article', 'error'); } }); }
  cancel() { this.closed.emit(); }
  generateSlug() { this.form.controls.slug.setValue((this.form.controls.titleEn.value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }
  autoTranslateControl(key: string, englishControl: any, arabicControl: any) { this.autoTranslate(key, englishControl.value ?? '', () => arabicControl.value ?? '', value => arabicControl.setValue(value)); }
  private autoTranslateListItem(block: any, blockIndex: number, itemIndex: number, english: string) {
    const key = `block:${blockIndex}:item:${itemIndex}`;
    this.autoTranslate(key, english, () => (block.controls.itemsAr.value ?? [])[itemIndex] ?? '', value => {
      const arabic = [...(block.controls.itemsAr.value ?? [])];
      while (arabic.length <= itemIndex) arabic.push('');
      arabic[itemIndex] = value;
      block.controls.itemsAr.setValue(arabic);
    });
  }
  private autoTranslate(key: string, english: string, getArabic: () => string, setArabic: (value: string) => void) {
    const oldTimer = this.translationTimers.get(key); if (oldTimer) clearTimeout(oldTimer);
    const version = (this.translationVersions.get(key) ?? 0) + 1; this.translationVersions.set(key, version);
    const text = english.trim(); if (!text) return;
    const arabicBeforeRequest = getArabic().trim();
    this.translationTimers.set(key, setTimeout(() => {
      this.translationTimers.delete(key); this.translationsInProgress++; this.translating = true;
      this.translator.translateEnToAr(text).subscribe({
        next: translated => { if (translated && this.translationVersions.get(key) === version && getArabic().trim() === arabicBeforeRequest) setArabic(translated); },
        error: () => this.finishTranslation(), complete: () => this.finishTranslation()
      });
    }, 600));
  }
  private finishTranslation() { this.translationsInProgress = Math.max(0, this.translationsInProgress - 1); this.translating = this.translationsInProgress > 0; }
  private load(id: string) { this.loading = true; this.articles.getArticle(id).subscribe({ next: article => { this.reset(article); this.loading = false; }, error: () => { this.loading = false; this.toast.showToast('Could not load article', 'error'); } }); }
  private reset(article?: Partial<Article>) { this.form.reset({ category: article?.category ?? 'general', courseCode: article?.courseCode ?? '', slug: article?.slug ?? '', titleEn: article?.titleEn ?? '', titleAr: article?.titleAr ?? '', summaryEn: article?.summaryEn ?? '', summaryAr: article?.summaryAr ?? '', coverImagePath: article?.coverImagePath ?? '', coverImageAltEn: article?.coverImageAltEn ?? '', coverImageAltAr: article?.coverImageAltAr ?? '', publishedAt: article?.publishedAt ? article.publishedAt.slice(0, 10) : '', readingTimeMinutes: article?.readingTimeMinutes ?? 5, status: article?.status ?? 'Draft', isFeatured: article?.isFeatured ?? false }); this.blocks.clear(); (article?.blocks ?? []).sort((a,b) => a.orderNo - b.orderNo).forEach(x => this.blocks.push(this.block(x.type, x))); }
  private renumber() { this.blocks.controls.forEach((control, index) => control.get('orderNo')?.setValue(index + 1)); }
  ngOnDestroy() { this.translationTimers.forEach(timer => clearTimeout(timer)); this.translationTimers.clear(); }
}
