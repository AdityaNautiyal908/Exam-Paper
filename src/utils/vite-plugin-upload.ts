import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');

export function uploadPlugin(): Plugin {
  return {
    name: 'vite-plugin-upload',
    configureServer(server) {
      server.middlewares.use('/api/upload', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        const chunks: Buffer[] = [];
        
        req.on('data', (chunk) => chunks.push(chunk));
        
        req.on('end', async () => {
          const buffer = Buffer.concat(chunks);
          
          // Simple multipart parsing (robust enough for this specific use case)
          // We expect a FormData with 'file', 'semester', 'type', 'subject'
          
          const boundary = req.headers['content-type']?.split('boundary=')[1];
          if (!boundary) {
            res.statusCode = 400;
            res.end('No boundary found');
            return;
          }

          const parts = buffer.toString('binary').split(`--${boundary}`);
          
          let fileData: Buffer | null = null;
          let fileName = '';
          let semester = '';
          let type = '';
          
          for (const part of parts) {
            if (part.includes('name="file"')) {
              const match = part.match(/filename="(.+?)"/);
              if (match) {
                fileName = match[1];
                const start = part.indexOf('\r\n\r\n') + 4;
                const end = part.lastIndexOf('\r\n');
                fileData = Buffer.from(part.slice(start, end), 'binary');
              }
            } else if (part.includes('name="semester"')) {
              semester = part.split('\r\n\r\n')[1].split('\r\n')[0];
            } else if (part.includes('name="type"')) {
              type = part.split('\r\n\r\n')[1].split('\r\n')[0];
            }
          }

          if (!fileData || !fileName || !semester || !type) {
            res.statusCode = 400;
            res.end('Missing required fields');
            return;
          }

          try {
            // Determine target directory
            const targetDir = path.join(
              rootDir, 
              'public', 
              'assets', 
              type, // 'final' or 'midterm'
              `sem${semester}`
            );

            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            const filePath = path.join(targetDir, fileName);
            fs.writeFileSync(filePath, fileData);

            // Trigger regeneration script
            exec('npm run sync:papers', (error, stdout, stderr) => {
              if (error) {
                console.error(`Exec error: ${error}`);
                return;
              }
              console.log(`Papers synced: ${stdout}`);
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: filePath }));
          } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Upload failed' }));
          }
        });
      });
    },
  };
}
