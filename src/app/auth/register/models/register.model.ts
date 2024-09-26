import { TerminalData, TrCompanyData } from '../../login/models/login.model';

export interface TrCompanyFormData extends TrCompanyData {
  email: string;
  password: string;
}

export interface TerminalFormData extends TerminalData {
  email: string;
  password: string;
}
