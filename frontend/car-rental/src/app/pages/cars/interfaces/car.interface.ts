export interface CarI {
  _id: string;
  carName: string;
  transmissionType: string;
  seatsNumber: string;
  carType: string;
  model: string;
  pricePerDay: string;
  imageUrl: string;
  available: boolean;

  [key: string]: any;
}
