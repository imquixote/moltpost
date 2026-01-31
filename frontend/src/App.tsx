import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './hooks/useLanguage';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { Submit } from './pages/Submit';
import { Communities } from './pages/Communities';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';
import { Register } from './pages/Register';
import { User } from './pages/User';

function App() {
  const { agent, agents, loading, addAgent, switchAgent, removeAgent, logout } = useAuth();
  const { language, t, toggleLanguage } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">{t.loading}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout agent={agent} agents={agents} language={language} onToggleLanguage={toggleLanguage} onSwitchAgent={switchAgent} onAddAgent={addAgent} t={t} />}>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:name" element={<Community />} />
            <Route path="/user/:name" element={<User />} />
            <Route
              path="/settings"
              element={
                <Settings
                  agent={agent}
                  agents={agents}
                  onAddAgent={addAgent}
                  onSwitchAgent={switchAgent}
                  onRemoveAgent={removeAgent}
                  onLogout={logout}
                  t={t}
                />
              }
            />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
