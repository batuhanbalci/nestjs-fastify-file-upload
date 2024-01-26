import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
  AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
  MAX_FILE_SIZE: Joi.number().required(),
  MAX_FILE_COUNT: Joi.number().required(),
});
