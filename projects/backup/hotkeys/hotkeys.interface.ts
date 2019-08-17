export interface Hotkey {
  combo: string | string[];
  callback: (event: KeyboardEvent, combo: string | string[]) => any;
  action?: string;
}
