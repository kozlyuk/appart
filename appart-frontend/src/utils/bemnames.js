import classNames from 'classnames';

/**
 *
 * @param namespace
 * @returns {{create: (function(*): {b: (function(...[*]=): string), e: (function(*, ...[*]=): string), m: (function(*, ...[*]=): string)})}}
 */
export const createBEM = namespace => {
  return {
    create: blockName => {
      let block = blockName;

      if (typeof namespace === 'string') {
        block = `${namespace}-${blockName}`;
      }

      return {
        b: (...more) => {
          return classNames(block, more);
        },
        e: (className, ...more) => {
          return classNames(`${block}__${className}`, more);
        },
        m: (className, ...more) => {
          return classNames(`${block}--${className}`, more);
        },
      };
    },
  };
};

/**
 *
 * @type {{create: (function(*): {b: (function(...[*]=): string), e: (function(*, ...[*]=): string), m: (function(*, ...[*]=): string)})}}
 */
export const bemNames = createBEM('cr');

export default bemNames;
