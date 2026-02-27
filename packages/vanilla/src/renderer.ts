/**
 * DOM Rendering Helpers
 *
 * Lightweight utility functions for creating and manipulating DOM elements.
 */

/**
 * Create an HTML element with optional class name and text content.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  textContent?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (textContent !== undefined) {
    el.textContent = textContent;
  }
  return el;
}
