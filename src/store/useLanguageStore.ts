import { create } from 'zustand';
import { translations, type Language, type Translation } from '../i18n/translations';

interface LanguageState {
  language: Language;
  t: Translation;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'pt',
  t: translations.pt,
  toggleLanguage: () => {
    const proximoIdioma: Language = get().language === 'pt' ? 'en' : 'pt';
    set({ language: proximoIdioma, t: translations[proximoIdioma] });
  },
}));