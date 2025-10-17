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
                <div className="input-group">
                  <input
                    type="text"
                    value={displayIncome}
                    onChange={handleIncomeChange}
                    placeholder="0"
                    className="income-input"
                    required
                  />
                  <span className="input-suffix">만 원</span>
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

                {selectedOption && getSelectedOptionInfo() && (
                  <div className="goals-section">
                    <h3 className="section-title">연간업적목표(정산평가업적)</h3>
                    <div className="goal-amount-display">
                      {formatNumber(Math.floor(calculateGoalAmount(getSelectedOptionInfo().goal.goalPercentage) / 10000))} 만원
                      (월 {formatNumber(Math.floor(calculateGoalAmount(getSelectedOptionInfo().goal.goalPercentage) / 12 / 10000))} 만원)
                    </div>
                    <div className="goal-details">
                      <div className="goal-detail-item">
                        <span className="goal-label">평가 기간</span>
                        <span className="goal-value">{getSelectedOptionInfo().goal.evaluationPeriod}</span>
                      </div>
                      <div className="goal-detail-item">
                        <span className="goal-label">평가 시기</span>
                        <span className="goal-value">{getSelectedOptionInfo().goal.evaluationTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleReset} className="btn-secondary btn-large">다시하기</button>
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

export default UserPage;
