import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCarDialog } from './remove-car-dialog';

describe('RemoveCarDialog', () => {
  let component: RemoveCarDialog;
  let fixture: ComponentFixture<RemoveCarDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveCarDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveCarDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
