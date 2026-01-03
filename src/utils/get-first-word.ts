export const getFirstWord = (value: string) =>
  value?.trim().split(/\s+/)[0]?.toUpperCase() || ''
