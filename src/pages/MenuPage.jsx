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
      title: '활동수수료',
      description: '활동수수료 I,II 제도 안내',
      path: '/activity-fee',
      available: true
    },
    {
      id: 3,
      title: '영업관리자 지원금',
      description: '위임 자격 및 지원금 계산',
      path: '/m-project',
      available: true
    }
  ];

  return (
    <div className="menu-page">
      {/* Header */}
      <header className="menu-header">
        <div className="container">
          <h1 className="menu-title">굿리치 지원금 안내</h1>
          <p className="menu-subtitle"></p>
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
          <p>무단복제금지. 요약내용으로 규정 확인 바람</p>
        </div>
      </footer>
    </div>
  );
}

export default MenuPage;
