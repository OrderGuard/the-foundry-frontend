export const sanitizeUKPhone = (value: string): string => {
  let digits = value.replace(/\D/g, "");

  // limit to 10 digits after the leading 0
  if (digits.length > 10) {
    digits = digits.slice(0, 10);
  }

  return digits;
};

export const formatUK = (value: string = ""): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  // 07xxx xxxxxx
  if (digits.length > 5) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return digits;
};

export const toE164UK = (value: string): string => {
  let digits = value.replace(/\D/g, "");

  // If starts with 0 → UK local format
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Ensure correct UK mobile length (10 digits after 0)
  if (digits.length !== 10) {
    throw new Error("Invalid UK phone number");
  }

  return `+44${digits}`;
};
