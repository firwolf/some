const storage = window.localStorage;

export const setItemStorage = (type: string, value: string): void => {
  storage.setItem(type, value);
};

export const getItemStorage = (type: string): string => storage.getItem(type);
