import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSpecialistComponent } from './shift-specialist.component';

describe('ShiftSpecialistComponent', () => {
  let component: ShiftSpecialistComponent;
  let fixture: ComponentFixture<ShiftSpecialistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftSpecialistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
