export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface Money {
  readonly amount: number;
  readonly currency: CurrencyCode;
}
