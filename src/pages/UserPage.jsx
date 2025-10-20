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
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleReset = () => {
    setStep(1);
    setIncome('');
    setDisplayIncome('');
    setSelectedOption('');
    setResult(null);
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

                <div className="option-selection-section">
                  <h3 className="section-title">목표 옵션 선택</h3>
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

                {selectedOption && getSelectedOptionInfo() && (() => {
                  const optionInfo = getSelectedOptionInfo();
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
                      <div className="goal-amount-display">
                        {formatNumber(Math.floor(yearlyGoal / 10000))} 만원
                        <span className="goal-monthly-calc">
                          (월 {formatNumber(monthlyGoal)} 만원 X {optionInfo.goal.evaluationPeriod})
                        </span>
                      </div>
                      <div className="goal-details">
                        <div className="goal-detail-item">
                          <span className="goal-label">1차 중간목표</span>
                          <span className="goal-value">영업7차월 {formatNumber(intermediateGoals.first)} 만원</span>
                        </div>
                        <div className="goal-detail-item">
                          <span className="goal-label">2차 중간평가</span>
                          <span className="goal-value">영업10차월 {formatNumber(intermediateGoals.second)} 만원</span>
                        </div>
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
