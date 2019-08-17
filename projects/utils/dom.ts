export function createElement(
  tag: string,
  props: { [key: string]: any } = {},
  styles: { [key: string]: any } = {},
): HTMLElement {
  const el = document.createElement(tag);
  Object.assign(el, props);
  Object.assign(el.style, styles);
  return el;
}
