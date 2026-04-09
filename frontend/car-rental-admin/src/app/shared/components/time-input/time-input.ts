import {
  Component,
  EventEmitter,
  model,
  ModelSignal,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { TimeInputConfigI } from './interfaces/time-input-config.interface';

@Component({
  selector: 'app-time-input',
  imports: [],
  templateUrl: './time-input.html',
  styleUrl: './time-input.scss',
})
export class TimeInput implements OnInit {
  config: ModelSignal<TimeInputConfigI> = model.required<TimeInputConfigI>();

  @Output() timeChange = new EventEmitter<{
    hour: number;
    minute: number;
    period: string;
  }>();

  hours = Array.from({ length: 13 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);
  selectedPeriod = signal<string>('AM');

  ngOnInit(): void {
    if (this.config().defaultHour !== undefined) {
      this.selectedHour.set(this.config().defaultHour!);
    }
    if (this.config().defaultMinute !== undefined) {
      this.selectedMinute.set(this.config().defaultMinute!);
    }
  }

  onHourChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectedHour.set(value);
    this.emitTime();
  }

  onMinuteChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectedMinute.set(value);
    this.emitTime();
  }

  onPeriodChange(event: Event) {
    const value = String((event.target as HTMLSelectElement).value);
    this.selectedPeriod.set(value);
    this.emitTime();
  }

  private emitTime() {
    this.timeChange.emit({
      hour: this.selectedHour()!,
      minute: this.selectedMinute()!,
      period: this.selectedPeriod(),
    });
  }
}
