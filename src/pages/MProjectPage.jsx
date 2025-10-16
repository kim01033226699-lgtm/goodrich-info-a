import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../utils/calculator';
import './MProjectPage.css';

function MProjectPage({ config }) {
  // config에서 기준표 가져오기
  const getQualificationCriteria = () => {
    if (!config?.mProject?.qualificationCriteria) return {};
    return config.mProject.qualificationCriteria.reduce((acc, item) => {
      acc[item.position] = item;
      return acc;
    }, {});
  };

  const getGradeCriteria = () => {
    if (!config?.mProject?.gradeCriteria) return {};
    return config.mProject.gradeCriteria.reduce((acc, item) => {
      acc[item.position] = item.grades;
      return acc;
    }, {});
  };

  const getSupportCriteria = () => {
    if (!config?.mProject?.supportCriteria) return {};
    return config.mProject.supportCriteria.reduce((acc, item) => {
      acc[item.position] = item.supports;
      return acc;
    }, {});
  };
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

  // 기간 비교 함수
  const comparePeriod = (inputPeriod, minPeriod) => {
    const periodMap = { '1년': 1, '2년': 2, '2년이상': 2 };
    const inputValue = periodMap[inputPeriod] || 0;
    const minValue = periodMap[minPeriod] || 0;

    if (minPeriod === '2년이상') {
      return inputValue >= 2;
    }
    return inputValue >= minValue;
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

    // config에서 직접 찾기
    const criteria = config?.mProject?.qualificationCriteria?.find(
      item => item.position === position
    );

    if (!criteria) {
      console.error('자격 기준을 찾을 수 없습니다:', position, config?.mProject?.qualificationCriteria);
      alert('자격 기준 데이터를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
      return;
    }

    const incomeNum = Number(income);
    const membersNum = Number(members);

    // 디버깅 로그
    console.log('입력값:', JSON.stringify({ career, period, income: incomeNum, members: membersNum }, null, 2));
    console.log('기준값:', JSON.stringify(criteria, null, 2));

    // 경력과 기간 조합 체크 (careerOptions 중 하나라도 맞으면 OK)
    const careerPeriodMatch = criteria.careerOptions?.some(option => {
      const careerMatch = career === option.career;
      const periodMatch = comparePeriod(period, option.minPeriod);
      console.log(`경력/기간 체크: "${career}" === "${option.career}" && "${period}" >= "${option.minPeriod}" = ${careerMatch && periodMatch}`);
      return careerMatch && periodMatch;
    }) || false;

    const incomeMatch = incomeNum >= criteria.income;
    const membersMatch = membersNum >= criteria.members;

    console.log('매칭 결과:', JSON.stringify({ careerPeriodMatch, incomeMatch, membersMatch }, null, 2));
    console.log('소득 매칭:', `${incomeNum} >= ${criteria.income} = ${incomeMatch}`);
    console.log('인원 매칭:', `${membersNum} >= ${criteria.members} = ${membersMatch}`);

    const isQualified = careerPeriodMatch && incomeMatch && membersMatch;

    setQualified(isQualified);

    // 자격 충족 시 자동으로 다음 단계로 이동
    if (isQualified) {
      setStep(2);
    }
  };

  const calculateGrade = () => {
    if (!teamIncome) {
      alert('소득을 입력해주세요.');
      return;
    }

    const teamIncomeNum = Number(teamIncome);

    // config에서 직접 찾기
    const gradeConfig = config?.mProject?.gradeCriteria?.find(
      item => item.position === position
    );

    const supportConfig = config?.mProject?.supportCriteria?.find(
      item => item.position === position
    );

    if (!gradeConfig || !supportConfig) {
      alert('등급 기준 데이터를 찾을 수 없습니다.');
      return;
    }

    const criteria = gradeConfig.grades;

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
    const supportData = supportConfig.supports[calculatedGrade];

    if (!supportData) {
      alert(`${calculatedGrade} 등급의 지원금 데이터를 찾을 수 없습니다.`);
      return;
    }

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

  if (!config) {
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
    <div className="mproject-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">{config?.pageMetadata?.mProject?.title || 'M-Project'}</h1>
          <p className="subtitle">{config?.pageMetadata?.mProject?.subtitle || '위임 자격 및 지원금 계산'}</p>
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
                <label>본인 경력(보험회사&GA)</label>
                <select value={career} onChange={(e) => setCareer(e.target.value)} className="select-input">
                  <option value="">선택하세요</option>
                  <option value="본부장 or 관리자">본부장 or 관리자</option>
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
                {config.mProject?.checkboxLabels?.map((label, index) => (
                  <label key={index} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checks[index]}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="button-group">
                <button onClick={handleReset} className="btn-secondary">처음부터 다시하기</button>
                <button onClick={checkQualification} className="btn-primary btn-large">자격 확인</button>
              </div>

              {qualified === false && (
                <div className="qualification-result warning">
                  <p className="result-message">입력한 내용이 당사 규정을 충족하지 못했습니다. 위임을 위해서는 입력 사항을 확인해 주시고 계속 진행하여 예상 금액은 확인할 수 있습니다.</p>
                  <button onClick={() => setStep(2)} className="btn-secondary">계속 진행</button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: 등급 산정 */}
          {step === 2 && (
            <div className="step-card fade-in">
              <h2 className="step-title">지원 등급 산정</h2>

              <div className="info-box">
                <p>{config.mProject?.step2InfoText || '동반 위촉 산하 조직 전원의 직전 1년 보험영업 소득 합계액을 입력하세요.'}</p>
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
                <button onClick={handleReset} className="btn-secondary">처음부터 다시하기</button>
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
                      <li>✓ {config.mProject?.bonusText?.replace('{grade}', result.grade) || `Grade ${result.grade}의 경우 본인 직전1년 소득의 10% 추가 지급되었습니다.`}</li>
                    )}
                    {config.mProject?.noticeTexts?.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
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
