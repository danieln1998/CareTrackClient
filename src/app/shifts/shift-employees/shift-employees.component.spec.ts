import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEmployeesComponent } from './shift-employees.component';

describe('ShiftEmployeesComponent', () => {
  let component: ShiftEmployeesComponent;
  let fixture: ComponentFixture<ShiftEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftEmployeesComponent]
    });
    fixture = TestBed.createComponent(ShiftEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
