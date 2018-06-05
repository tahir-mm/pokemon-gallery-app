import { TestBed, inject } from '@angular/core/testing';

import { PokemonServiceService } from './pokemon-service.service';

describe('PokemonServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonServiceService]
    });
  });

  it('should be created', inject([PokemonServiceService], (service: PokemonServiceService) => {
    expect(service).toBeTruthy();
  }));
});
