export function isEmail(str: string): boolean {
  const checkEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  return checkEmail.test(str);
}

export function normalize(str: string): string {
  return str.toLowerCase();
}
