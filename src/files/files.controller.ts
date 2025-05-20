import { Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { multerConfig } from './multerConfig';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            const host = `${req.protocol}://${req.get('host')}/files/uploads`;
            const uploadedFiles = await this.filesService.handleFileUpload(files, req.protocol, host);
            return res.status(HttpStatus.CREATED).send(uploadedFiles);
        } catch (error) {
            throw new HttpException(
                { desc: error.message || 'Error interno del servidor' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    @Get('/uploads/:filename')
    async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
        try {
            const filePath = join(process.cwd(), 'src', 'uploads', filename);

            if (!existsSync(filePath)) {
                throw new HttpException('Archivo no encontrado', HttpStatus.NOT_FOUND);
            }

            const fileStream = createReadStream(filePath);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            return fileStream.pipe(res);
        } catch (error) {
            throw new HttpException(
                { desc: error.message || 'Error interno del servidor' },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
