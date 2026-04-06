import { UserI } from '../../../shared/interfaces/user.interface';

export interface BookingI {
  _id: string;
  user: UserI;
  car: {
    _id: string;
    carName: string;
    imageUrl: string;
    model: string;
    pricePerDay: number;
    transmissionType: number;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
