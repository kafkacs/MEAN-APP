import { Component, model, ModelSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberInputConfigI } from './interfaces/number-input-config.interface';

@Component({
  selector: 'app-number-input',
  imports: [ReactiveFormsModule],
  templateUrl: './number-input.html',
  styleUrl: './number-input.scss',
})
export class NumberInput {
  config: ModelSignal<NumberInputConfigI> = model.required<NumberInputConfigI>();
}
