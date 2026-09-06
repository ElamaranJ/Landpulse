import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'EN' | 'HI' | 'MR' | 'TA' | 'GU' | 'TE' | 'BN';

const LANG_STORAGE_KEY = 'landpulse_selected_language';
const VALID_LANGUAGES: SupportedLanguage[] = ['EN', 'HI', 'MR', 'TA', 'GU', 'TE', 'BN'];

const getStoredLanguage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && VALID_LANGUAGES.includes(saved as SupportedLanguage)) {
      return saved as SupportedLanguage;
    }
  } catch (err) {
    console.warn('Failed to load language from localStorage:', err);
  }
  return 'EN';
};

export interface LocaleContextType {
  selectedLanguage: SupportedLanguage;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(getStoredLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, selectedLanguage);
    } catch (err) {
      console.warn('Failed to save language to localStorage:', err);
    }
  }, [selectedLanguage]);

  return (
    <LocaleContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
