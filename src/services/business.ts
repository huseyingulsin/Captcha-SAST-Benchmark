export const audit: string[] = [];

export function createAccount(email: string) {
  audit.push(`account:${email}`);
  return { ok: true, email };
}

export function sendOtp(phone: string) {
  audit.push(`otp:${phone}`);
  return { ok: true, phone };
}

export function sendReset(email: string) {
  audit.push(`reset:${email}`);
  return { ok: true, email };
}
