import { Component, model, ModelSignal } from '@angular/core';
import { TextInputConfigI } from './interfaces/text-input-config.interface';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput {
  config: ModelSignal<TextInputConfigI> = model.required<TextInputConfigI>();
}
