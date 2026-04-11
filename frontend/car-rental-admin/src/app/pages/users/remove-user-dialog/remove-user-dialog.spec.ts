import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserDialog } from './remove-user-dialog';

describe('RemoveUserDialog', () => {
  let component: RemoveUserDialog;
  let fixture: ComponentFixture<RemoveUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveUserDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveUserDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
