export interface IConfig {
  prot: number;
  localStatic: string;
  mongo?: {
    host: string;
    port: string;
    name?: string;
    pass?: string;
  };
  redis?: {
    host: string;
    port: string;
    name: string;
    pass: string;
  };
}