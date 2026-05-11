import { Injectable, signal, computed } from '@angular/core';
import { TRANSLATIONS } from './translations';

export type Lang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {

  private readonly _lang = signal<Lang>(
    (localStorage.getItem('language') as Lang) || 'es'
  );

  readonly lang = this._lang.asReadonly();

  readonly t = computed(() => TRANSLATIONS[this._lang()]);

  setLanguage(lang: Lang) {
    this._lang.set(lang);
    localStorage.setItem('language', lang);
  }
}
