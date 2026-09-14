import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: any, context?: string) {
    console.log(`[LOG] [${context}]`, message);
  }

  error(message: any, trace?: string, context?: string) {
    console.error(`[ERROR] [${context}]`, message, trace);
  }

  warn(message: any, context?: string) {
    console.warn(`[WARN] [${context}]`, message);
  }

  debug(message: any, context?: string) {
    console.debug(`[DEBUG] [${context}]`, message);
  }

  verbose(message: any, context?: string) {
    console.info(`[VERBOSE] [${context}]`, message);
  }
}
