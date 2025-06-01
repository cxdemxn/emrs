/**
 * Simple logger utility for the EMRS server
 */

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * Logger utility with colored console output
 */
class Logger {
  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * Log an informational message
   */
  static info(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message);
    console.log('\x1b[36m%s\x1b[0m', formattedMessage, ...args); // Cyan color
  }

  /**
   * Log a warning message
   */
  static warn(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message);
    console.log('\x1b[33m%s\x1b[0m', formattedMessage, ...args); // Yellow color
  }

  /**
   * Log an error message
   */
  static error(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message);
    console.log('\x1b[31m%s\x1b[0m', formattedMessage, ...args); // Red color
  }

  /**
   * Log a debug message (only in development environment)
   */
  static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message);
      console.log('\x1b[90m%s\x1b[0m', formattedMessage, ...args); // Gray color
    }
  }

  /**
   * Log API request information
   */
  static request(req: any, message?: string): void {
    const msg = message || 'API Request';
    this.info(`${msg}: ${req.method} ${req.originalUrl}`);
  }
}

export default Logger;
