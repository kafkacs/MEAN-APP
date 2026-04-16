import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBookingDialog } from './remove-booking-dialog';

describe('RemoveBookingDialog', () => {
  let component: RemoveBookingDialog;
  let fixture: ComponentFixture<RemoveBookingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveBookingDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveBookingDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
