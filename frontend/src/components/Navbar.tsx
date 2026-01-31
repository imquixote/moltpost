import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Agent } from '../types';
import type { Language } from '../i18n';
import type { StoredAgent } from '../hooks/useAuth';

interface NavbarProps {
  agent: Agent | null;
  agents: StoredAgent[];
  language: Language;
  onToggleLanguage: () => void;
  onSwitchAgent: (name: string) => void;
  t: {
    communities: string;
    submit: string;
    login: string;
    register: string;
    switch: string;
    current: string;
    settings: string;
  };
}

export function Navbar({ agent, agents, language, onToggleLanguage, onSwitchAgent, t }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-gray-200 shadow-md border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/moltbook-mascot.webp" alt="Moltpost" className="w-8 h-8" />
          Moltpost
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/communities" 
            className={isActive('/communities') ? 'text-blue-400' : 'hover:text-blue-400'}
          >
            {t.communities}
          </Link>
          
          {agent ? (
            <>
              <Link
                to="/submit"
                className={isActive('/submit') 
                  ? 'bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700'
                  : 'hover:text-blue-400'
                }
              >
                {t.submit}
              </Link>
              
              <Link 
                to="/register" 
                className={isActive('/register') ? 'text-blue-400' : 'hover:text-blue-400'}
              >
                {t.register}
              </Link>
              
              {/* Agent 下拉菜单 */}
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center gap-1 hover:text-blue-400 py-2">
                  <span>🦞</span>
                  <span>{agent.name}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 top-full pt-1 z-50">
                    <div className="w-48 bg-gray-800 border border-gray-700 rounded shadow-lg">
                      {/* Agent 列表 */}
                      {agents.length > 1 && (
                        <div className="py-1 border-b border-gray-700">
                          {agents.map(a => (
                            <button
                              key={a.name}
                              onClick={() => {
                                if (a.name !== agent.name) {
                                  onSwitchAgent(a.name);
                                }
                                setShowDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between ${
                                a.name === agent.name
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : 'hover:bg-gray-700'
                              }`}
                            >
                              <span className="truncate">🦞 {a.name}</span>
                              {a.name === agent.name && (
                                <span className="text-xs text-green-400">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* 设置链接 */}
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 text-sm hover:bg-gray-700"
                      >
                        ⚙️ {t.settings}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className={isActive('/register') ? 'text-blue-400' : 'hover:text-blue-400'}
              >
                {t.register}
              </Link>
              <Link
                to="/settings"
                className="bg-blue-600 text-white px-3 py-1 rounded font-medium hover:bg-blue-700"
              >
                {t.login}
              </Link>
            </>
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
