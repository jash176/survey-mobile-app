export const theme = {
  colors: {
    background: '#0b0c11',
    primary: '#6467f2',
    textPrimary: '#ffffff',
    textSecondary: '#b2b8cd99',
  },
} as const;

export type Theme = typeof theme; 