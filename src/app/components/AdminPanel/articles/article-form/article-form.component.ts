import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Article, ArticleService } from '../../../../Services/article.service';
import { EventEmitter, Output } from '@angular/core';
import { ToastingMessagesService } from '../../../../shared/Services/ToastingMessages/toasting-messages.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent {
  oid=input<string|null>(null);
  isOpen=input<boolean>(false);
  private fb = inject(FormBuilder);
  private articleService = inject(ArticleService);
  private toasting = inject(ToastingMessagesService);

@Output() saved = new EventEmitter<void>();
  form = this.fb.group({
    category: [''],
    slug: [''],
    title: this.fb.group({
      en: [''],
      ar: ['']
    }),
    sections: this.fb.array([])
  });

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  // ================= ADD SECTION =================
  addSection(type: string) {
    const section = this.fb.group({
      type: [type],

      title: this.fb.group({
        en: [''],
        ar: ['']
      }),

      content: this.fb.group({
        en: this.fb.control<string[]>([]),
        ar: this.fb.control<string[]>([])
      }),

      list: this.fb.group({
        en: this.fb.control<string[]>([]),
        ar: this.fb.control<string[]>([])
      }),

      image: [''],
      imageAlt: ['']
    });

    this.sections.push(section);
  }

  // ================= REMOVE =================
  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  // ================= ADD ARRAY ITEM =================
  addItem(section: any, field: 'content' | 'list', lang: 'en' | 'ar') {
    const arr = section.get(field).get(lang).value || [];
    arr.push('');
    section.get(field).get(lang).setValue(arr);
  }

  removeItem(section: any, field: 'content' | 'list', lang: 'en' | 'ar', index: number) {
    const arr = section.get(field).get(lang).value;
    arr.splice(index, 1);
    section.get(field).get(lang).setValue(arr);
  }

  // ================= UPDATE ARRAY VALUE =================
  updateItem(section: any, field: string, lang: string, index: number, value: string) {
    const arr = section.get(field).get(lang).value;
    arr[index] = value;
    section.get(field).get(lang).setValue(arr);
  }

  // ================= SUBMIT =================
  submit() {
    const article = this.form.getRawValue() as Article;

    this.articleService.createArticle(article).subscribe({
      next: () => {
        this.form.reset();
        this.sections.clear();
        this.saved.emit();

      },
      error: (err) => {

        const apiMessage =
          err?.error?.message ||
          err?.error?.errors?.[0] ||
          'Something went wrong while saving the article';

        this.toasting.showToast(apiMessage, 'error');
      },
    });
  }

  // ================= SLUG AUTO =================
  generateSlug() {
    const title = this.form.get('title.en')?.value || '';
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    this.form.get('slug')?.setValue(slug);
  }
}


