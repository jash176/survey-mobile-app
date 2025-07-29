export const theme = {
  colors: {
    background: "#0b0c11",
    textSecondary: "#b2b8cd99",
    textPrimary: "#DEE1EA",
    primary: "#4652F2",
    borderPrimary: "#2b304099"
  },
} as const;

export type Theme = typeof theme; 