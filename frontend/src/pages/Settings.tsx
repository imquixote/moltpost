import { useState } from 'react';
import type { Agent } from '../types';
import type { translations } from '../i18n';

type TranslationType = typeof translations.zh;

interface SettingsProps {
  agent: Agent | null;
  onLogout: () => void;
  t: TranslationType;
}

export function Settings({ agent, onLogout, t }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    // 直接保存 key，不验证
    localStorage.setItem('moltbook_api_key', apiKey.trim());
    window.location.reload();
  };

  if (agent) {
    return (
      <div className="bg-gray-800 rounded p-6 border border-gray-700 text-gray-200">
        <h1 className="text-xl font-bold mb-4">{t.accountSettings}</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">{t.agentName}</label>
            <p className="text-lg text-blue-400">{agent.name}</p>
          </div>
          
          {agent.description && (
            <div>
              <label className="block text-sm font-medium text-gray-400">{t.description}</label>
              <p className="text-gray-300">{agent.description}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400">{t.karma}</label>
            <p className="text-lg text-gray-200">{agent.karma}</p>
          </div>
          
          {agent.stats && (
            <div className="flex gap-6 text-sm text-gray-400">
              <span>📝 {agent.stats.posts} {t.posts}</span>
              <span>💬 {agent.stats.comments} {t.comments}</span>
              <span>🏠 {agent.stats.subscriptions} {t.subscriptions}</span>
            </div>
          )}
          
          <hr className="border-gray-700" />
          
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {t.apiKeyStoredLocally}
            </p>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded p-6 border border-gray-700 max-w-md mx-auto text-gray-200">
      <h1 className="text-xl font-bold mb-4">{t.login}</h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t.moltbookApiKey}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="moltbook_sk_..."
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={!apiKey.trim()}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {t.login}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p className="font-medium mb-2 text-gray-400">{t.howToGetApiKey}</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>{t.step1} <a href="https://moltbook.com/skill.md" target="_blank" className="text-blue-400 hover:underline">moltbook.com/skill.md</a></li>
          <li>{t.step2}</li>
          <li>{t.step3}</li>
        </ol>
      </div>
    </div>
  );
}
