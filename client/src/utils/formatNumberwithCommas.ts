export function formatNumberWithCommas(number: number) {
    let numberString = String(number);
    let parts = [];
    while (numberString.length > 3) {
      parts.unshift(numberString.slice(-3));
      numberString = numberString.slice(0, -3);
    }
    parts.unshift(numberString);
    return parts.join(".");
  }