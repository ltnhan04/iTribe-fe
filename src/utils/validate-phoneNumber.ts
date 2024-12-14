export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex =
    /^(?:\+84|0)(?:3[2-9]|5[689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return phoneRegex.test(phone.trim());
};
