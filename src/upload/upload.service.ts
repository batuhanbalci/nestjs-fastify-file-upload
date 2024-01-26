import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { IFastifyMultipartBodyFile, IUploadFileResponse } from './interfaces';

const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const VALID_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

@Injectable()
export class UploadService {
  private readonly region: string;
  private readonly bucketName: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('aws.region');
    this.bucketName = this.configService.get<string>('aws.bucketName');
    this.accessKeyId = this.configService.get<string>('aws.accessKeyId');
    this.secretAccessKey = this.configService.get<string>(
      'aws.secretAccessKey',
    );
  }

  private getS3Client(): S3Client {
    return new S3Client({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: this.region,
    });
  }

  private async uploadFileToS3(key, buffer): Promise<void> {
    const s3Client = this.getS3Client();
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
      }),
    );
  }

  private getRandomFileName(length): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private getExtension(fileName: string): string {
    return fileName.split('.').pop();
  }

  async uploadFile(
    files: IFastifyMultipartBodyFile[],
  ): Promise<IUploadFileResponse> {
    try {
      const fileNames: string[] = [];

      for (const file of files) {
        const extension = this.getExtension(file.filename);

        if (!VALID_FILE_EXTENSIONS.includes(extension)) {
          throw new Error('Invalid file extension');
        }

        if (!VALID_MIME_TYPES.includes(file.mimetype)) {
          throw new Error('Invalid file mime type');
        }

        const randomFileName = this.getRandomFileName(16);
        const key = `${randomFileName}.${extension}`;

        const buffer = await file.toBuffer();

        await this.uploadFileToS3(key, buffer);

        fileNames.push(key);
      }

      return {
        message: 'Files uploaded successfully',
        data: {
          files: fileNames,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
