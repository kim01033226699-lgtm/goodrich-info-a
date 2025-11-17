import { Link } from 'react-router-dom';
import './ActivityFeePage.css';

function ActivityFeePage() {
  return (
    <div className="activity-fee-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">활동수수료 안내</h1>
          <p className="subtitle">원하시는 활동수수료 제도를 선택해주세요</p>
          <div className="header-links">
            <Link to="/" className="home-link">홈으로</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* 선택 카드 섹션 */}
          <div className="fee-selection-section">
            {/* 활동수수료 I */}
            <Link to="/activity-fee/type1" className="selection-card selection-card-type1">
              <div className="selection-card-header">
                <h2 className="selection-card-title">활동수수료 I</h2>
                <p className="selection-card-subtitle">소득무관</p>
              </div>
              <div className="selection-arrow">→</div>
            </Link>

            {/* 활동수수료 II */}
            <Link to="/activity-fee/type2" className="selection-card selection-card-type2">
              <div className="selection-card-header">
                <h2 className="selection-card-title">활동수수료 II</h2>
                <p className="selection-card-subtitle">소득 2천만 원 이상</p>
              </div>
              <div className="selection-arrow">→</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 굿리치 영업지원 시스템. All rights reserved.</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>
            모든 정보는 내부 교육 자료이며, 무단 전재 및 배포를 금지합니다. 정확한 금액, 기준은 규정을 따르며 본 안내와 다를 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ActivityFeePage;
