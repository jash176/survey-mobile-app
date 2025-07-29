export const theme = {
  colors: {
    background: "#0b0c11",
    textSecondary: "#b2b8cd99",
    textPrimary: "#B2B8CD",
    primary: "#4652F2",
    borderPrimary: "#dde0e90d"
  },
} as const;

export type Theme = typeof theme; 