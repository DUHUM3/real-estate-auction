/**
 * Password validation rules and constants
 */

export const PASSWORD_REQUIREMENTS = [
  { id: "length", label: "8 أحرف على الأقل", regex: /.{8,}/ },
  { id: "uppercase", label: "حرف كبير واحد على الأقل", regex: /[A-Z]/ },
  { id: "lowercase", label: "حرف صغير واحد على الأقل", regex: /[a-z]/ },
  { id: "number", label: "رقم واحد على الأقل", regex: /[0-9]/ },
  {
    id: "special",
    label: "رمز خاص واحد على الأقل",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export const VALIDATION_RULES = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone) => /^(05)([0-9]{8})$/.test(phone),
  nationalId: (id) => /^[0-9]{10}$/.test(id),
  verificationCode: (code) => /^\d{6}$/.test(code),
};

export const USER_TYPES = {
  NORMAL: 1,
  LAND_OWNER: 2,
  LEGAL_AGENT: 3,
  COMMERCIAL: 4,
  REAL_ESTATE_BROKER: 5,
  AUCTION_COMPANY: 6,
};