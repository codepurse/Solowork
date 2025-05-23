import { useState } from 'react';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export type ValidationErrors = {
  [key: string]: string;
};

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: any): string | null => {
    const fieldRules = rules[name];
    if (!fieldRules) return null;

    if (fieldRules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return fieldRules.message || `${name} is required`;
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return `${name} must be at least ${fieldRules.minLength} characters`;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return `${name} must be less than ${fieldRules.maxLength} characters`;
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return fieldRules.message || `${name} format is invalid`;
    }

    if (fieldRules.custom && !fieldRules.custom(value)) {
      return fieldRules.message || `${name} is invalid`;
    }

    return null;
  };

  const validateForm = (values: { [key: string]: any }): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors,
  };
}; 