// src/config/multer.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { resolve, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      cb(null, uuidv4() + extname(file.originalname));
    },
  }),
};
