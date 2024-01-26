import { Controller, Post, Request } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  uploadFile(@Request() req) {
    return this.uploadService.uploadFile(req.files);
  }
}
