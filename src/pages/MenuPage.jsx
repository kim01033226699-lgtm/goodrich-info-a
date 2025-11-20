import { Link } from 'react-router-dom';
import './MenuPage.css';
// import BottomNavigation from '../components/BottomNavigation';

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

  // 하단 네비게이션 메뉴 아이템
  const navItems = [
    {
      label: '지원금',
      icon: '💰',
      url: '/goodrich-info-a/',
      path: '/goodrich-info-a'
    },
    {
      label: '금융캠퍼스',
      icon: '🎓',
      url: 'https://kim01033226699-lgtm.github.io/gfe',
      path: '/gfe'
    },
    {
      label: '스마트위촉',
      icon: '📋',
      url: 'https://kim01033226699-lgtm.github.io/appoint_info/',
      path: '/appoint_info'
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
        </div>
      </footer>

      {/* 모바일 하단 네비게이션 */}
      {/* <BottomNavigation items={navItems} currentPath="/goodrich-info-a" /> */}
    </div>
  );
}

export default MenuPage;
