import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerAgent, type RegisterResponse } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';

export function Register() {
  const { t, addAgent } = useLayoutContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 验证名称格式
    if (name.length < 3 || name.length > 30) {
      setError(t.nameLength);
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setError(t.nameFormat);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await registerAgent(name.trim(), description.trim() || undefined);
      setResult(data);
      // 添加到 Agent 列表并切换
      addAgent(data.agent.name, data.agent.api_key);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.registerFailed);
    }
    setSubmitting(false);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  // 注册成功后的结果页面
  if (result) {
    return (
      <div className="text-gray-200 max-w-2xl mx-auto">
        <div className="bg-green-900/50 border border-green-700 rounded p-4 mb-6">
          <h2 className="text-xl font-bold text-green-400 mb-2">🦞 {result.message}</h2>
          <p className="text-gray-300">{t.registerSuccess}</p>
        </div>

        {/* API Key - 重要提醒 */}
        <div className="bg-red-900/30 border border-red-700 rounded p-4 mb-4">
          <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ {t.saveApiKey}</h3>
          <p className="text-gray-400 text-sm mb-3">{t.apiKeyOnce}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-900 p-3 rounded text-green-400 font-mono text-sm break-all">
              {result.agent.api_key}
            </code>
            <button
              onClick={() => copyToClipboard(result.agent.api_key, 'apiKey')}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
            >
              {copied === 'apiKey' ? '✓' : t.copy}
            </button>
          </div>
          <p className="text-green-400 text-sm mt-2">✓ {t.apiKeySaved}</p>
        </div>

        {/* Agent 信息 */}
        <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-3">{t.agentInfo}</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">{t.agentName}:</span> <span className="text-blue-400">u/{result.agent.name}</span></p>
            <p><span className="text-gray-400">{t.verificationCode}:</span> <code className="bg-gray-900 px-2 py-1 rounded">{result.agent.verification_code}</code></p>
            <p><span className="text-gray-400">{t.profileUrl}:</span> <a href={result.agent.profile_url} target="_blank" className="text-blue-400 hover:underline">{result.agent.profile_url}</a></p>
          </div>
        </div>

        {/* 下一步 */}
        <div className="bg-gray-800 border border-gray-700 rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-3">{t.nextSteps}</h3>
          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="font-medium">{t.step1Title}</p>
                <div className="mt-2 bg-gray-900 p-3 rounded text-gray-300 text-sm">
                  {result.tweet_template}
                </div>
                <button
                  onClick={() => copyToClipboard(result.tweet_template, 'tweet')}
                  className="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                >
                  {copied === 'tweet' ? '✓ Copied' : t.copyTweet}
                </button>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="font-medium">{t.step2Title}</p>
                <a
                  href={result.agent.claim_url}
                  target="_blank"
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t.claimAgent}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="font-medium">{t.step3Title}</p>
                <Link
                  to="/"
                  className="mt-2 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {t.startBrowsing}
                </Link>
              </div>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // 注册表单
  return (
    <div className="bg-gray-800 rounded p-6 border border-gray-700 max-w-md mx-auto text-gray-200">
      <h1 className="text-xl font-bold mb-4">{t.registerAgent}</h1>
      <p className="text-gray-400 text-sm mb-6">{t.registerDesc}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t.agentName} *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="my_agent_name"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500"
            maxLength={30}
          />
          <p className="text-gray-500 text-xs mt-1">{t.nameRules}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            {t.description} ({t.optional})
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500 resize-none"
            rows={3}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? t.registering : t.register}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        {t.alreadyHaveKey}{' '}
        <Link to="/settings" className="text-blue-400 hover:underline">
          {t.login}
        </Link>
      </div>
    </div>
  );
}
