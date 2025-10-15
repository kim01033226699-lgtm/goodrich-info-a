/**
 * 소득 구간에 따른 지원 비율 계산
 * @param {number} income - 소득 금액
 * @param {Array} incomeRanges - 소득 구간 배열
 * @returns {number} - 지원 비율 (%)
 */
export const getIncomePercentage = (income, incomeRanges) => {
  const range = incomeRanges.find(r => {
    if (r.maxIncome === null) {
      return income >= r.minIncome;
    }
    return income >= r.minIncome && income <= r.maxIncome;
  });

  return range ? range.percentage : 0;
};

/**
 * 최종 지원금 계산 (옵션은 지원금에 영향 없음)
 * @param {number} income - 소득 금액
 * @param {Object} config - 전체 설정 객체
 * @returns {Object} - 계산 결과 { amount, percentage }
 */
export const calculateSupport = (income, config) => {
  const percentage = getIncomePercentage(income, config.incomeRanges);
  const amount = Math.floor((income * percentage) / 100);

  return {
    amount,
    percentage,
    income
  };
};

/**
 * 숫자를 원화 형식으로 포맷
 * @param {number} amount - 금액
 * @returns {string} - 포맷된 문자열
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

/**
 * 숫자를 천단위 구분 형식으로 포맷
 * @param {number} number - 숫자
 * @returns {string} - 포맷된 문자열
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('ko-KR').format(number);
};
