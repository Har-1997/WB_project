export const fixDecimalType = (value: string): number => {
  if (value === "-" || value === "0") {
    return 0;
  }

  const formattedValue = value.replace(/,/g, '.');
  return parseFloat(formattedValue);
}