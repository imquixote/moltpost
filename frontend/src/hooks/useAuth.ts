import { useState, useEffect, useCallback } from 'react';
import type { Agent } from '../types';

export interface StoredAgent {
  name: string;
  apiKey: string;
  addedAt: string;
}

const AGENTS_KEY = 'moltbook_agents';
const CURRENT_KEY = 'moltbook_current_agent';
const LEGACY_KEY = 'moltbook_api_key';

function getStoredAgents(): StoredAgent[] {
  try {
    const data = localStorage.getItem(AGENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredAgents(agents: StoredAgent[]) {
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}

function getCurrentAgentName(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

function setCurrentAgentName(name: string | null) {
  if (name) {
    localStorage.setItem(CURRENT_KEY, name);
  } else {
    localStorage.removeItem(CURRENT_KEY);
  }
}

// 迁移旧的单 key 存储
function migrateLegacyKey() {
  const legacyKey = localStorage.getItem(LEGACY_KEY);
  if (legacyKey && getStoredAgents().length === 0) {
    const agent: StoredAgent = {
      name: 'Agent',
      apiKey: legacyKey,
      addedAt: new Date().toISOString(),
    };
    saveStoredAgents([agent]);
    setCurrentAgentName(agent.name);
    localStorage.removeItem(LEGACY_KEY);
  }
}

export function useAuth() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<StoredAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgents = useCallback(() => {
    migrateLegacyKey();
    const storedAgents = getStoredAgents();
    setAgents(storedAgents);
    
    const currentName = getCurrentAgentName();
    const current = storedAgents.find(a => a.name === currentName) || storedAgents[0];
    
    if (current) {
      setAgent({
        id: 'local',
        name: current.name,
        karma: 0,
        is_claimed: true,
      });
      // 同步更新 legacy key 供 API 调用使用
      localStorage.setItem(LEGACY_KEY, current.apiKey);
      setCurrentAgentName(current.name);
    } else {
      setAgent(null);
      localStorage.removeItem(LEGACY_KEY);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const addAgent = (name: string, apiKey: string) => {
    const storedAgents = getStoredAgents();
    // 检查是否已存在同名 agent
    const existingIndex = storedAgents.findIndex(a => a.name === name);
    if (existingIndex >= 0) {
      // 更新已有的
      storedAgents[existingIndex].apiKey = apiKey;
    } else {
      storedAgents.push({
        name,
        apiKey,
        addedAt: new Date().toISOString(),
      });
    }
    saveStoredAgents(storedAgents);
    setAgents(storedAgents);
    switchAgent(name);
  };

  const switchAgent = (name: string) => {
    const storedAgents = getStoredAgents();
    const target = storedAgents.find(a => a.name === name);
    if (target) {
      setCurrentAgentName(name);
      localStorage.setItem(LEGACY_KEY, target.apiKey);
      setAgent({
        id: 'local',
        name: target.name,
        karma: 0,
        is_claimed: true,
      });
    }
  };

  const removeAgent = (name: string) => {
    let storedAgents = getStoredAgents();
    storedAgents = storedAgents.filter(a => a.name !== name);
    saveStoredAgents(storedAgents);
    setAgents(storedAgents);
    
    // 如果删除的是当前 agent，切换到第一个
    if (getCurrentAgentName() === name) {
      if (storedAgents.length > 0) {
        switchAgent(storedAgents[0].name);
      } else {
        setCurrentAgentName(null);
        localStorage.removeItem(LEGACY_KEY);
        setAgent(null);
      }
    }
  };

  const logout = () => {
    // 清除所有 agents
    localStorage.removeItem(AGENTS_KEY);
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(LEGACY_KEY);
    setAgents([]);
    setAgent(null);
  };

  return { 
    agent, 
    agents,
    loading, 
    addAgent,
    switchAgent,
    removeAgent,
    logout, 
  };
}
