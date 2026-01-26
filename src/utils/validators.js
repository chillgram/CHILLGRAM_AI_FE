export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

export function isPasswordOk(password) {
  return typeof password === "string" && password.length >= 8;
}

export function isPasswordMatch(password, confirm) {
  return password.length > 0 && password === confirm;
}
