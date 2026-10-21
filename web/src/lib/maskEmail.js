export function maskEmail(email) {
  const separatorIndex = email.lastIndexOf('@');
  if (separatorIndex < 1 || separatorIndex === email.length - 1) return '';

  const name = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex + 1);
  if (name.length <= 6) {
    return `${name[0]}${'*'.repeat(Math.max(1, name.length - 2))}${name.at(-1)}@${domain}`;
  }

  const hiddenCharacters = '*'.repeat(Math.max(6, name.length - 6));
  return `${name.slice(0, 3)}${hiddenCharacters}${name.slice(-3)}@${domain}`;
}
