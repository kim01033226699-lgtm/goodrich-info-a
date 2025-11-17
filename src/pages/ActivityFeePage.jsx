import { Link } from 'react-router-dom';
import './ActivityFeePage.css';

function ActivityFeePage() {
  return (
    <div className="activity-fee-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">활동수수료 안내</h1>
          <p className="subtitle">활동수수료 I, II 제도 안내입니다</p>
          <div className="header-links">
            <Link to="/" className="home-link">홈으로</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* 제도 공통 사항 */}
          <div className="info-section common-info">
            <h2 className="section-title">활동수수료 제도 공통 사항</h2>
            <ul className="info-list">
              <li>별도의 요청서로 신청 가능</li>
              <li>월 정산평가업적 <span className="highlight-blue">50만원 이상</span> 시 지급</li>
              <li>지급률: 신계약 정산평가업적 대비 <span className="highlight-blue">활동수수료 I(50%) · II(100%)</span> 지급</li>
              <li>위촉 의무기간: <span className="highlight-blue">36개월</span></li>
            </ul>
          </div>

          {/* 활동수수료 카드 섹션 */}
          <div className="fee-cards-section">
            {/* 활동수수료 I */}
            <div className="fee-card fee-card-type1">
              <div className="fee-card-header">
                <h3 className="fee-card-title">활동수수료 I (12개월 50% 지급형)</h3>
              </div>
              <div className="fee-card-body">
                <div className="fee-info-simple">
                  <p>* 지급기간: <span className="highlight">12개월</span></p>
                  <p>* 지급률: 정산평가업적 대비 <span className="highlight">50%</span></p>
                  <p>* 총 지원한도: <span className="highlight">2,000만원</span></p>
                </div>

                <div className="fee-example">
                  <h4 className="example-title">활동수수료 I 예시</h4>
                  <div className="example-simple">
                    <p>* 정산평가업적 매월 330만원 → 165만원 × 12개월 = 1,980만원</p>
                    <p>* 정산평가업적 매월 350만원 → 175만원 × 11개월 = 1,925만원 + 12개월차 75만원(한도 2,000만원 적용)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 활동수수료 II */}
            <div className="fee-card fee-card-type2">
              <div className="fee-card-header">
                <h3 className="fee-card-title">활동수수료 II (24개월 100% 지급형)</h3>
              </div>
              <div className="fee-card-body">
                <div className="fee-info-simple">
                  <p>* 지급기간: <span className="highlight">24개월</span></p>
                  <p>* 지급률: 정산평가업적 대비 <span className="highlight">100%</span></p>
                  <p>* 지원 한도: <span className="highlight">사전 협의</span></p>
                </div>

                <div className="fee-example">
                  <h4 className="example-title">활동수수료 II 예시</h4>
                  <div className="example-simple">
                    <p>* 정산평가업적 매월 330만원 → 165만원 × 24개월 = 3,960만원 (단, 사전에 지급한도 내에서 지급)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 필수 안내 */}
          <div className="notice-section">
            <div className="notice-header">
              <h3 className="notice-title">공통사항</h3>
            </div>
            <div className="notice-content">
              <p>- 36개월 이내 해촉 시 지원금 전액 환수</p>
              <p>- 미유지 계약 발생 시 정산환수율에 따라 환수 적용</p>
            </div>
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
