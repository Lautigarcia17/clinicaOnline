import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialistTableComponent } from './specialist-table.component';

describe('SpecialistTableComponent', () => {
  let component: SpecialistTableComponent;
  let fixture: ComponentFixture<SpecialistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialistTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
