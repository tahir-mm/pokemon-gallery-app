import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


import { PaginationService } from './pagination.service';
import { Pokemon } from "./../model/pokemon";


@Injectable()
export class PokemonService {

  /**
   * Array of all Pokemon objects
   *  (151) that will be used to
   * provide filter and pagination.
   * initialized it to an empty
   * array.
   */
  private pokemonData : Pokemon [] = [];

  /**
  * Hold the page current Indexes
  * start and end Indexes.
  */
  page: any = {};

  private isDataAvailableSubject = new ReplaySubject<boolean>(1);
  public isDataAvailable = this.isDataAvailableSubject.asObservable();

  /**
   * Inject the httpClient
   */
  constructor(private _http: HttpClient, private paginationService: PaginationService) { }

  loadData() {
    return this.getAllPokemon().subscribe(data => {
        this.pokemonData = this.parsePokemonIds(data);
        this.isDataAvailableSubject.next(true);
      },
      (err: HttpErrorResponse) => {
        this.isDataAvailableSubject.next(false);
        console.log('Error while loading data ' + JSON.stringify(err));
      });
  }


 /**
  * Pokemon API URL as per requirement first 151 Pokemons
  */
  private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=151';

  /**
  * Return Pokemon array from response body.
  */
  getAllPokemon() : Observable<any> {

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this._http.get<any> (this.apiUrl, { headers }).map( data => data.results);
  }

  /**
   * Next Pokemon page.
   */
  getPageData() {
   /**
    * get page object from service
    */
    this.page = this.paginationService.getNextPageIndexes();

    // get current page of pokemon
    return this.pokemonData.slice(this.page.startIndex, this.page.endIndex);
  }

  /**
   * Previous Pokemon page.
   */
  getPreviousPage() {
   // get page object from service
    this.page = this.paginationService.getPreviousPageIndexes();

    // get current page of pokemon
    return this.pokemonData.slice(this.page.startIndex, this.page.endIndex);

  }


  /**
   * Filter event handler method
   * will return pokemon objects
   * from already fetched objects if
   * fond.
   */
  filterPokemonData(searchToken: string) {

   /**
    * Only filter if searchToken is not undefined and minimum 2 chars.
    */
    if(searchToken && searchToken !== '' && searchToken.length >= 2) {
      console.log('Searching....' + searchToken);

      return Object.assign([], this.pokemonData).filter(
        item => item.name.toLowerCase().indexOf(searchToken.toLowerCase()) > -1
      );
    }
  }

  clearSearchResult() {
    return this.pokemonData.slice(this.page.startIndex, this.page.endIndex);
  }

  /**
  *Utility method to parse ids from url.
  *
  */
  private parsePokemonIds(data) {
    var allPokemon = [];
    data.forEach((entry) => {
      var p = new Pokemon();
      p.name = entry.name;
      var url = entry.url;
      p.id = entry.url.match(/\d+(?!.*\d)/);
      allPokemon.push(p);
    });

    return allPokemon;
  }

  /**
  * Return response object containing body
  */
  getPokemon() : Observable<any> {

    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");

    return this._http.get<any> (this.apiUrl, { headers });
  }
}
