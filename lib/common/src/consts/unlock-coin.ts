export type UnlockStatus = 'success' | 'should_payment' | 'invalid_unlock';

export enum UnlockCommType {
    Charge = 'charge',
    Expense = 'expense',
}
