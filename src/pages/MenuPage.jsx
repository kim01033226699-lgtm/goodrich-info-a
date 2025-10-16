import { Link } from 'react-router-dom';
import './MenuPage.css';

function MenuPage() {
  const menus = [
    {
      id: 1,
      title: '정착교육비',
      description: '정착교육비 지원금 계산',
      path: '/settlement-education',
      available: true
    },
    {
      id: 2,
      title: '지원금 메뉴 2',
      description: '준비 중입니다',
      path: '#',
      available: false
    },
    {
      id: 3,
      title: '지원금 메뉴 3',
      description: '준비 중입니다',
      path: '#',
      available: false
    },
    {
      id: 4,
      title: '지원금 메뉴 4',
      description: '준비 중입니다',
      path: '#',
      available: false
    }
  ];

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <div className="container">
          <h1 className="menu-title">굿리치 지원금 안내</h1>
          <p className="menu-subtitle">굿리치 지원금에 대해 빠르고 간략하게 설명드립니다.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="menu-content">
        <div className="container">
          <div className="menu-grid">
            {menus.map(menu => (
              menu.available ? (
                <Link
                  key={menu.id}
                  to={menu.path}
                  className="menu-box"
                >
                  <div className="menu-box-inner">
                    <h2 className="menu-box-title">{menu.title}</h2>
                    <p className="menu-box-desc">{menu.description}</p>
                    <div className="menu-box-arrow">→</div>
                  </div>
                </Link>
              ) : (
                <div
                  key={menu.id}
                  className="menu-box disabled"
                >
                  <div className="menu-box-inner">
                    <h2 className="menu-box-title">{menu.title}</h2>
                    <p className="menu-box-desc">{menu.description}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="menu-footer">
        <div className="container">
          <p>&copy; 2025 굿리치 정착교육비 안내 시스템. All rights reserved. (v1.0)</p>
        </div>
      </footer>
    </div>
  );
}

export default MenuPage;
