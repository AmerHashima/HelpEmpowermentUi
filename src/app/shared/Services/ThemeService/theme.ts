// src\app\shared\Services\ThemeService\theme.ts
import { Injectable, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  currentTheme = signal<'light' | 'dark'>('light');
  additionalTheme = signal('');
  fullTheme: string[] = [];

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return; // SSR-safe early exit

    // Detect user's preferred color scheme
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    // Load full theme list
    this.fullTheme = this.getStoredThemeList();

    if (this.fullTheme.length) {
      // Apply stored classes
      this.setFullTheme(this.fullTheme);
      if (savedTheme) this.currentTheme.set(savedTheme);
    } else {
      // Determine default theme
      const defaultTheme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : prefersLight ? 'light' : 'dark';
      // this.setTheme(defaultTheme);
      this.setTheme('light');

    }

    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      const theme = localStorage.getItem('theme');
      if (!theme) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    });

    // Reactively update additional theme classes
    effect(() => {
      if (this.additionalTheme()) {
        this.updateBodyClass();
      }
    });
  }

  /** Get stored full theme list from localStorage */
  private getStoredThemeList(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const stored = localStorage.getItem('fullTheme');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /** Set main theme: light or dark */
  setTheme(theme: 'light' | 'dark') {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentTheme.set(theme);
    const oppositeTheme = theme === 'light' ? 'dark' : 'light';

    // Clean previous theme classes
    const updatedThemes = this.fullTheme
      .filter(cls => cls !== `${oppositeTheme}-theme`)
      .filter(cls => cls !== `${theme}-theme`);

    updatedThemes.push(`${theme}-theme`);
    this.fullTheme = updatedThemes;

    localStorage.setItem('theme', theme);
    localStorage.setItem('fullTheme', JSON.stringify(updatedThemes));

    this.setFullTheme(updatedThemes);
  }

  /** Set full theme classes on body */
  setFullTheme(theme: string[]) {
    if (!isPlatformBrowser(this.platformId)) return;

    const cleaned = theme.map(cls => cls.trim()).filter(Boolean);
    document.body.className = '';
    document.body.classList.add(...cleaned);
  }

  /** Update body classes when additionalTheme changes */
  private updateBodyClass() {
    if (!isPlatformBrowser(this.platformId)) return;

    const base = `${this.currentTheme()}-theme`;
    const additional = this.additionalTheme();
    const themeList = additional && additional !== 'none' ? [additional, base] : [base];

    this.fullTheme = themeList;
    localStorage.setItem('fullTheme', JSON.stringify(themeList));
    this.setFullTheme(themeList);
  }

  /** Toggle light/dark */
  toggleTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }
}
