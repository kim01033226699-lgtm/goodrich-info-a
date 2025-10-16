import { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateSupport, formatCurrency, formatNumber } from '../utils/calculator';
import './UserPage.css';

function UserPage({ config }) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [displayIncome, setDisplayIncome] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
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
      setStep(2);
    }
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setStep(3);
  };

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

const handleCalculate = () => {
  // 💡 입력된 금액(만원 단위)을 원단위로 변환
  const incomeInWon = Number(income) * 10000;

  const calculationResult = calculateSupport(incomeInWon, config);
  setResult(calculationResult);
  setStep(4);
};

  const handleReset = () => {
    setStep(1);
    setIncome('');
    setDisplayIncome('');
    setSelectedType(null);
    setSelectedOptions([]);
    setResult(null);
  };

  const getSelectedTypeInfo = () => {
    return config.types.find(t => t.id === selectedType);
  };

  const getIncomeRangeInfo = () => {
    const incomeNum = Number(income);
    return config.incomeRanges.find(r => {
      if (r.maxIncome === null) {
        return incomeNum >= r.minIncome;
      }
      return incomeNum >= r.minIncome && incomeNum <= r.maxIncome;
    });
  };

  const getSelectedOptions = () => {
    return config.options.filter(opt => selectedOptions.includes(opt.id));
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

      {/* Progress Steps */}
      <div className="progress-section">
        <div className="container">
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">소득 입력</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">타입 선택</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">옵션 선택</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">결과 확인</div>
            </div>
          </div>
        </div>
      </div>

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
                <button type="submit" className="btn-primary btn-large">다음 단계</button>
              </form>
            </div>
          )}

          {/* Step 2: Type Selection */}
          {step === 2 && (
            <div className="step-card fade-in">
              <h2 className="step-title">지원 유형을 선택해주세요</h2>
              <div className="type-grid">
                {config.types.map(type => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                  >
                    <h3 className="type-name">{type.name}</h3>
                    <p className="type-desc">{type.description}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="btn-secondary">이전 단계</button>
            </div>
          )}

          {/* Step 3: Options Selection */}
          {step === 3 && (
            <div className="step-card fade-in">
              <h2 className="step-title">해당하는 옵션을 모두 선택해주세요</h2>
              <div className="options-grid">
                {config.options.map(option => (
                  <div
                    key={option.id}
                    onClick={() => handleOptionToggle(option.id)}
                    className={`option-card ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
                  >
                    <h3 className="option-name">{option.name}</h3>
                    <p className="option-desc">{option.description}</p>
                    <div className="option-checkbox">
                      {selectedOptions.includes(option.id) && (
                        <svg className="checkmark" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="button-group">
                <button onClick={() => setStep(2)} className="btn-secondary">이전 단계</button>
                <button onClick={handleCalculate} className="btn-primary btn-large">계산하기</button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && result && (
            <div className="fade-in">
              <div className="result-card">
                <div className="result-header">
                  <h2 className="result-title">지원금</h2>
                  <div className="result-amount">{formatCurrency(result.amount)}</div>
                </div>

                <div className="payment-section">
                  <h3 className="section-title">지급 일정</h3>
                  {selectedType && getSelectedTypeInfo()?.paymentSchedule && (
                    <div className="payment-schedule">
                      <div className="schedule-item">
                        <span className="schedule-label">지급 방법</span>
                        <span className="schedule-value">{getSelectedTypeInfo().paymentSchedule.method}</span>
                      </div>
                      <div className="schedule-item">
                        <span className="schedule-label">설명</span>
                        <span className="schedule-value">{getSelectedTypeInfo().paymentSchedule.description}</span>
                      </div>
                      <div className="schedule-item">
                        <span className="schedule-label">지급 시기</span>
                        <span className="schedule-value highlight">{getSelectedTypeInfo().paymentSchedule.timing}</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedOptions.length > 0 && (
                  <div className="goals-section">
                    <h3 className="section-title">실적 목표 금액</h3>
                    <div className="goals-list">
                      {getSelectedOptions().map(option => (
                        <div key={option.id} className="goal-item">
                          <div className="goal-header">
                            <div className="goal-title">{option.name}</div>
                            <div className="goal-amount">{formatCurrency(calculateGoalAmount(option.goal.goalPercentage))}</div>
                          </div>
                          <div className="goal-details">
                            <div className="goal-detail-item">
                              <span className="goal-label">평가 기간</span>
                              <span className="goal-value">{option.goal.evaluationPeriod}</span>
                            </div>
                            <div className="goal-detail-item">
                              <span className="goal-label">평가 시기</span>
                              <span className="goal-value">{option.goal.evaluationTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="goals-notice">
                      - 지원금액 산정 및 지급은 영업 관리자 및 지원금 담당자에게 문의바랍니다.
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="info-sections">
                <div className="info-card">
                  <h3 className="info-title">재정 보증</h3>
                  <div className="info-content">
                    {config.financialGuarantee}
                  </div>
                </div>

                <div className="info-card">
                  <h3 className="info-title">준비 서류</h3>
                  <ul className="info-list">
                    {config.documents.map(doc => (
                      <li key={doc.id} className="info-item">
                        <span className="doc-name">{doc.name}</span>
                        {doc.required && <span className="required-badge">필수</span>}
                        {doc.description && <span className="doc-desc">{doc.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="info-card">
                  <h3 className="info-title">산정 방식</h3>
                  <div className="info-content">
                    {config.calculationMethod}
                  </div>
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

export default UserPage;
