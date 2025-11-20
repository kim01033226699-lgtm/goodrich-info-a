import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../utils/calculator';
import BottomNavigation from '../components/BottomNavigation';
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
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [members, setMembers] = useState('');
  const [qualified, setQualified] = useState(null);

  // Step 2 상태
  const [teamIncome, setTeamIncome] = useState('');
  const [displayTeamIncome, setDisplayTeamIncome] = useState('');
  const [grade, setGrade] = useState('');

  // Step 3 결과
  const [result, setResult] = useState(null);

  // 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);

  // 에러 상태
  const [positionError, setPositionError] = useState(false);
  const [membersError, setMembersError] = useState(false);
  const [teamIncomeError, setTeamIncomeError] = useState(false);

  const handleIncomeChange = (e, setter, displaySetter) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
      displaySetter(value ? formatNumber(value) : '');
    }
  };

  // 기존 경력/기간/체크박스 로직 제거 (요청사항에 따라 미사용)

  const checkQualification = () => {
    // 요청사항: 위임직급, 동반위촉, 산하조직소득 합계만으로 계산
    let hasError = false;

    if (!position) {
      setPositionError(true);
      hasError = true;
    }
    if (!members) {
      setMembersError(true);
      hasError = true;
    }
    if (!teamIncome) {
      setTeamIncomeError(true);
      hasError = true;
    }

    if (hasError) {
      // 첫 번째 에러 필드로 포커스 이동
      if (!position) {
        document.querySelector('select[name="position"]')?.focus();
      } else if (!members) {
        document.querySelector('input[name="members"]')?.focus();
      } else if (!teamIncome) {
        document.querySelector('input[name="teamIncome"]')?.focus();
      }
      return;
    }

    // config에서 직접 찾기
    const criteria = config?.mProject?.qualificationCriteria?.find(
      item => item.position === position
    );

    if (!criteria) {
      console.error('자격 기준을 찾을 수 없습니다:', position, config?.mProject?.qualificationCriteria);
      setModalMessage('자격 기준 데이터를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
      setShowModal(true);
      return;
    }

    // ✅ 입력된 만원 단위를 원단위로 변환
    const incomeNum = Number(income || 0) * 10000; // 본인 1년 소득은 추가금에만 반영
    const membersNum = Number(members);
    const teamIncomeNum = Number(teamIncome) * 10000;

    console.log('입력값(원단위 변환):', { members: membersNum, teamIncome: teamIncomeNum, income: incomeNum });
    // 요청사항: 자격판단은 단순화(직급/인원 기반), 계산 진행
    setQualified(true);

    // 등급 계산
    const gradeConfig = config?.mProject?.gradeCriteria?.find(
      item => item.position === position
    );
    const supportConfig = config?.mProject?.supportCriteria?.find(
      item => item.position === position
    );

    if (!gradeConfig || !supportConfig) {
      setModalMessage('등급 기준 데이터를 찾을 수 없습니다.');
      setShowModal(true);
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

    // C등급은 미달 처리
    if (calculatedGrade === 'C') {
      setTeamIncomeError(true);
      setModalMessage('당사 Grade규정에 맞지 않습니다. 기준을 확인하시고 소득을 수정해 주세요.');
      setShowModal(true);
      // 모달 닫힌 후 포커스 이동을 위한 타이머
      setTimeout(() => {
        document.querySelector('input[name="teamIncome"]')?.focus();
      }, 100);
      return;
    }

    const supportData = supportConfig.supports[calculatedGrade];
    if (!supportData) {
      setModalMessage(`${calculatedGrade} 등급의 지원금 데이터를 찾을 수 없습니다.`);
      setShowModal(true);
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
    setIncome('');
    setDisplayIncome('');
    setMembers('');
    setQualified(null);
    setTeamIncome('');
    setDisplayTeamIncome('');
    setGrade('');
    setResult(null);
    setShowModal(false);
    setModalMessage('');
    setPositionError(false);
    setMembersError(false);
    setTeamIncomeError(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    // 모달 닫힌 후 에러가 있는 필드로 포커스 이동
    setTimeout(() => {
      if (teamIncomeError) {
        document.querySelector('input[name="teamIncome"]')?.focus();
      }
    }, 100);
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
              <div className="step-title-container">
                <h2 className="step-title">위임 자격 확인</h2>
                <button onClick={() => setShowGradeModal(true)} className="btn-grade-info">
                  기준보기
                </button>
              </div>

              <div className="form-group">
                <label>굿리치 위촉 직급</label>
                <select
                  name="position"
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    if (positionError) setPositionError(false);
                  }}
                  className={`select-input ${positionError ? 'input-error' : ''}`}
                >
                  <option value="">선택하세요</option>
                  <option value="본부장">본부장</option>
                  <option value="사업단장">사업단장</option>
                  <option value="지점장">지점장</option>
                </select>
                {positionError && <span className="error-message">위촉 직급을 선택해주세요</span>}
              </div>

              {/* 경력/경력기간 입력 제거 (요청사항) */}

              <div className="form-group">
                <label>동반위촉인원(본인포함)</label>
                <div className="input-with-suffix">
                  <input
                    type="number"
                    name="members"
                    value={members}
                    onChange={(e) => {
                      setMembers(e.target.value);
                      if (membersError) setMembersError(false);
                    }}
                    placeholder="0"
                    className={`text-input ${membersError ? 'input-error' : ''}`}
                    min="0"
                  />
                  <span className="input-suffix">명</span>
                  <div className="input-arrows">
                    <button
                      type="button"
                      className="arrow-btn up"
                      onClick={() => {
                        setMembers(prev => Math.max(0, Number(prev) + 1));
                        if (membersError) setMembersError(false);
                      }}
                      tabIndex="-1"
                    >▲</button>
                    <button
                      type="button"
                      className="arrow-btn down"
                      onClick={() => setMembers(prev => Math.max(0, Number(prev) - 1))}
                      tabIndex="-1"
                    >▼</button>
                  </div>
                </div>
                {membersError && <span className="error-message">동반위촉 인원을 입력해주세요</span>}
              </div>

              <div className="form-group">
                <label>본인 직전 1년 소득</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={displayIncome}
                    onChange={(e) => handleIncomeChange(e, setIncome, setDisplayIncome)}
                    placeholder="0"
                    className="text-input"
                  />
                  <span className="input-suffix">만원</span>
                  <div className="input-arrows">
                    <button
                      type="button"
                      className="arrow-btn up"
                      onClick={() => {
                        const currentValue = Number(income || 0);
                        const newValue = currentValue + 1000; // 천만원 단위
                        setIncome(newValue.toString());
                        setDisplayIncome(formatNumber(newValue));
                      }}
                      tabIndex="-1"
                    >▲</button>
                    <button
                      type="button"
                      className="arrow-btn down"
                      onClick={() => {
                        const currentValue = Number(income || 0);
                        const newValue = Math.max(0, currentValue - 1000); // 천만원 단위
                        setIncome(newValue.toString());
                        setDisplayIncome(formatNumber(newValue));
                      }}
                      tabIndex="-1"
                    >▼</button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>산하조직소득합계(본인포함)</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    name="teamIncome"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={displayTeamIncome}
                    onChange={(e) => {
                      handleIncomeChange(e, setTeamIncome, setDisplayTeamIncome);
                      if (teamIncomeError) setTeamIncomeError(false);
                    }}
                    placeholder="0"
                    className={`text-input ${teamIncomeError ? 'input-error' : ''}`}
                  />
                  <span className="input-suffix">만원</span>
                  <div className="input-arrows">
                    <button
                      type="button"
                      className="arrow-btn up"
                      onClick={() => {
                        const currentValue = Number(teamIncome || 0);
                        const newValue = currentValue + 1000; // 천만원 단위
                        setTeamIncome(newValue.toString());
                        setDisplayTeamIncome(formatNumber(newValue));
                        if (teamIncomeError) setTeamIncomeError(false);
                      }}
                      tabIndex="-1"
                    >▲</button>
                    <button
                      type="button"
                      className="arrow-btn down"
                      onClick={() => {
                        const currentValue = Number(teamIncome || 0);
                        const newValue = Math.max(0, currentValue - 1000); // 천만원 단위
                        setTeamIncome(newValue.toString());
                        setDisplayTeamIncome(formatNumber(newValue));
                      }}
                      tabIndex="-1"
                    >▼</button>
                  </div>
                </div>
                {teamIncomeError && <span className="error-message">산하조직소득합계를 입력해주세요</span>}
              </div>

              {/* 체크박스 섹션 제거 (요청사항) */}

              <div className="button-group">
                <button onClick={handleReset} className="btn-secondary btn-icon" title="새로고침">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
                <button onClick={checkQualification} className="btn-primary btn-large">지원금 확인</button>
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
                    <div className="summary-row">
                      <span className="summary-label">위임 직급</span>
                      <span className="summary-value badge">{result.position}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">적용 Grade</span>
                      <span className="summary-value grade-badge">{result.grade}</span>
                    </div>
                    <div className="summary-row total-row">
                      <span className="summary-label">총지원금액</span>
                      <span className="summary-value amount">
                        {formatNumber(Math.floor(result.total / 10000))}만원
                        <span className="monthly-breakdown">
                          ({formatNumber(Math.floor(result.total / 12 / 10000))}만원 X 12개월)
                        </span>
                      </span>
                    </div>
                    {result.bonusApplied && (
                      <div className="summary-row">
                        <span className="summary-label">추가지급</span>
                        <span className="summary-value additional">{formatNumber(Math.floor(result.additionalSupport / 10000))} 만원
                          <span className="additional-note">(S,A등급만 추가 지급)</span>
                        </span>
                      </div>
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
                    <li><span className="checkmark">✓</span> <strong>지원금에 대한 재정보증 필수</strong></li>
                    <li><span className="checkmark">✓</span> <strong>6개월 선지급가능(재정보증 필수)</strong></li>
                    <li><span className="checkmark">✓</span> <strong>Grade 상향은 불가</strong></li>
                  </ul>
                </div>
              </div>

              <div className="result-button-container">
                <button onClick={handleReset} className="btn-secondary btn-icon" title="새로고침">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
        </div>
      </footer>

      {/* 커스텀 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>알림</h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* 그레이드 기준 모달 */}
      {showGradeModal && (
        <div className="modal-overlay" onClick={() => setShowGradeModal(false)}>
          <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Grade 기준</h3>
              <button className="btn-close" onClick={() => setShowGradeModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-scrollable">
              {config?.mProject?.gradeCriteria && config.mProject.gradeCriteria.map(item => {
                // 해당 직급의 지원금 데이터 찾기
                const supportData = config?.mProject?.supportCriteria?.find(
                  s => s.position === item.position
                );

                return (
                  <div key={item.position} className="grade-criteria-section">
                    <h4 className="position-title">{item.position}</h4>
                    <table className="grade-table">
                      <thead>
                        <tr>
                          <th>등급</th>
                          <th>산하조직소득</th>
                          <th>총지원금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(item.grades).sort((a, b) => {
                          const order = { S: 0, A: 1, B: 2, C: 3 };
                          return order[a[0]] - order[b[0]];
                        }).map(([grade, income]) => {
                          const totalSupport = supportData?.supports?.[grade]?.total || 0;
                          return (
                            <tr key={grade}>
                              <td className="grade-cell">
                                <span className={`grade-badge-modal grade-${grade}`}>{grade}</span>
                              </td>
                              <td className="income-cell">{formatNumber(Math.floor(income / 10000))} 만원</td>
                              <td className="support-cell">{formatNumber(Math.floor(totalSupport / 10000))} 만원</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 하단 네비게이션 */}
      <BottomNavigation
        items={[
          { label: '지원금', icon: '💰', url: '/goodrich-info-a/', path: '/goodrich-info-a' },
          { label: '금융캠퍼스', icon: '🎓', url: 'https://kim01033226699-lgtm.github.io/gfe', path: '/gfe' },
          { label: '스마트위촉', icon: '📋', url: 'https://kim01033226699-lgtm.github.io/appoint_info/', path: '/appoint_info' }
        ]}
        currentPath="/goodrich-info-a/m-project"
      />
    </div>
  );
}

export default MProjectPage;
