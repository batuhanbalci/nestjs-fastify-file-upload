import { IConfig } from './interfaces/config.interface';

export function config(): IConfig {
  return {
    port: parseInt(process.env.PORT),
    aws: {
      region: process.env.AWS_S3_REGION,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    file: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE),
      maxFileCount: parseInt(process.env.MAX_FILE_COUNT),
    },
  };
}
