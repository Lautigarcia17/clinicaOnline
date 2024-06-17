import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPatientComponent } from './shift-patient.component';

describe('ShiftPatientComponent', () => {
  let component: ShiftPatientComponent;
  let fixture: ComponentFixture<ShiftPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
