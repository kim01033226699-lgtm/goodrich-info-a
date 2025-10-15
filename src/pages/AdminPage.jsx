import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/calculator';
import './AdminPage.css';

function AdminPage({ config: initialConfig, onUpdateConfig }) {
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('incomeRanges');

  useEffect(() => {
    if (initialConfig) {
      setConfig(JSON.parse(JSON.stringify(initialConfig)));
    }
  }, [initialConfig]);

  const handleDownload = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'config.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCopy = () => {
    const dataStr = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert('JSON이 클립보드에 복사되었습니다!');
  };

  const handlePreview = () => {
    onUpdateConfig(config);
    alert('미리보기가 업데이트되었습니다. 메인 페이지에서 확인하세요.');
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Income Ranges
  const addIncomeRange = () => {
    const newRange = {
      id: Date.now(),
      minIncome: 0,
      maxIncome: 1000000,
      percentage: 50,
      description: '새 구간'
    };
    updateConfig('incomeRanges', [...config.incomeRanges, newRange]);
  };

  const updateIncomeRange = (id, field, value) => {
    const updated = config.incomeRanges.map(range =>
      range.id === id ? { ...range, [field]: value } : range
    );
    updateConfig('incomeRanges', updated);
  };

  const deleteIncomeRange = (id) => {
    if (config.incomeRanges.length <= 1) {
      alert('최소 1개의 소득 구간이 필요합니다.');
      return;
    }
    updateConfig('incomeRanges', config.incomeRanges.filter(r => r.id !== id));
  };

  // Types
  const addType = () => {
    const newType = {
      id: Date.now(),
      name: '새 타입',
      description: '타입 설명',
      paymentSchedule: {
        method: '지급 방법',
        description: '방법 설명',
        timing: '지급 시기'
      }
    };
    updateConfig('types', [...config.types, newType]);
  };

  const updateType = (id, field, value) => {
    const updated = config.types.map(type =>
      type.id === id ? { ...type, [field]: value } : type
    );
    updateConfig('types', updated);
  };

  const updateTypePaymentSchedule = (id, field, value) => {
    const updated = config.types.map(type =>
      type.id === id ? { ...type, paymentSchedule: { ...type.paymentSchedule, [field]: value } } : type
    );
    updateConfig('types', updated);
  };

  const deleteType = (id) => {
    if (config.types.length <= 1) {
      alert('최소 1개의 타입이 필요합니다.');
      return;
    }
    updateConfig('types', config.types.filter(t => t.id !== id));
  };

  // Options
  const addOption = () => {
    const newOption = {
      id: Date.now(),
      name: '새 옵션',
      description: '옵션 설명',
      goal: {
        evaluationPeriod: '12개월',
        evaluationTime: '매월 말일',
        goalPercentage: 100
      }
    };
    updateConfig('options', [...config.options, newOption]);
  };

  const updateOption = (id, field, value) => {
    const updated = config.options.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    );
    updateConfig('options', updated);
  };

  const updateOptionGoal = (id, field, value) => {
    const updated = config.options.map(option =>
      option.id === id ? { ...option, goal: { ...option.goal, [field]: value } } : option
    );
    updateConfig('options', updated);
  };

  const deleteOption = (id) => {
    updateConfig('options', config.options.filter(o => o.id !== id));
  };

  // Documents
  const addDocument = () => {
    const newDoc = {
      id: Date.now(),
      name: '새 서류',
      required: false,
      description: '서류 설명'
    };
    updateConfig('documents', [...config.documents, newDoc]);
  };

  const updateDocument = (id, field, value) => {
    const updated = config.documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    );
    updateConfig('documents', updated);
  };

  const deleteDocument = (id) => {
    updateConfig('documents', config.documents.filter(d => d.id !== id));
  };

  if (!config) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-container">
          <h1 className="admin-title">관리자 페이지</h1>
          <div className="header-actions">
            <Link to="/" className="btn-back">메인 페이지로</Link>
            <button onClick={handlePreview} className="btn-preview">미리보기 업데이트</button>
            <button onClick={handleCopy} className="btn-copy">JSON 복사</button>
            <button onClick={handleDownload} className="btn-download">JSON 다운로드</button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-layout">
          {/* Sidebar Tabs */}
          <aside className="admin-sidebar">
            <nav className="tab-nav">
              <button
                className={`tab-button ${activeTab === 'incomeRanges' ? 'active' : ''}`}
                onClick={() => setActiveTab('incomeRanges')}
              >
                소득 구간
              </button>
              <button
                className={`tab-button ${activeTab === 'types' ? 'active' : ''}`}
                onClick={() => setActiveTab('types')}
              >
                타입
              </button>
              <button
                className={`tab-button ${activeTab === 'options' ? 'active' : ''}`}
                onClick={() => setActiveTab('options')}
              >
                목표 설정
              </button>
              <button
                className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                준비 서류
              </button>
              <button
                className={`tab-button ${activeTab === 'other' ? 'active' : ''}`}
                onClick={() => setActiveTab('other')}
              >
                기타 설정
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-content">
            {/* Income Ranges */}
            {activeTab === 'incomeRanges' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2>소득 구간 관리</h2>
                  <button onClick={addIncomeRange} className="btn-add">+ 구간 추가</button>
                </div>
                <div className="items-list">
                  {config.incomeRanges.map(range => (
                    <div key={range.id} className="item-card">
                      <div className="item-fields">
                        <div className="field">
                          <label>최소 소득</label>
                          <input
                            type="text"
                            value={formatNumber(range.minIncome)}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '' || /^\d+$/.test(value)) {
                                updateIncomeRange(range.id, 'minIncome', Number(value));
                              }
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>최대 소득 (무제한: 비우기)</label>
                          <input
                            type="text"
                            value={range.maxIncome ? formatNumber(range.maxIncome) : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (value === '') {
                                updateIncomeRange(range.id, 'maxIncome', null);
                              } else if (/^\d+$/.test(value)) {
                                updateIncomeRange(range.id, 'maxIncome', Number(value));
                              }
                            }}
                          />
                        </div>
                        <div className="field">
                          <label>지원 비율 (%)</label>
                          <input
                            type="number"
                            value={range.percentage}
                            onChange={(e) => updateIncomeRange(range.id, 'percentage', Number(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="field full-width">
                          <label>설명</label>
                          <input
                            type="text"
                            value={range.description}
                            onChange={(e) => updateIncomeRange(range.id, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                      <button onClick={() => deleteIncomeRange(range.id)} className="btn-delete">삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Types */}
            {activeTab === 'types' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2>타입 관리</h2>
                  <button onClick={addType} className="btn-add">+ 타입 추가</button>
                </div>
                <div className="items-list">
                  {config.types.map(type => (
                    <div key={type.id} className="item-card">
                      <div className="item-fields">
                        <div className="field">
                          <label>타입 이름</label>
                          <input
                            type="text"
                            value={type.name}
                            onChange={(e) => updateType(type.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="field full-width">
                          <label>설명</label>
                          <input
                            type="text"
                            value={type.description}
                            onChange={(e) => updateType(type.id, 'description', e.target.value)}
                          />
                        </div>

                        <div className="field full-width" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
                          <label style={{ fontSize: '1.1rem', fontWeight: '700' }}>지급 일정</label>
                        </div>
                        <div className="field">
                          <label>지급 방법</label>
                          <input
                            type="text"
                            value={type.paymentSchedule?.method || ''}
                            onChange={(e) => updateTypePaymentSchedule(type.id, 'method', e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>지급 시기</label>
                          <input
                            type="text"
                            value={type.paymentSchedule?.timing || ''}
                            onChange={(e) => updateTypePaymentSchedule(type.id, 'timing', e.target.value)}
                          />
                        </div>
                        <div className="field full-width">
                          <label>방법 설명</label>
                          <textarea
                            value={type.paymentSchedule?.description || ''}
                            onChange={(e) => updateTypePaymentSchedule(type.id, 'description', e.target.value)}
                            rows="2"
                          />
                        </div>
                      </div>
                      <button onClick={() => deleteType(type.id)} className="btn-delete">삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {activeTab === 'options' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2>목표 설정 관리</h2>
                  <button onClick={addOption} className="btn-add">+ 목표 추가</button>
                </div>
                <div className="items-list">
                  {config.options.map(option => (
                    <div key={option.id} className="item-card">
                      <div className="item-fields">
                        <div className="field">
                          <label>옵션 이름</label>
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="field full-width">
                          <label>설명</label>
                          <input
                            type="text"
                            value={option.description}
                            onChange={(e) => updateOption(option.id, 'description', e.target.value)}
                          />
                        </div>

                        <div className="field full-width" style={{ borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
                          <label style={{ fontSize: '1.1rem', fontWeight: '700' }}>실적 목표 정보</label>
                        </div>
                        <div className="field">
                          <label>평가 기간</label>
                          <input
                            type="text"
                            value={option.goal?.evaluationPeriod || ''}
                            onChange={(e) => updateOptionGoal(option.id, 'evaluationPeriod', e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>평가 시기</label>
                          <input
                            type="text"
                            value={option.goal?.evaluationTime || ''}
                            onChange={(e) => updateOptionGoal(option.id, 'evaluationTime', e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>목표 금액 비율 (%) - 지원금 대비</label>
                          <input
                            type="number"
                            value={option.goal?.goalPercentage || 100}
                            onChange={(e) => updateOptionGoal(option.id, 'goalPercentage', Number(e.target.value))}
                            min="0"
                          />
                        </div>
                      </div>
                      <button onClick={() => deleteOption(option.id)} className="btn-delete">삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="admin-section">
                <div className="section-header">
                  <h2>준비 서류 관리</h2>
                  <button onClick={addDocument} className="btn-add">+ 서류 추가</button>
                </div>
                <div className="items-list">
                  {config.documents.map(doc => (
                    <div key={doc.id} className="item-card">
                      <div className="item-fields">
                        <div className="field">
                          <label>서류 이름</label>
                          <input
                            type="text"
                            value={doc.name}
                            onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label>
                            <input
                              type="checkbox"
                              checked={doc.required}
                              onChange={(e) => updateDocument(doc.id, 'required', e.target.checked)}
                            />
                            {' '}필수 서류
                          </label>
                        </div>
                        <div className="field full-width">
                          <label>설명</label>
                          <input
                            type="text"
                            value={doc.description}
                            onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                      <button onClick={() => deleteDocument(doc.id)} className="btn-delete">삭제</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Settings */}
            {activeTab === 'other' && (
              <div className="admin-section">
                <h2>기타 설정</h2>
                <div className="item-card">
                  <div className="item-fields">
                    <div className="field">
                      <label>기본 금액 (원)</label>
                      <input
                        type="text"
                        value={formatNumber(config.baseAmount)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/,/g, '');
                          if (value === '' || /^\d+$/.test(value)) {
                            updateConfig('baseAmount', Number(value) || 0);
                          }
                        }}
                      />
                    </div>
                    <div className="field full-width">
                      <label>산정 방식 설명</label>
                      <textarea
                        value={config.calculationMethod}
                        onChange={(e) => updateConfig('calculationMethod', e.target.value)}
                        rows="8"
                      />
                    </div>
                    <div className="field full-width">
                      <label>재정 보증 안내</label>
                      <textarea
                        value={config.financialGuarantee}
                        onChange={(e) => updateConfig('financialGuarantee', e.target.value)}
                        rows="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
