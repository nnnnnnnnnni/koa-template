export interface IConfig {
  prot: number;
  localStatic: string;
  mongo: {
    host: string;
    port: number;
    name: string;
    pass?: string;
  };
  redis?: {
    host: string;
    port: number;
    name: string;
    pass: string;
  };
}