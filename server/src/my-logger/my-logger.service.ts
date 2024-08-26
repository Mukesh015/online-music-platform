import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
    private readonly logDir = path.join(__dirname, '..', '..', 'logs');
    private readonly logFile = path.join(this.logDir, 'myLogFile.log');

    constructor(context?: string) {
        super(context);
        this.ensureLogDirExists();
    }

    private async ensureLogDirExists() {
        try {
            if (!fs.existsSync(this.logDir)) {
                await fsPromises.mkdir(this.logDir, { recursive: true });
            }
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }

    private async logToFile(entry: string) {
        const formattedEntry = `${Intl.DateTimeFormat('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata',
        }).format(new Date())}\t${entry}\n`;

        try {
            await fsPromises.appendFile(this.logFile, formattedEntry);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    log(message: any, context?: string) {
        const entry = `${context ? context + '\t' : ''}${message}`;
        this.logToFile(entry);
        super.log(message, context);
    }

    error(message: any, stackOrContext?: string) {
        const entry = `${stackOrContext ? stackOrContext + '\t' : ''}${message}`;
        this.logToFile(entry);
        super.error(message, stackOrContext);
    }

    warn(message: any, context?: string) {
        const entry = `${context ? context + '\t' : ''}${message}`;
        this.logToFile(entry);
        super.warn(message, context);
    }

    debug(message: any, context?: string) {
        const entry = `${context ? context + '\t' : ''}${message}`;
        this.logToFile(entry);
        super.debug(message, context);
    }

    verbose(message: any, context?: string) {
        const entry = `${context ? context + '\t' : ''}${message}`;
        this.logToFile(entry);
        super.verbose(message, context);
    }
}
