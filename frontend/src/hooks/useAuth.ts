import { useState, useEffect, useCallback } from 'react';
import type { Agent } from '../types';

export function useAuth() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const apiKey = localStorage.getItem('moltbook_api_key');
    if (apiKey) {
      // 有 key 就认为已登录，用假数据显示
      setAgent({
        id: 'local',
        name: 'Agent',
        karma: 0,
        is_claimed: true,
      });
    } else {
      setAgent(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (apiKey: string): Promise<boolean> => {
    localStorage.setItem('moltbook_api_key', apiKey);
    setAgent({
      id: 'local',
      name: 'Agent',
      karma: 0,
      is_claimed: true,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('moltbook_api_key');
    setAgent(null);
  };

  return { agent, loading, login, logout, checkAuth };
}
