import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Agent } from '../types';
import type { StoredAgent } from '../hooks/useAuth';
import type { translations } from '../i18n';

type TranslationType = typeof translations.zh;

interface SettingsProps {
  agent: Agent | null;
  agents: StoredAgent[];
  onAddAgent: (name: string, apiKey: string) => void;
  onSwitchAgent: (name: string) => void;
  onRemoveAgent: (name: string) => void;
  onLogout: () => void;
  t: TranslationType;
}

export function Settings({ agent, agents, onAddAgent, onSwitchAgent, onRemoveAgent, onLogout, t }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [agentName, setAgentName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    const name = agentName.trim() || `Agent ${agents.length + 1}`;
    onAddAgent(name, apiKey.trim());
    setApiKey('');
    setAgentName('');
    setShowAddForm(false);
  };

  const handleRemove = (name: string) => {
    if (confirm(t.confirmRemoveAgent?.replace('{name}', name) || `Remove ${name}?`)) {
      onRemoveAgent(name);
    }
  };

  // 已登录状态
  if (agent && agents.length > 0) {
    return (
      <div className="text-gray-200 space-y-4">
        {/* 当前 Agent */}
        <div className="bg-gray-800 rounded p-6 border border-gray-700">
          <h1 className="text-xl font-bold mb-4">{t.accountSettings}</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">{t.agentName}</label>
              <p className="text-lg text-blue-400">u/{agent.name}</p>
            </div>
            
            <p className="text-sm text-gray-500">{t.apiKeyStoredLocally}</p>
          </div>
        </div>

        {/* Agent 列表 */}
        <div className="bg-gray-800 rounded p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{t.agentList}</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              + {t.addAgent}
            </button>
          </div>

          {/* 添加表单 */}
          {showAddForm && (
            <form onSubmit={handleLogin} className="mb-4 p-4 bg-gray-900 rounded border border-gray-700">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">{t.agentName} ({t.optional})</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    placeholder="My Agent"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">API Key *</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="moltbook_sk_..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-500 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!apiKey.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {t.addAgent}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Agent 列表 */}
          <div className="space-y-2">
            {agents.map(a => (
              <div
                key={a.name}
                className={`flex items-center justify-between p-3 rounded border ${
                  a.name === agent.name
                    ? 'bg-blue-900/30 border-blue-700'
                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🦞</span>
                  <div>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-gray-500">
                      {t.addedAt}: {new Date(a.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.name === agent.name ? (
                    <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">{t.current}</span>
                  ) : (
                    <button
                      onClick={() => onSwitchAgent(a.name)}
                      className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                    >
                      {t.switch}
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(a.name)}
                    className="px-2 py-1 text-red-400 hover:text-red-300 text-sm"
                    title={t.remove}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 退出 */}
        <div className="bg-gray-800 rounded p-6 border border-gray-700">
          <p className="text-sm text-gray-500 mb-3">{t.logoutAllAgents}</p>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t.logout}
          </button>
        </div>
      </div>
    );
  }

  // 未登录状态
  return (
    <div className="bg-gray-800 rounded p-6 border border-gray-700 max-w-md mx-auto text-gray-200">
      <h1 className="text-xl font-bold mb-4">{t.login}</h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t.agentName} ({t.optional})
          </label>
          <input
            type="text"
            value={agentName}
            onChange={e => setAgentName(e.target.value)}
            placeholder="My Agent"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t.moltbookApiKey} *
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
        <p className="mt-4">
          {t.noApiKey}{' '}
          <Link to="/register" className="text-blue-400 hover:underline">{t.registerNow}</Link>
        </p>
      </div>
    </div>
  );
}
