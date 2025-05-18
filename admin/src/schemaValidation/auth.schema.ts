export const emailRules = [
  { required: true, message: "Please enter your email" },
  {
    type: "email" as const,
    message: "Invalid email format!",
  },
  {
    pattern: /\.com$/,
    message: "Email must end with .com!",
  },
];

export const passwordRules = [
  { required: true, message: "Please enter your password" },
  {
    min: 8,
    message: "Password must be at least 8 characters long",
  },
  {
    max: 100,
    message: "Password cannot exceed 100 characters",
  },
  {
    pattern: /[!@#$%^&*(),.?":{}|<>]/,
    message: "Password must contain at least one special character",
  },
  {
    pattern: /[A-Z]/,
    message: "Password must contain at least one uppercase letter",
  },
];
