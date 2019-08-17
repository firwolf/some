export const setItemStorage = (type: string, value: string): void =>
  window.localStorage.setItem(type, value);

export const getItemStorage = (type: string): string => window.localStorage.getItem(type);

export const removeItemStorage = (type: string) => window.localStorage.removeItem(type);
