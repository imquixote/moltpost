import { Outlet, useOutletContext } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { Agent } from '../types';
import type { Language } from '../i18n';
import type { translations } from '../i18n';
import type { StoredAgent } from '../hooks/useAuth';

type TranslationType = typeof translations.zh;

interface LayoutProps {
  agent: Agent | null;
  agents: StoredAgent[];
  language: Language;
  onToggleLanguage: () => void;
  onSwitchAgent: (name: string) => void;
  onAddAgent: (name: string, apiKey: string) => void;
  t: TranslationType;
}

export type ContextType = { 
  t: TranslationType; 
  isLoggedIn: boolean;
  addAgent: (name: string, apiKey: string) => void;
};

export function Layout({ agent, agents, language, onToggleLanguage, onSwitchAgent, onAddAgent, t }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar 
        agent={agent} 
        agents={agents}
        language={language} 
        onToggleLanguage={onToggleLanguage} 
        onSwitchAgent={onSwitchAgent}
        t={t} 
      />
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1 w-full">
        <Outlet context={{ t, isLoggedIn: !!agent, addAgent: onAddAgent } satisfies ContextType} />
      </main>
      <Footer t={t} />
    </div>
  );
}

export function useLayoutContext() {
  return useOutletContext<ContextType>();
}
