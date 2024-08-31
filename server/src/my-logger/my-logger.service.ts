import { Injectable,ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';


@Injectable()
export class MyLoggerService extends ConsoleLogger{

        async logToFile(entry) {
            const formattedEntry = `${Intl.DateTimeFormat('en-IN', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata',
            }).format(new Date())}\t${entry}\n`;
    
            try {
                const logDir = path.join(__dirname, '..', '..', 'logs');
                if (!fs.existsSync(logDir)) {
                    await fsPromises.mkdir(logDir);
                }
                await fsPromises.appendFile(path.join(logDir, 'myLogFile.log'), formattedEntry);
            } catch (e) {
                if (e instanceof Error) console.error(e.message);
            }
        }
    
    log(message: any, context?: string){
        const entry=`${context}\t${message}`
        this.logToFile(entry)
        super.log(message, context)
    }
    error(message: any, stackOrContext?: string){
        const entry=`${stackOrContext}\t${message}`
        this.logToFile(entry)
       
        super.error(message, stackOrContext)
    }
}