import { TestBed } from '@angular/core/testing';

import { CovidService } from './covid.service';

describe('CovidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CovidService = TestBed.get(CovidService);
    expect(service).toBeTruthy();
  });
});
