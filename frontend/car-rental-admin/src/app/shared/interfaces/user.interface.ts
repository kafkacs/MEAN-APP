export interface UserI {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  accountStatus: number;
  gender: number;
  role: number;
  bookingsIDs?: string[];
  isDeleted?: boolean;

  [key: string]: any;
}
