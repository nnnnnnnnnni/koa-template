export interface IConfig {
  environment: 'development' | 'production'
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