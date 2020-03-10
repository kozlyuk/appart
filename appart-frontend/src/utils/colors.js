// const availableColors = [
//   'blue',
//   'indigo',
//   'purple',
//   'pink',
//   'red',
//   'orange',
//   'yellow',
//   'green',
//   'teal',
//   'cyan',
//   'white',
//   'gray',
//   'gray-dark',
//   'primary',
//   'secondary',
//   'success',
//   'info',
//   'warning',
//   'danger',
//   'light',
//   'dark',
// ];

/**
 *
 * @param availableColor
 * @returns {string|null}
 */
export const getColor = (availableColor = 'primary') => {
  if (typeof window === 'undefined') {
    return null;
  }

  /**
   *
   * @type {string}
   */
  const color = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(`--${availableColor}`);

  return color;
};

/**
 *
 * @returns {string[]}
 */
export const getThemeColors = () => [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
];
