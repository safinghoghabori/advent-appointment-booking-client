export enum UserType {
  TruckingCompany = 'TruckingCompany',
  Terminal = 'Terminal',
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface TerminalData {
  PortName: string;
  Email: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface TrCompanyData {
  TrCompanyName: string;
  Email: string;
  TransportLicNo: string;
  GstNo: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface LoginResp {
  token: string;
  data: TerminalData | TrCompanyData;
}
