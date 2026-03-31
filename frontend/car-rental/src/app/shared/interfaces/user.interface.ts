export interface UserI {
  _id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: number;
  role: number;

  [key: string]: any;
}
