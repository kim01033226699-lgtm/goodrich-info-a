import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import UserPage from './pages/UserPage';
import MProjectPage from './pages/MProjectPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('./config.json');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('설정 파일 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <Router basename="/goodrich-info-a">
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/settlement-education" element={<UserPage config={config} />} />
        <Route path="/m-project" element={<MProjectPage config={config} />} />
        <Route path="/djemals" element={<AdminPage config={config} onUpdateConfig={updateConfig} />} />
      </Routes>
    </Router>
  );
}

export default App;
