import { diskStorage } from 'multer';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads');
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    }),
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB en bytes
    },
};
