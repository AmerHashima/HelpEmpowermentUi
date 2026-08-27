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
    const colorScheme = window.matchMedia('(prefers-color-scheme: light)');
    const prefersLight = colorScheme.matches;

    // Load saved theme from localStorage
    const savedTheme = this.readStorage('theme') as 'light' | 'dark' | null;

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
    const onColorSchemeChange = (e: MediaQueryListEvent) => {
      const theme = this.readStorage('theme');
      if (!theme) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    };

    // Older iOS WebKit only implements the legacy MediaQueryList listener API.
    if (typeof colorScheme.addEventListener === 'function') {
      colorScheme.addEventListener('change', onColorSchemeChange);
    } else {
      colorScheme.addListener(onColorSchemeChange);
    }

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
      const stored = this.readStorage('fullTheme');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /** Set main theme: light or dark */
  setTheme(theme: 'light' | 'dark') {
    // this.phone.setTheme(theme);
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentTheme.set(theme);
    const oppositeTheme = theme === 'light' ? 'dark' : 'light';

    // Clean previous theme classes
    const updatedThemes = this.fullTheme
      .filter(cls => cls !== `${oppositeTheme}-theme`)
      .filter(cls => cls !== `${theme}-theme`);

    updatedThemes.push(`${theme}-theme`);
    this.fullTheme = updatedThemes;

    this.writeStorage('theme', theme);
    this.writeStorage('fullTheme', JSON.stringify(updatedThemes));

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
    this.writeStorage('fullTheme', JSON.stringify(themeList));
    this.setFullTheme(themeList);
  }

  /** Toggle light/dark */
  toggleTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }

  private readStorage(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable in iOS private/restricted browsing.
    }
  }
}
