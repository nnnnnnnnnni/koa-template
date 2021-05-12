type TCode = 1 |2

enum CODES {
  'SUCCESS',
  'ERROR'
}

export interface IResponse {
  code: TCode;
  data: any;
  message?: string;
}

