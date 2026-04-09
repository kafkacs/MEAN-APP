import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  Injectable,
  Type,
} from '@angular/core';
import { DynamicObjectI } from '../../../shared/interfaces/dynamic-object.interface';
import { ComponentClass } from './component.class';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly appRef: ApplicationRef) {}
  dialogComponent!: ComponentRef<Component>;

  public openDialog(component: Type<ComponentClass>, data: DynamicObjectI = {}) {
    const parentElement = document.getElementById('dialogs');
    const environmentInjector = this.appRef.injector;

    this.dialogComponent = createComponent(component, {
      environmentInjector,
    });

    this.appRef.attachView(this.dialogComponent.hostView);
    parentElement?.appendChild(this.dialogComponent.location.nativeElement);

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        this.dialogComponent.setInput(key, element);
      }
    }

    this.dialogComponent.changeDetectorRef.detectChanges();
  }

  public closeDialog() {
    if (!this.dialogComponent) return;
    this.appRef.detachView(this.dialogComponent.hostView);
    this.dialogComponent.destroy();
  }
}
