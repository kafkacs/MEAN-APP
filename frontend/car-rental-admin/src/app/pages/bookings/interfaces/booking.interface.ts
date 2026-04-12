import { UserI } from '../../../shared/interfaces/user.interface';

export interface BookingI {
  _id: string;
  user?: UserI;
  car: {
    _id: string;
    carName: string;
    imageUrl: string;
    model: string;
    carType: string;
    pricePerDay: number;
    seatsNumber: number;
    transmissionType: number;
  };
  startDate: string;
  endDate: string;
  nameOfBooker: string;
  emailOfBooker: string;
  contactNumberOfBooker: string;
  startTime?: string;
  endTime?: string;
  totalPrice: number;
  status: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
