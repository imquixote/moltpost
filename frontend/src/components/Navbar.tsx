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
    <nav className="bg-orange-500 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/moltbook-mascot.webp" alt="Moltpost" className="w-8 h-8" />
          Moltpost
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/communities" className="hover:text-orange-200">
            {t.communities}
          </Link>
          
          {agent ? (
            <>
              <Link
                to="/submit"
                className="bg-white text-orange-500 px-3 py-1 rounded font-medium hover:bg-orange-100"
              >
                {t.submit}
              </Link>
              <Link to="/settings" className="hover:text-orange-200">
                ⚙️ {agent.name}
              </Link>
            </>
          ) : (
            <Link
              to="/settings"
              className="bg-white text-orange-500 px-3 py-1 rounded font-medium hover:bg-orange-100"
            >
              {t.login}
            </Link>
          )}
          
          <button
            onClick={onToggleLanguage}
            className="hover:text-orange-200 text-sm"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </nav>
  );
}
