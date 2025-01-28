import { UploadImgService } from './upload-img.service';
import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Upload Images') // Gắn tag Swagger cho toàn bộ controller
@Controller('upload-img')
export class UploadImgController {
  constructor(private readonly uploadImgService: UploadImgService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Nơi lưu trữ file
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload a file' }) // Mô tả endpoint
  @ApiConsumes('multipart/form-data') // Định nghĩa loại dữ liệu
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Định nghĩa file upload
        },
        productId: {
          type: 'number', // Định nghĩa productId
          example: 1, // Ví dụ cho productId
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file upload.' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('productId') productId: number,
  ) {
    const savedFile = await this.uploadImgService.saveFile(file, productId);
    return {
      message: 'File uploaded successfully',
      data: savedFile,
    };
  }
  @Get()
  @ApiOperation({ summary: 'Get all uploaded files' })
  @ApiResponse({ status: 200, description: 'List of uploaded files.' })
  async getAllUploads() {
    return this.uploadImgService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file details by ID' })
  @ApiParam({ name: 'id', description: 'ID of the file' })
  @ApiResponse({ status: 200, description: 'File details.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async getUploadById(@Param('id') id: number) {
    return this.uploadImgService.findOne(id);
  }

  @Get('file/:id')
  @ApiOperation({ summary: 'Serve the file by ID' })
  @ApiParam({ name: 'id', description: 'ID of the file to serve' })
  @ApiResponse({ status: 200, description: 'File served successfully.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async serveFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.uploadImgService.findOne(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    return res.sendFile(file.filepath, { root: '.' });
  }
}
