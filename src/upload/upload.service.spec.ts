import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IFastifyMultipartBodyFile, IUploadFileResponse } from './interfaces';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValueOnce({
              region: 'us-east-1', // Replace with your desired region
              bucketName: 'your-bucket-name', // Replace with your desired bucket name
              accessKeyId: 'your-access-key-id', // Replace with your access key ID
              secretAccessKey: 'your-secret-access-key', // Replace with your secret access key
            }),
          },
        },
        {
          provide: S3Client,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file to S3', async () => {
      // Mock the necessary dependencies
      const files: IFastifyMultipartBodyFile[] = [
        {
          _buf: Buffer.from('test file content'),
          filename: 'file.jpg',
          mimetype: 'image/jpeg',
          encoding: '7bit',
          toBuffer: () => Buffer.from('test file content'),
        },
      ];

      // Call the method under test
      const result: IUploadFileResponse = await service.uploadFile(files);

      // Assertions
      expect(result).toBeDefined();
      expect(result.data.files).toContain('.jpg');
    });

    it('should throw an error for invalid file types', async () => {
      // Mock the necessary dependencies
      const files: IFastifyMultipartBodyFile[] = [
        {
          _buf: Buffer.from('test file content'),
          filename: 'file.txt',
          mimetype: 'image/txt',
          encoding: '7bit',
          toBuffer: () => Buffer.from('test file content'),
        },
      ];

      // Call the method under test and expect it to throw an error
      await expect(service.uploadFile(files)).rejects.toThrowError(
        'Invalid file type',
      );
    });
  });
});
