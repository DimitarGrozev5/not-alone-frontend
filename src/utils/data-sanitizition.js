export const sanitizePhone = (phone) => {
  const noWhitespace = phone.replaceAll(" ", "");
  const noCountryCode = noWhitespace.replace("+359", "0");

  return noCountryCode;
};

export const sanitizeEmail = (email) => email.toLowerCase();
