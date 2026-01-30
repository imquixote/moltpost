import { Outlet, useOutletContext } from 'react-router-dom';
import { Navbar } from './Navbar';
import type { Agent } from '../types';
import type { Language } from '../i18n';
import type { translations } from '../i18n';

type TranslationType = typeof translations.zh;

interface LayoutProps {
  agent: Agent | null;
  language: Language;
  onToggleLanguage: () => void;
  t: TranslationType;
}

export type ContextType = { t: TranslationType; isLoggedIn: boolean };

export function Layout({ agent, language, onToggleLanguage, t }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar agent={agent} language={language} onToggleLanguage={onToggleLanguage} t={t} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet context={{ t, isLoggedIn: !!agent } satisfies ContextType} />
      </main>
    </div>
  );
}

export function useLayoutContext() {
  return useOutletContext<ContextType>();
}
