import { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateSupport, formatCurrency, formatNumber } from '../utils/calculator';
import './UserPage.css';

function UserPage({ config }) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showOptionSelection, setShowOptionSelection] = useState(false);

  const handleIncomeChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setIncome(value);
      setDisplayIncome(value ? formatNumber(value) : '');
    }
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (income && Number(income) >= 0) {
      // 💡 입력된 금액(만원 단위)을 원단위로 변환
      const incomeInWon = Number(income) * 10000;
      const calculationResult = calculateSupport(incomeInWon, config);
      setResult(calculationResult);
      setStep(2);
      setShowOptionSelection(true);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    
    // 옵션 선택 시 로딩 시작
    if (e.target.value) {
      setIsCalculating(true);
      
      // 1.2초 후 로딩 완료
      setTimeout(() => {
        setIsCalculating(false);
      }, 1200);
    }
  };

  const handleReset = () => {
    setStep(1);
    setIncome('');
    setDisplayIncome('');
    setSelectedOption('');
    setResult(null);
    setIsCalculating(false);
    setShowOptionSelection(false);
  };

  const getSelectedOptionInfo = () => {
    if (!selectedOption) return null;
    return config.options.find(opt => opt.id === Number(selectedOption));
  };

  const calculateGoalAmount = (goalPercentage) => {
    if (!result) return 0;
    return Math.floor((result.amount * goalPercentage) / 100);
  };

  return (
    <div className="user-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="title">{config?.pageMetadata?.settlement?.title || '정착교육비 안내'}</h1>
          <p className="subtitle">{config?.pageMetadata?.settlement?.subtitle || '단계별로 정보를 입력하시면 예상 지원금을 확인하실 수 있습니다'}</p>
          <div className="header-links">
            <Link to="/" className="home-link">홈으로</Link>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main className="main-content">
        <div className="container">

          {/* Step 1: Income Input */}
          {step === 1 && (
            <div className="step-card fade-in">
              <h2 className="step-title">연소득을 입력해주세요</h2>
              <form onSubmit={handleIncomeSubmit} className="income-form">
                <div className="form-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={displayIncome}
                    onChange={handleIncomeChange}
                    placeholder="0"
                    className="text-input"
                    required
                  />
                  <span className="input-suffix">만원</span>
                </div>
                <button type="submit" className="btn-primary btn-large">지원금 확인</button>
              </form>
            </div>
          )}

          {/* Step 2: Result */}
          {step === 2 && result && (
            <div className="fade-in">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="result-title">지원금</h2>
                  <div className="result-amount">{formatCurrency(result.amount)}</div>
                </div>

                {/* 목표옵션선택 섹션 - 옵션 선택 전에만 표시 */}
                {showOptionSelection && !selectedOption && (
                  <div className="option-selection-section">
                    <div className="option-selection-row">
                      <h3 className="section-title">목표옵션선택</h3>
                      <div className="form-group">
                        <select
                          value={selectedOption}
                          onChange={handleOptionChange}
                          className="select-input"
                        >
                          <option value="">옵션을 선택하세요</option>
                          {config.options.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name} - {option.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 옵션선택적용내용 - 옵션 선택 후에만 표시 */}
                {selectedOption && getSelectedOptionInfo() && (
                  <div className="option-application-section">
                    <div className="selected-option-info">
                      <span className="option-label">Option-{getSelectedOptionInfo().id}</span>
                      <span className="option-details">: {getSelectedOptionInfo().goal.evaluationPeriod} 평가기간 적용</span>
                    </div>
                  </div>
                )}

                {selectedOption && getSelectedOptionInfo() && (() => {
                  const optionInfo = getSelectedOptionInfo();
                  
                  // 로딩 화면 표시
                  if (isCalculating) {
                    return (
                      <div className="calculating-section">
                        <div className="calculating-spinner">
                          <div className="spinner"></div>
                        </div>
                        <p className="calculating-text">목표업적을 계산중입니다.</p>
                      </div>
                    );
                  }

                  const yearlyGoal = calculateGoalAmount(optionInfo.goal.goalPercentage);
                  // evaluationPeriod에서 개월수 추출 (예: "12개월" -> 12)
                  const months = parseInt(optionInfo.goal.evaluationPeriod.match(/\d+/)[0]);
                  const monthlyGoal = Math.floor(yearlyGoal / months / 10000);

                  // 옵션별 중간목표 계산
                  const getIntermediateGoals = (optionId) => {
                    const finalGoal = Math.floor(yearlyGoal / 10000);
                    switch(optionId) {
                      case 1: // 옵션1
                        return {
                          first: Math.floor(finalGoal * 0.25),
                          second: Math.floor(finalGoal * 0.35)
                        };
                      case 2: // 옵션2
                        return {
                          first: Math.floor(finalGoal * 0.20),
                          second: Math.floor(finalGoal * 0.25)
                        };
                      case 3: // 옵션3
                        return {
                          first: Math.floor(finalGoal * 0.15),
                          second: Math.floor(finalGoal * 0.20)
                        };
                      default:
                        return { first: 0, second: 0 };
                    }
                  };

                  const intermediateGoals = getIntermediateGoals(optionInfo.id);

                  return (
                    <div key={selectedOption} className="goals-section fade-in">
                      <h3 className="section-title">목표업적</h3>
                      
                      {/* 최종목표 블록 */}
                      <div className="goal-block final-goal">
                        <div className="goal-block-title">최종목표</div>
                        <div className="goal-block-content">
                          {formatNumber(Math.floor(yearlyGoal / 10000))}만원
                          <span className="goal-monthly-calc">
                            (월 {formatNumber(monthlyGoal)}만원 X {optionInfo.goal.evaluationPeriod})
                          </span>
                        </div>
                      </div>

                      {/* 중간목표 블록 */}
                      <div className="intermediate-goals">
                        <div className="goal-block intermediate-goal">
                          <div className="goal-block-title">1차 중간목표</div>
                          <div className="goal-block-content">
                            {formatNumber(intermediateGoals.first)}만원
                            <span className="goal-evaluation">(평가시기: 영업7차월)</span>
                          </div>
                        </div>
                        <div className="goal-block intermediate-goal">
                          <div className="goal-block-title">2차 중간목표</div>
                          <div className="goal-block-content">
                            {formatNumber(intermediateGoals.second)}만원
                            <span className="goal-evaluation">(평가시기: 영업10차월)</span>
                          </div>
                        </div>
                      </div>

                      {/* 안내사항 */}
                      <div className="notice-section">
                        <ul className="notice-list">
                          <li><span className="notice-icon">⚠️</span> 중간목표 달성 여부에 따라 지원금 지급 및 환수가 발생할 수 있습니다.</li>
                          <li><span className="notice-icon">⚠️</span> 목표 달성 후 유지율 평가에 따라 환수가 발생할 수 있습니다.</li>
                        </ul>
                      </div>
                    </div>
                  );
                })()}
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

export default UserPage;
