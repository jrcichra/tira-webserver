export const getLocalTime = (utcTime: string) => {
  return new Date(utcTime + 'Z').toLocaleString();
};
