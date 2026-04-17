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
  books: BooksI[];

  [key: string]: any;
}

interface BooksI {
  bookingID: string;
  startDate: string;
  endDate: string;
}
