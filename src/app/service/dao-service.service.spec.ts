import { TestBed, inject } from '@angular/core/testing';

import { DaoServiceService } from './dao-service.service';

describe('DaoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DaoServiceService]
    });
  });

  it('should be created', inject([DaoServiceService], (service: DaoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
