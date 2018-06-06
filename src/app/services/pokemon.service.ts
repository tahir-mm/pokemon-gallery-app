import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Pokemon } from "./../model/pokemon";


@Injectable()
export class PokemonService {

  constructor(private _http: HttpClient) { }

  /**
  * Pokemon API URL as per requirement first 151 Pokemons
  */
  private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=151';

  getPokemon() : Observable<any> {

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this._http.get<any> (this.apiUrl, { headers });
  }

  getAllPokemon() : Observable<any> {

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this._http.get<any> (this.apiUrl, { headers }).map( data => data.results);
  }
}
