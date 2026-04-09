import { Component, model, ModelSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DateInputConfigI } from './interfaces/date-input-config.interface';

@Component({
  selector: 'app-date-input',
  imports: [ReactiveFormsModule],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
})
export class DateInput {
  config: ModelSignal<DateInputConfigI> = model.required<DateInputConfigI>();
}
