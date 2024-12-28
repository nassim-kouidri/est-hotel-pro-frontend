import { AccountResponse } from "./Account";

export interface Login {
  name: string;
  password: string;
}

export interface User {
  token: string;
  name: string;
  firstName: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  accountResponse: AccountResponse;
}
