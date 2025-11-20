import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { calculateSupport, formatCurrency, formatNumber } from '../utils/calculator';
import './ActivityFeeDetailPage.css';

function ActivityFeeDetailPage({ config }) {
  const { type } = useParams();
  const isType1 = type === 'type1';

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [result, setResult] = useState(null);
  const [incomeError, setIncomeError] = useState(false);

  // 소득 입력 핸들러
  const handleIncomeChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value);
      setDisplayIncome(value ? formatNumber(value) : '');
      if (incomeError) setIncomeError(false);
    }
  };

  // 지원금 확인 핸들러
  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!income || Number(income) < 0) {
      setIncomeError(true);
      return;
    }

    if (!config) {
      alert('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const incomeInWon = Number(income) * 10000;
    const calculationResult = calculateSupport(incomeInWon, config);
    setResult(calculationResult);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setIncome('');
    setDisplayIncome('');
    setResult(null);
    setIncomeError(false);
  };

  // 모달 열기
  const handleOpenModal = (e) => {
    e.preventDefault();
    if (!config) {
      alert('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="activity-fee-detail-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">
            {isType1 ? '활동수수료 I' : '활동수수료 II'}
          </h1>
          <p className="subtitle">
            {isType1 ? '소득무관' : '소득 2천만원이상'}
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
                <p>
                  * {isType1 ? '총 지원한도' : '지원 한도'}:{' '}
                  <span className="highlight">
                    {isType1 ? '2,000만원' : '정착교육비 지원 한도 내'}
                  </span>
                  {!isType1 && (
                    <button onClick={handleOpenModal} className="check-limit-button">
                      내 한도 확인하기
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 활동수수료 예시 - 별도 카드 */}
          <div className={`example-card ${isType1 ? 'example-card-type1' : 'example-card-type2'}`}>
            <div className="example-header">
              <h2 className="example-title">{isType1 ? '활동수수료 예시 I(50%지급형)' : '활동수수료 II(100%지급형) 예시'}</h2>
            </div>
            <div className="example-body">
              {isType1 ? (
                <>
                  <p>* 정산평가업적 매월 100만원 → 50만원 × 12개월 = 600만원</p>
                  <p>* 누적 지급 한도 2천만 내</p>
                </>
              ) : (
                <p>정산평가업적 매월 100만원 → 100만원 × 24개월 = 2,400만원 (단 지급한도 내에서 지급)</p>
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
              <p>- 36개월 이내 해촉 시 지원금 전액 <span className="refund-highlight">환수</span></p>
              <p>- 미유지 계약 발생 시 정산<span className="refund-highlight">환수</span>율에 따라 <span className="refund-highlight">환수</span> 적용</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>무단복제금지. 요약내용으로 규정 확인 바람</p>
        </div>
      </footer>

      {/* 지원금 확인 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">정착교육비 지원금 확인</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleIncomeSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">본인 연소득</label>
                  <div className="input-row">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9,]*"
                        value={displayIncome}
                        onChange={handleIncomeChange}
                        placeholder="0"
                        className={`modal-input ${incomeError ? 'input-error' : ''}`}
                        autoFocus
                      />
                      <span className="input-suffix">만원</span>
                    </div>
                    <button type="submit" className="modal-btn-primary">확인</button>
                  </div>
                  {incomeError && <span className="error-message">연소득을 입력해주세요</span>}
                </div>
              </form>

              {result && (
                <div className="modal-result">
                  <div className="result-amount">{formatCurrency(result.amount)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityFeeDetailPage;
