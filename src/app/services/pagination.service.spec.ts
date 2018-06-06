import { TestBed, inject } from '@angular/core/testing';

import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationService]
    });
  });

  fit('should be created', inject([PaginationService], (service: PaginationService) => {
    expect(service).toBeTruthy();
  }));

  fit('should return next page indexes', inject([PaginationService], (service: PaginationService) => {
     let page = service.getNextPageIndexes();
     expect(page).toEqual({ startIndex: 0, endIndex: 20});

     page = service.getNextPageIndexes();
     expect(page).toEqual({ startIndex: 20, endIndex: 40});

     page = service.getNextPageIndexes();
     expect(page).toEqual({ startIndex: 40, endIndex: 60});
  }));

  fit('should return previous page indexes', inject([PaginationService], (service: PaginationService) => {

     service.getNextPageIndexes();
     service.getNextPageIndexes();
     let page = service.getPreviousPageIndexes();
     expect(page).toEqual({ startIndex: 0, endIndex: 20});

  }));

});
