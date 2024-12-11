export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const;

export function isEnterKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER;
}

export function isEscapeKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ESCAPE;
}

export function isNavigationKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
  return [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
  ].includes(event.key as any);
}