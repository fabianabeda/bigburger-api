import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { resolve, extname } from 'path';

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            cb(null, uuidv4() + extname(file.originalname));
        },
    }),
};

