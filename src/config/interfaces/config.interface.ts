import { IAWSConfig } from './aws.interface';
import { IFileConfig } from './file.interface';

export interface IConfig {
  readonly port: number;
  readonly aws: IAWSConfig;
  readonly file: IFileConfig;
}
