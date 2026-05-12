export const formatAmount = (value, decimals = 0) => {
  const num = Number(value);
  if (!isFinite(num)) return '0';
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);
  const fixed = abs.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  let formatted;
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return sign + (decPart ? `${formatted}.${decPart}` : formatted);
};
