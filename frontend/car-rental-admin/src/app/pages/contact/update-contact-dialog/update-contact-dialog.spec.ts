import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactDialog } from './update-contact-dialog';

describe('UpdateContactDialog', () => {
  let component: UpdateContactDialog;
  let fixture: ComponentFixture<UpdateContactDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateContactDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateContactDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
