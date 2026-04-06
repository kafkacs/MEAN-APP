export interface UserI {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  accountStatus: number;
  role: number;

  [key: string]: any;
}
