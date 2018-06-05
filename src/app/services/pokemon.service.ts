import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";

/**
 * Adds the toPromise() method to
 * convert an Observable to a Promise.
 */
import "rxjs/add/operator/toPromise";

import { Pokemon } from "./../model/pokemon";


@Injectable()
export class PokemonService {

  /**
  * Pokemon API URL as per requirement first 151 Pokemons
  */
  private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';


  constructor(private _http: Http) { }

  fetchPokemon() {

    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.get(this.apiUrl, {
      headers: headers
    })
    .toPromise()
    .then((res: Response) => {
      var data = res.json();
      var allPokemon = [];

      data.results.forEach((entry) => {
        var pokemon = new Pokemon();
        pokemon.name = entry.name;
        var url = entry.url;
        pokemon.id = entry.url.match(/\d+(?!.*\d)/);
        allPokemon.push(pokemon);
      });

      return allPokemon;
    })
    .catch(this.handleError);
  }


  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
