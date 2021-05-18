export interface IConfig {
  environment: "development" | "production";
  prot: number;
  localStatic: string;
  jwt: {
    name: string;
    alg: string;
    secret: string;
    time: number;
  };
  mongo: {
    host: string;
    port: number;
    name: string;
    pass?: string;
  };
  redis?: {
    host: string;
    port: number;
    pass?: string;
  };
}
