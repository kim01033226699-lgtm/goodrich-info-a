import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../utils/calculator';
import './MProjectPage.css';

// 자격 기준표
const QUALIFICATION_CRITERIA = {
  '본부장': { career: '본부장', period: '1년', income: 80000000, members: 30 },
  '사업단장': { career: '관리자', period: '2년', income: 60000000, members: 15 },
  '지점장': { career: '보험영업', period: '2년이상', income: 40000000, members: 4 }
};

// 등급 기준표
const GRADE_CRITERIA = {
  '본부장': { S: 150000000, A: 120000000, B: 96000000 },
  '사업단장': { S: 96000000, A: 96000000, B: 96000000 },
  '지점장': { S: 96000000, A: 96000000, B: 96000000 }
};

// 지원금 기준표
const SUPPORT_CRITERIA = {
  '본부장': {
    S: { monthly: 30000000, yearly: 360000000, monthlySupport: 8000000, total: 96000000 },
    A: { monthly: 24000000, yearly: 288000000, monthlySupport: 7000000, total: 84000000 },
    B: { monthly: 20000000, yearly: 240000000, monthlySupport: 5000000, total: 60000000 }
  },
  '사업단장': {
    S: { monthly: 15000000, yearly: 180000000, monthlySupport: 7000000, total: 84000000 },
    A: { monthly: 12000000, yearly: 144000000, monthlySupport: 5000000, total: 60000000 },
    B: { monthly: 9000000, yearly: 108000000, monthlySupport: 4000000, total: 48000000 }
  },
  '지점장': {
    S: { monthly: 5000000, yearly: 60000000, monthlySupport: 5000000, total: 60000000 },
    A: { monthly: 4000000, yearly: 48000000, monthlySupport: 4000000, total: 48000000 },
    B: { monthly: 3500000, yearly: 42000000, monthlySupport: 3000000, total: 36000000 },
    C: { monthly: 3000000, yearly: 36000000, monthlySupport: 2000000, total: 24000000 }
  }
};

function MProjectPage() {
  const [step, setStep] = useState(1);

  // Step 1 상태
  const [position, setPosition] = useState('');
  const [career, setCareer] = useState('');
  const [period, setPeriod] = useState('');
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [members, setMembers] = useState('');
  const [checks, setChecks] = useState([false, false, false]);
  const [qualified, setQualified] = useState(null);

  // Step 2 상태
  const [teamIncome, setTeamIncome] = useState('');
  const [displayTeamIncome, setDisplayTeamIncome] = useState('');
  const [grade, setGrade] = useState('');

  // Step 3 결과
  const [result, setResult] = useState(null);

  const handleIncomeChange = (e, setter, displaySetter) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
      displaySetter(value ? formatNumber(value) : '');
    }
  };

  const handleCheckboxChange = (index) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const checkQualification = () => {
    if (!position || !career || !period || !income || !members) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (!checks.every(check => check)) {
      alert('모든 체크 항목에 동의해주세요.');
      return;
    }

    const criteria = QUALIFICATION_CRITERIA[position];
    const incomeNum = Number(income);
    const membersNum = Number(members);

    const isQualified =
      career === criteria.career &&
      period === criteria.period &&
      incomeNum >= criteria.income &&
      membersNum >= criteria.members;

    setQualified(isQualified);
  };

  const calculateGrade = () => {
    if (!teamIncome) {
      alert('소득을 입력해주세요.');
      return;
    }

    const teamIncomeNum = Number(teamIncome);
    const criteria = GRADE_CRITERIA[position];

    let calculatedGrade = '';
    if (teamIncomeNum >= criteria.S) {
      calculatedGrade = 'S';
    } else if (teamIncomeNum >= criteria.A) {
      calculatedGrade = 'A';
    } else if (teamIncomeNum >= criteria.B) {
      calculatedGrade = 'B';
    } else {
      calculatedGrade = 'C';
    }

    setGrade(calculatedGrade);

    // 결과 계산
    const supportData = SUPPORT_CRITERIA[position][calculatedGrade];
    let totalSupport = supportData.total;

    // Grade S, A의 경우 본인 직전1년 소득의 10% 추가지급
    if (calculatedGrade === 'S' || calculatedGrade === 'A') {
      totalSupport += Math.floor(Number(income) * 0.1);
    }

    setResult({
      position,
      grade: calculatedGrade,
      ...supportData,
      totalSupport,
      bonusApplied: (calculatedGrade === 'S' || calculatedGrade === 'A')
    });

    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setPosition('');
    setCareer('');
    setPeriod('');
    setIncome('');
    setDisplayIncome('');
    setMembers('');
    setChecks([false, false, false]);
    setQualified(null);
    setTeamIncome('');
    setDisplayTeamIncome('');
    setGrade('');
    setResult(null);
  };

  return (
    <div className="mproject-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">M-Project</h1>
          <p className="subtitle">위임 자격 및 지원금 계산</p>
          <div className="header-links">
            <Link to="/" className="home-link">홈으로</Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="progress-section">
        <div className="container">
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">자격 확인</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">등급 산정</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">결과 확인</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">

          {/* Step 1: 자격 확인 */}
          {step === 1 && (
            <div className="step-card fade-in">
              <h2 className="step-title">위임 자격 확인</h2>

              <div className="form-group">
                <label>당사 위임 직급</label>
                <select value={position} onChange={(e) => setPosition(e.target.value)} className="select-input">
                  <option value="">선택하세요</option>
                  <option value="본부장">본부장</option>
                  <option value="사업단장">사업단장</option>
                  <option value="지점장">지점장</option>
                </select>
              </div>

              <div className="form-group">
                <label>본인 경력</label>
                <select value={career} onChange={(e) => setCareer(e.target.value)} className="select-input">
                  <option value="">선택하세요</option>
                  <option value="본부장">본부장</option>
                  <option value="관리자">관리자</option>
                  <option value="보험영업">보험영업</option>
                </select>
              </div>

              <div className="form-group">
                <label>경력 기간</label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="select-input">
                  <option value="">선택하세요</option>
                  <option value="1년">1년</option>
                  <option value="2년">2년</option>
                  <option value="2년이상">2년이상</option>
                </select>
              </div>

              <div className="form-group">
                <label>본인 직전 1년 소득</label>
                <input
                  type="text"
                  value={displayIncome}
                  onChange={(e) => handleIncomeChange(e, setIncome, setDisplayIncome)}
                  placeholder="0"
                  className="text-input"
                />
                <span className="input-suffix">원</span>
              </div>

              <div className="form-group">
                <label>동반 위촉 인원 (본인 제외)</label>
                <input
                  type="number"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="0"
                  className="text-input"
                  min="0"
                />
                <span className="input-suffix">명</span>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checks[0]}
                    onChange={() => handleCheckboxChange(0)}
                  />
                  <span>타사에서 징계의 이유로 해임되지 않은 자</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checks[1]}
                    onChange={() => handleCheckboxChange(1)}
                  />
                  <span>최근 3년간 3회 이상 회사를 이동하지 않은 자</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={checks[2]}
                    onChange={() => handleCheckboxChange(2)}
                  />
                  <span>금융기관 등에 채무 불이행자는 입사 불가</span>
                </label>
              </div>

              <button onClick={checkQualification} className="btn-primary btn-large">
                자격 확인
              </button>

              {qualified !== null && (
                <div className={`qualification-result ${qualified ? 'success' : 'warning'}`}>
                  {qualified ? (
                    <>
                      <p className="result-message">✓ 위임 자격 요건을 충족합니다.</p>
                      <button onClick={() => setStep(2)} className="btn-primary">다음 단계</button>
                    </>
                  ) : (
                    <>
                      <p className="result-message">⚠ 당사 정책에 자격에 맞지 않습니다. 계속 진행하시겠습니까?</p>
                      <button onClick={() => setStep(2)} className="btn-secondary">계속 진행</button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: 등급 산정 */}
          {step === 2 && (
            <div className="step-card fade-in">
              <h2 className="step-title">지원 등급 산정</h2>

              <div className="info-box">
                <p>동반 위촉 산하 조직 전원의 직전 1년 보험영업 소득 합계액을 입력하세요.</p>
              </div>

              <div className="form-group">
                <label>산하 조직 소득 합계</label>
                <input
                  type="text"
                  value={displayTeamIncome}
                  onChange={(e) => handleIncomeChange(e, setTeamIncome, setDisplayTeamIncome)}
                  placeholder="0"
                  className="text-input large"
                />
                <span className="input-suffix">원</span>
              </div>

              <div className="button-group">
                <button onClick={() => setStep(1)} className="btn-secondary">이전 단계</button>
                <button onClick={calculateGrade} className="btn-primary btn-large">등급 산정</button>
              </div>
            </div>
          )}

          {/* Step 3: 결과 */}
          {step === 3 && result && (
            <div className="fade-in">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="result-title">지원 기준 안내</h2>
                  <div className="result-summary">
                    <p className="result-position">위임 직급: <strong>{result.position}</strong></p>
                    <p className="result-grade">적용 그레이드: <strong>{result.grade}</strong></p>
                    <p className="result-total">총 지원금: <strong>{formatCurrency(result.totalSupport)}</strong></p>
                  </div>
                </div>

                <div className="result-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">월 업적 목표</span>
                    <span className="detail-value">{formatCurrency(result.monthly)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">연간 업적 목표</span>
                    <span className="detail-value">{formatCurrency(result.yearly)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">월 지원금</span>
                    <span className="detail-value highlight">{formatCurrency(result.monthlySupport)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">총 지원금</span>
                    <span className="detail-value highlight">{formatCurrency(result.totalSupport)}</span>
                  </div>
                </div>

                <div className="notice-section">
                  <h3 className="notice-title">안내사항</h3>
                  <ul className="notice-list">
                    {result.bonusApplied && (
                      <li>✓ Grade {result.grade}의 경우 본인 직전1년 소득의 10% 추가 지급되었습니다.</li>
                    )}
                    <li>6개월 선지급 가능 (재정보증 필수)</li>
                    <li>내부 규정으로 Grade 상향은 불가합니다.</li>
                  </ul>
                </div>
              </div>

              <button onClick={handleReset} className="btn-secondary btn-large">처음부터 다시하기</button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 굿리치 정착교육비 안내 시스템. All rights reserved. (v1.0)</p>
        </div>
      </footer>
    </div>
  );
}

export default MProjectPage;
