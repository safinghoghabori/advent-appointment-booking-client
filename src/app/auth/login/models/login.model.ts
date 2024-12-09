export enum UserType {
  TruckingCompany = 'TruckingCompany',
  Terminal = 'Terminal',
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface TerminalData {
  portName: string;
  terminalName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrCompanyData {
  trCompanyName: string;
  email: string;
  transportLicNo: string;
  gstNo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TerminalResp extends TerminalData {
  terminalId: number;
}

export interface TrCompanyResp extends TrCompanyData {
  trCompanyId: number;
}

export interface LoginResp {
  token: string;
  data: TerminalResp | TrCompanyResp;
}
