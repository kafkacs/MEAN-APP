import { FormControl } from '@angular/forms';

export interface NumberInputConfigI {
  placeholder?: string;
  control: FormControl<string | null>;
  label?: string;
}
