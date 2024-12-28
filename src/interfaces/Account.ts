export interface CreateAccount {
  name: string;
  firstName: string;
  phoneNumber: string;
  password: string;
}

export interface AccountResponse {
  id: string;
  name: string;
  firstName: string;
  role: string;
  phoneNumber: string;
}
