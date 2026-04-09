import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveContactDialog } from './remove-contact-dialog';

describe('RemoveContactDialog', () => {
  let component: RemoveContactDialog;
  let fixture: ComponentFixture<RemoveContactDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveContactDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveContactDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
