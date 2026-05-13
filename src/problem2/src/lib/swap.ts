export function computeRate(fromPrice: number, toPrice: number): number {
  if (fromPrice <= 0 || toPrice <= 0) return 0;
  return fromPrice / toPrice;
}

export function computeReceive(payAmount: number, payPrice: number, receivePrice: number): number {
  if (payAmount <= 0 || payPrice <= 0 || receivePrice <= 0) return 0;
  return (payAmount * payPrice) / receivePrice;
}

export function computePay(receiveAmount: number, payPrice: number, receivePrice: number): number {
  if (receiveAmount <= 0 || payPrice <= 0 || receivePrice <= 0) return 0;
  return (receiveAmount * receivePrice) / payPrice;
}
