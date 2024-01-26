export interface IFastifyMultipartBodyFile {
  _buf: Buffer;
  encoding: string;
  filename: string;
  mimetype: string;
  toBuffer(): Buffer;
}

export interface IFastifyMultipartBodyTextField {
  value: string;
  encoding: string;
  mimetype: string;
}
