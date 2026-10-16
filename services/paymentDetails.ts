import { workflowRequest } from './workflowRequest';

export type PaymentDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  referenceNote: string;
};
export const emptyPaymentDetails: PaymentDetails = {
  bankName: '', accountName: '', accountNumber: '', referenceNote: '',
};
export function cleanPaymentDetails(value: PaymentDetails): PaymentDetails {
  return { bankName: value.bankName.trim(), accountName: value.accountName.trim(),
    accountNumber: value.accountNumber.trim(), referenceNote: value.referenceNote.trim() };
}
export function paymentDetailsError(value: PaymentDetails, optional = false) {
  const details = cleanPaymentDetails(value);
  if (optional && !Object.values(details).some(Boolean)) return '';
  if (!details.bankName || !details.accountName || !details.accountNumber)
    return 'Enter the bank name, account name and account number.';
  if (!/^\d{10}$/.test(details.accountNumber)) return 'Account number must be exactly 10 digits.';
  return '';
}
export function savePaymentDetails(groupId: string, value: PaymentDetails) {
  const error = paymentDetailsError(value);
  if (error) throw new Error(error);
  return workflowRequest<{ paymentDetails: PaymentDetails }>(
    '/groups/' + encodeURIComponent(groupId) + '/payment-details', 'PATCH', cleanPaymentDetails(value));
}
