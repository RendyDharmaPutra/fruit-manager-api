export const generateCode = (
  type: 'INC' | 'OUT',
  dateStr: string,
  countToday: number,
) => {
  return `${type}-${dateStr}-${String(countToday + 1).padStart(3, '0')}`;
};
