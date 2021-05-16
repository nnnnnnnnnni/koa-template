type TCode = 1 |2

export interface IResponse {
  code: TCode;
  data: any;
  message?: string;
}

