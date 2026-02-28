export const isValidId = (value) => {
  if (value === null || value === undefined) return false;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};
