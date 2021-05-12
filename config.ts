import { IConfig } from "./interface/config";
import path from 'path';

export const config: IConfig = {
  prot: 3000,
  localStatic: path.resolve(__dirname, '/public')
}