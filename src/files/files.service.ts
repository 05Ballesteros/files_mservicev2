import { Injectable } from '@nestjs/common';
import { Response } from "express";
import { join } from "path"
@Injectable()
export class FilesService {
    async handleFileUpload(files: Express.Multer.File[], protocol: string, host: string): Promise<any[]> {
        if (!files || files.length === 0) {
            throw new Error('No se enviaron archivos');
        }
        return files.map((file) => ({
            name: file.filename,
            url: `${host}/files/uploads/${file.filename}`,
        }));
    }

    async downloadFile(filename: string, res: Response) {
        const filePath = join(process.cwd(), "uploads", filename);
        return res.sendFile(filePath)
    }
};