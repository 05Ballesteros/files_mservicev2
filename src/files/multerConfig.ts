import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
const uploadPath = 'src/uploads';
if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
}
export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
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
