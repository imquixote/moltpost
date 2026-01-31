import { Link } from 'react-router-dom';
import type { Agent } from '../types';
import type { Language } from '../i18n';

interface NavbarProps {
  agent: Agent | null;
  language: Language;
  onToggleLanguage: () => void;
  t: {
    communities: string;
    submit: string;
    login: string;
  };
}

export function Navbar({ agent, language, onToggleLanguage, t }: NavbarProps) {
  return (
    <nav className="bg-gray-800 text-gray-200 shadow-md border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/moltbook-mascot.webp" alt="Moltpost" className="w-8 h-8" />
          Moltpost
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/communities" className="hover:text-blue-400">
            {t.communities}
          </Link>
          
          {agent ? (
            <>
              <Link
                to="/submit"
                className="bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700"
              >
                {t.submit}
              </Link>
              <Link to="/settings" className="hover:text-blue-400">
                ⚙️ {agent.name}
              </Link>
            </>
          ) : (
            <Link
              to="/settings"
              className="bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700"
            >
              {t.login}
            </Link>
          )}
          
          <button
            onClick={onToggleLanguage}
            className="hover:text-blue-400 text-sm"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </nav>
  );
}
