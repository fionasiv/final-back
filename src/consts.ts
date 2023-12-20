export const fieldChecks = {
  numericCheck: (value: string) => new RegExp("^[0-9]+$").test(value),
  idCheck: (value: string) =>
    fieldChecks.numericCheck(value) && value.length > 8,
  onlyLettersCheck: (value: string) =>
    new RegExp("^[a-zA-Z\u0590-\u05fe]+$").test(value),
  seatsAmountCheck: (value: number) => value > 0 && value <= 1000,
  ageCheck: (value: number) => value > 0 && value <= 120,
};
