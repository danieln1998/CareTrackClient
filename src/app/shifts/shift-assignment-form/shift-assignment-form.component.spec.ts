import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAssignmentFormComponent } from './shift-assignment-form.component';

describe('ShiftAssignmentFormComponent', () => {
  let component: ShiftAssignmentFormComponent;
  let fixture: ComponentFixture<ShiftAssignmentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftAssignmentFormComponent]
    });
    fixture = TestBed.createComponent(ShiftAssignmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
