import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAdminComponent } from './shift-admin.component';

describe('ShiftAdminComponent', () => {
  let component: ShiftAdminComponent;
  let fixture: ComponentFixture<ShiftAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
