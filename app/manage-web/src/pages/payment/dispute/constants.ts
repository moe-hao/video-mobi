import { OrderStatusNameEn } from "@lib/common/consts/order";
import { PaymentType } from "@lib/common/consts/payment";

export const COIN_COMM_LABEL: Record<string, string> = {
  charge: 'Charge',
  expense: 'Expense',
};

export const ORDER_STATUS_LABEL: Record<number, string> = OrderStatusNameEn;

export const PAYMENT_TYPE_LABEL: Record<string, string> = {
  [PaymentType.ApplePay]: 'Apple Pay',
  [PaymentType.GooglePay]: 'Google Pay',
  [PaymentType.Card]: 'Credit/Debit Card',
  [PaymentType.Paypal]: 'PayPal',
  [PaymentType.Pix]: 'Pix',
  [PaymentType.MercadoPago]: 'MercadoPago',
};
