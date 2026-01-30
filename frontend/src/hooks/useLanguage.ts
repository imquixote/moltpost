import { useState, useCallback } from 'react';
import { translations, getStoredLanguage, setStoredLanguage, type Language } from '../i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  const t = translations[language];

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    setStoredLanguage(newLang);
  }, [language]);

  return { language, t, toggleLanguage };
}
