import { useParams, Link } from 'react-router-dom';
import './ActivityFeeDetailPage.css';

function ActivityFeeDetailPage() {
  const { type } = useParams();
  const isType1 = type === 'type1';

  return (
    <div className="activity-fee-detail-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">
            {isType1 ? '활동수수료 I' : '활동수수료 II'}
          </h1>
          <p className="subtitle">
            {isType1 ? '소득무관 · 12개월 50% 지급형' : '소득 2천만 원 이상 · 24개월 100% 지급형'}
          </p>
          <div className="header-links">
            <Link to="/activity-fee" className="back-link">← 뒤로</Link>
            <Link to="/" className="home-link">홈으로</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* 세부 정보 */}
          <div className={`detail-card ${isType1 ? 'detail-card-type1' : 'detail-card-type2'}`}>
            <div className="detail-header">
              <h2 className="detail-title">세부 내역</h2>
            </div>
            <div className="detail-body">
              <div className="detail-info">
                <p>* 지급기간: <span className="highlight">{isType1 ? '12개월' : '24개월'}</span></p>
                <p>* 지급률: 정산평가업적 대비 <span className="highlight">{isType1 ? '50%' : '100%'}</span></p>
                <p>* {isType1 ? '총 지원한도' : '지원 한도'}: <span className="highlight">{isType1 ? '2,000만원' : '사전 협의'}</span></p>
              </div>
            </div>
          </div>

          {/* 활동수수료 예시 - 별도 카드 */}
          <div className={`example-card ${isType1 ? 'example-card-type1' : 'example-card-type2'}`}>
            <div className="example-header">
              <h2 className="example-title">{isType1 ? '활동수수료 I' : '활동수수료 II'} 예시</h2>
            </div>
            <div className="example-body">
              {isType1 ? (
                <>
                  <p>* 정산평가업적 매월 330만원 → 165만원 × 12개월 = 1,980만원</p>
                  <p>* 정산평가업적 매월 350만원 → 175만원 × 11개월 = 1,925만원 + 12개월차 75만원(한도 2,000만원 적용)</p>
                </>
              ) : (
                <p>* 정산평가업적 매월 330만원 → 165만원 × 24개월 = 3,960만원 (단, 사전에 지급한도 내에서 지급)</p>
              )}
            </div>
          </div>

          {/* 필수 안내 */}
          <div className="notice-section">
            <div className="notice-header">
              <h3 className="notice-title">필수 안내</h3>
            </div>
            <div className="notice-content">
              <p>- 별도의 요청서로 신청 가능</p>
              <p>- 월 정산평가업적 50만원 이상 시 지급</p>
              <p>- 위촉 의무기간: 36개월</p>
              <p className="notice-subtitle notice-subtitle-margin">환수</p>
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

export default ActivityFeeDetailPage;
