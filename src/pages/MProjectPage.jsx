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
    const periodMap = { '1년이상': 1, '2년이상': 2 };
    const inputValue = periodMap[inputPeriod] || 0;
    const minValue = periodMap[minPeriod] || 0;

    if (minPeriod === '2년이상') {
      return inputValue >= 2;
    }
    return inputValue >= minValue;
  };

  const checkQualification = () => {
    if (!position || !career || !period || !income || !members || !teamIncome) {
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

    // ✅ 입력된 만원 단위를 원단위로 변환
    const incomeNum = Number(income) * 10000;
    const membersNum = Number(members);
    const teamIncomeNum = Number(teamIncome) * 10000;

    console.log('입력값(원단위 변환):', { career, period, income: incomeNum, members: membersNum, teamIncome: teamIncomeNum });

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

    // 등급 계산
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

    const criteria2 = gradeConfig.grades;
    let calculatedGrade = '';

    if (teamIncomeNum >= criteria2.S) {
      calculatedGrade = 'S';
    } else if (teamIncomeNum >= criteria2.A) {
      calculatedGrade = 'A';
    } else if (teamIncomeNum >= criteria2.B) {
      calculatedGrade = 'B';
    } else {
      calculatedGrade = 'C';
    }

    setGrade(calculatedGrade);

    const supportData = supportConfig.supports[calculatedGrade];
    if (!supportData) {
      alert(`${calculatedGrade} 등급의 지원금 데이터를 찾을 수 없습니다.`);
      return;
    }

    let totalSupport = supportData.total;
    let additionalSupport = 0;

    if (calculatedGrade === 'S' || calculatedGrade === 'A') {
      additionalSupport = Math.floor(incomeNum * 0.1);
      totalSupport += additionalSupport;
    }

    setResult({
      position,
      grade: calculatedGrade,
      ...supportData,
      totalSupport,
      additionalSupport,
      bonusApplied: (calculatedGrade === 'S' || calculatedGrade === 'A')
    });

    // 바로 결과 페이지로 이동 (Step 2 제거)
    setStep(2);
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


      {/* Main Content */}
      <main className="main-content">
        <div className="container">

          {/* Step 1: 자격 확인 */}
          {step === 1 && (
            <div className="step-card fade-in">
              <h2 className="step-title">위임 자격 확인</h2>

              <div className="form-group">
                <label>굿리치 위촉 직급</label>
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
                  <option value="1년이상">1년이상</option>
                  <option value="2년이상">2년이상</option>
                </select>
              </div>

              <div className="form-group">
                <label>동반위촉인원(본인포함)</label>
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

              <div className="form-group">
                <label>본인 직전 1년 소득</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayIncome}
                  onChange={(e) => handleIncomeChange(e, setIncome, setDisplayIncome)}
                  placeholder="0"
                  className="text-input"
                />
                <span className="input-suffix">만원</span>
              </div>

              <div className="form-group">
                <label>산하조직소득합계(본인포함)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayTeamIncome}
                  onChange={(e) => handleIncomeChange(e, setTeamIncome, setDisplayTeamIncome)}
                  placeholder="0"
                  className="text-input"
                />
                <span className="input-suffix">만원</span>
              </div>

              <div className="checkbox-group">
                <p className="checkbox-description">아래 내용에 해당하지 않습니다.</p>
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
                <button onClick={checkQualification} className="btn-primary btn-large">지원금 확인</button>
                <button onClick={handleReset} className="btn-secondary">다시하기</button>
              </div>
            </div>
          )}

          {/* Step 2: 결과 */}
          {step === 2 && result && (
            <div className="fade-in">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="result-title">지원금 안내</h2>
                  <div className="result-summary">
                    <p className="result-position">위임 직급: <strong>{result.position}</strong></p>
                    <p className="result-grade">적용 Grade: <strong>{result.grade}</strong></p>
                    <p className="result-amount">지원금액: <strong>{formatNumber(Math.floor(result.total / 10000))}</strong> 만원</p>
                    {result.bonusApplied && (
                      <p className="result-additional">추가지급: <strong>{formatNumber(Math.floor(result.additionalSupport / 10000))}</strong> 만원
                        <span className="additional-note">(S,A등급만 추가지급 / 추가지급금은 재정보증 필수)</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="result-details-grid">
                  <div className="detail-item-center">
                    <div className="yearly-goal-title">연간업적목표(정산평가업적)</div>
                    <div className="yearly-goal-amount">
                      {formatNumber(Math.floor(result.yearly / 10000))} 만원
                      <span className="monthly-amount">(월 {formatNumber(Math.floor(result.monthly / 10000))}만원)</span>
                    </div>
                  </div>
                </div>

                <div className="notice-section-center">
                  <ul className="notice-list-center">
                    <li>지원금에 대한 재정보증 필수</li>
                    <li>6개월 선지급가능(재정보증 필수)</li>
                    <li>Grade 상향은 불가</li>
                  </ul>
                </div>
              </div>

              <button onClick={handleReset} className="btn-secondary btn-large">다시하기</button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 굿리치 지원금 안내. All rights reserved. (v1.0)</p>
        </div>
      </footer>
    </div>
  );
}

export default MProjectPage;
