import { TestBed } from '@angular/core/testing';

import { DayScheduleService } from './day-schedule.service';

describe('DayScheduleService', () => {
  let service: DayScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
