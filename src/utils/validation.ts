/**
 * Normalizes an input string for comparison by:
 * - Removing extra whitespace
 * - Converting to lowercase
 * - Removing punctuation
 */
export const normalizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .toLowerCase()
    .trim()
    // Fix unnecessary escape characters in the RegExp
    .replace(/[.,/#!$%&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ");
};

/**
 * Checks if two strings are equivalent after normalization
 */
export const areStringsEquivalent = (str1: string, str2: string): boolean => {
  return normalizeInput(str1) === normalizeInput(str2);
};

/**
 * Validates form inputs to prevent empty submissions
 */
export const isValidInput = (input: string): boolean => {
  return input.trim().length > 0;
};

/**
 * Safely logs information when in development mode
 */
export const devLog = (...messages: any[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...messages);
  }
};
