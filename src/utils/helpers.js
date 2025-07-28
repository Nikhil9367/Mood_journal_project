import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  
  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff < 7) return format(date, 'EEEE');
  
  return format(date, 'MMM d, yyyy');
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase, lowercase, and number' };
  }
  
  return { isValid: true, message: '' };
};

export const extractTextFromHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};