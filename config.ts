import { IConfig } from "./interface/config";
import path from 'path';

export const config: IConfig = {
  environment: 'development',
  prot: 3000,
  localStatic: path.resolve(__dirname, '/public'),
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    name: 'koaTemplateDB'
  }
}