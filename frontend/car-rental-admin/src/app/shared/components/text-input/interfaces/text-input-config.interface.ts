import { FormControl } from '@angular/forms';

export interface TextInputConfigI {
  placeholder?: string;
  control: FormControl<string | null>;
  label?: string;
}
