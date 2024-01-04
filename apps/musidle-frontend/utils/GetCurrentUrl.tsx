export const getCurrentUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4200';
  } else {
    return 'http://localhost:4200';
  }
};
