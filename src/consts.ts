export const fieldChecks = {
  numericCheck: (value: string) => new RegExp("^[0-9]+$").test(value),
  idCheck: (value: string) =>
    fieldChecks.numericCheck(value) && value.length > 8,
  nameCheck: (value: string) =>
    new RegExp("^[\u0590-\u05fea-zA-Z]+$").test(value),
  onlyLettersCheck: (value: string) =>
    new RegExp("^[\u0590-\u05fea-zA-Z\\s\\d]+$").test(value),
  seatsAmountCheck: (value: number) => value > 0 && value <= 1000,
  ageCheck: (value: number) => value > 0 && value <= 120,
};
