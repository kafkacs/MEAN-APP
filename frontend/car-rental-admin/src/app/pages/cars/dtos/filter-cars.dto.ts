export class FilterCarsDto {
  text?: string;
  skip!: number;
  limit!: number;
  available?: boolean;
}
