export function getPasswordRequirements(password) {
  return [
    { label: "At least 12 characters", met: password.length >= 12 },
    { label: "A lowercase letter", met: /[a-z]/.test(password) },
    { label: "An uppercase letter", met: /[A-Z]/.test(password) },
    { label: "A number", met: /\d/.test(password) },
    { label: "A special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
}
