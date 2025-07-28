// Validation regex patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  companyName: /^[a-zA-Z0-9\s-]{2,50}$/,
} as const;

// Validation functions
export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!VALIDATION_PATTERNS.email.test(email)) {
    return 'Enter a valid email address';
  }
  return undefined;
};

export const validatePassword = (password: string, isLogin: boolean = false): string | undefined => {
  if (!password.trim()) {
    return 'Password is required';
  }
  
  if (isLogin) {
    // Simpler validation for login
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
  } else {
    // Enhanced validation for registration
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
  }
  
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 20) {
    return 'Username must be less than 20 characters';
  }
  if (!VALIDATION_PATTERNS.username.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return undefined;
};

export const validateCompanyName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'Company name is required';
  }
  if (name.length < 2) {
    return 'Company name must be at least 2 characters long';
  }
  if (name.length > 50) {
    return 'Company name must be less than 50 characters';
  }
  if (!VALIDATION_PATTERNS.companyName.test(name)) {
    return 'Company name can only contain letters, numbers, spaces, and hyphens';
  }
  return undefined;
};

// Form validation interfaces
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormErrors {
  companyName?: string;
  username?: string;
  email?: string;
  password?: string;
}

// Form validation functions
export const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  return {
    email: validateEmail(email),
    password: validatePassword(password, true),
  };
};

export const validateRegisterStep1 = (companyName: string): RegisterFormErrors => {
  return {
    companyName: validateCompanyName(companyName),
  };
};

export const validateRegisterStep2 = (username: string, email: string, password: string): RegisterFormErrors => {
  return {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password, false),
  };
}; 