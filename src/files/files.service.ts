import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    async handleFileUpload(files: Express.Multer.File[], protocol: string, host: string): Promise<any[]> {
        if (!files || files.length === 0) {
            throw new Error('No se enviaron archivos');
        }

        return files.map((file) => ({
            name: file.filename,
            url: `${protocol}://${host}/files/uploads/${file.filename}`,
        }));
    }
};