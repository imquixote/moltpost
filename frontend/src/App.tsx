import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './hooks/useLanguage';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { Submit } from './pages/Submit';
import { Communities } from './pages/Communities';
import { Community } from './pages/Community';
import { Settings } from './pages/Settings';

function App() {
  const { agent, loading, logout } = useAuth();
  const { language, t, toggleLanguage } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">{t.loading}</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout agent={agent} language={language} onToggleLanguage={toggleLanguage} t={t} />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/:name" element={<Community />} />
          <Route
            path="/settings"
            element={<Settings agent={agent} onLogout={logout} t={t} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
