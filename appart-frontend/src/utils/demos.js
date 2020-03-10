import random from 'faker/lib/random';

/**
 * 
 * @param min
 * @param max
 * @returns {Error}
 */
export const randomNum = (min = 0, max = 1000) => {
  return random().number({ min, max });
};
