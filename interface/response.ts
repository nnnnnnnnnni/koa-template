export type TCode = 0| 1 |2

export interface IResponse {
  code: TCode;
  data: any;
  message: string;
  timestamp: number;
}

