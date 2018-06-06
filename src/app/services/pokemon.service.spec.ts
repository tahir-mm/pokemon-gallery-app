import { TestBed, inject } from '@angular/core/testing';


import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './../model/pokemon';


describe('PokemonService', () => {

  let pokemonService: PokemonService;
  let httpMock : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonService],
      imports: [HttpClientTestingModule]
    });

    pokemonService = TestBed.get(PokemonService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  fit('should be created', inject([PokemonService], (service: PokemonService) => {
    expect(service).toBeTruthy();
  }));

  fit('should get all Pokemon', inject([PokemonService], (service: PokemonService) => {
    const mockResponse = {
       "count": 3,
       "previous": null,
       "results": [
         {
           "url": "https://pokeapi.co/api/v2/pokemon/1/",
           "name": "bulbasaur"
         },
         {
           "url": "https://pokeapi.co/api/v2/pokemon/2/",
           "name": "ivysaur"
         },
         {
           "url": "https://pokeapi.co/api/v2/pokemon/3/",
           "name": "venusaur"
         }
       ]
     };

     service.getPokemon().subscribe(res => {

        expect(res).toEqual(mockResponse);

     });

     const mockRequest = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
     expect(mockRequest.request.method).toBe('GET');
     mockRequest.flush(mockResponse);

  }));

  fit('should get all Pokemon as array', inject([PokemonService], (service: PokemonService) => {
    const mockResponse = {
       "count": 3,
       "previous": null,
       "results": [
         {
           "url": "https://pokeapi.co/api/v2/pokemon/1/",
           "name": "bulbasaur"
         },
         {
           "url": "https://pokeapi.co/api/v2/pokemon/2/",
           "name": "ivysaur"
         },
         {
           "url": "https://pokeapi.co/api/v2/pokemon/3/",
           "name": "venusaur"
         }
       ]
     };

     let actualRes = [];
     service.getAllPokemon().subscribe( res => {

        actualRes = res;
     });

     const mockRequest = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?offset=0&limit=151');
     expect(mockRequest.request.method).toBe('GET');
     mockRequest.flush(mockResponse);

     expect(actualRes).toEqual(mockResponse.results);

  }));
});
