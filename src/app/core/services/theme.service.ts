import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'dashboard-theme';
  private readonly themeSubject: BehaviorSubject<ThemeMode>;
  readonly theme$: Observable<ThemeMode>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    const saved = (localStorage.getItem(this.storageKey) as ThemeMode) ?? 'light';
    this.themeSubject = new BehaviorSubject<ThemeMode>(saved);
    this.theme$ = this.themeSubject.asObservable();
    this.applyTheme(saved);
  }

  toggleTheme(): void {
    const nextTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}

