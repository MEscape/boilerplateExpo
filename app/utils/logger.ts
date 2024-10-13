/* eslint-disable no-console */

/**
 * Logger utility for development mode.
 *
 * This utility provides logging functionality using `console.log`, `console.warn`, and `console.error`
 * in development mode (`__DEV__`). In production mode, logging is disabled.
 *
 * @example
 * logger.log('This is a log message');
 * logger.warn('This is a warning message');
 * logger.error('This is an error message');
 */
export const logger = {
  /**
   * Logs an error message to the console in development mode.
   *
   * @param {...any} messages - The messages to log as an error.
   */
  error: (...messages: any) => {
    if (__DEV__) {
      console.error(...messages)
    }
  },

  /**
   * Logs a message to the console in development mode.
   *
   * @param {...any} messages - The messages to log.
   */
  log: (...messages: any) => {
    if (__DEV__) {
      console.log(...messages)
    }
  },

  /**
   * Integrates Reactotron's.
   *
   * @param {...any} args - The arguments to pass to the Reactotron method.
   */
  tron: {
    trackMstNode: (...args: [any]) => {
      if (__DEV__ && console.tron && typeof console.tron.trackMstNode === 'function') {
        // eslint-disable-next-line reactotron/no-tron-in-production
        console.tron.trackMstNode(...args)
      }
    },
  },

  /**
   * Logs a warning message to the console in development mode.
   *
   * @param {...any} messages - The messages to log as a warning.
   */
  warn: (...messages: any) => {
    if (__DEV__) {
      console.warn(...messages)
    }
  },
}
