import { Component, OnInit } from '@angular/core';

import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";

import { Pokemon } from './../../model/pokemon';
import { PokemonService } from './../../services/pokemon.service';
import { PaginationService } from './../../services/pagination.service';


@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  /**
   * Array of all Pokemon objects
   *  (151) that will be used to
   * provide filter and pagination.
   * initialized it to an empty
   * array.
   */
  fetchedPokemon: Pokemon[] = [];

  /**
   * a array of Pokemon objects
   * of page size (20) that will
   * be rendered, initialized it to an empty
   * array.
   */
  pokemon: Pokemon[] = [];

  /**
  * Hold the page current Indexes
  * start and end Indexes.
  */
  page: any = {};

  loading: boolean = false;

  /**
  *To make Pokemon list responsive observable object.
  */
  public cols: Observable<number>;

  /**
   * a field to keep search text.
   */
  public searchToken: string = '';

  /**
   * Inject the Pokemon, Pagination and ObservableMedia.
   */
  constructor(private observableMedia: ObservableMedia,
      private pokemonService: PokemonService,
      private paginationService: PaginationService) { }

  /**
   * A lifecycle method
   * that is automatically
   * invoked when the component
   * is created.
   */
  ngOnInit() {

    /**
    * Responsive configurations
    * xs 1 column,
    * sm & md 2 columns
    * large & extra large 4 columns
    */
    const grid = new Map([ ["xs", 1], ["sm", 2], ["md", 2],  ["lg", 4], ["xl", 4]]);

    let start: number;
    grid.forEach((cols, mqAlias) => {
      if (this.observableMedia.isActive(mqAlias)) {
        start = cols;
      }
    });

    this.cols = this.observableMedia.asObservable()
      .map(change => {
        console.log(change);
        console.log(grid.get(change.mqAlias));
        return grid.get(change.mqAlias);
      })
      .startWith(start);

    /**
     * Load all Pokemon objects.
     */
    this.loadAllPokemon();

  }


  /**
  * Load all Pokemon 151 objects first time
  * and then use fetchedPokemon cache for
  * filtering and pagination.
  */
  loadAllPokemon() {
    this.loading = true;

    this.pokemonService.getAllPokemon().subscribe( data => {

      this.fetchedPokemon = this.parsePokemonIds(data);

     /**
      * Load the first page of Pokemon.
      */
      this.loadPage();
      this.loading = false;
      console.log(`loading finished ... ${this.pokemon.length}`);
    },
    (err: any) => {
        this.loading = false;
      if(err.error instanceof Error) {

        console.log(`An error occurred ${err.error.message}`);
      } else {

        console.log(`Backend returned status code ${err.status}`);
        console.log(`Response Body ${err.error}`);
      }
    });
  }

  loadPage() {
    console.log('Next >> ');

   /**
    * get page object from service
    */
    this.page = this.paginationService.getNextPageIndexes();

    // get current page of pokemon
    this.pokemon = this.fetchedPokemon.slice(this.page.startIndex, this.page.endIndex);
  }

  /**
   * Previous page method event handler.
   */
  loadPreviousPage() {
    console.log('Previous << ');

   // get page object from service
    this.page = this.paginationService.getPreviousPageIndexes();

    // get current page of pokemon
    this.pokemon = this.fetchedPokemon.slice(this.page.startIndex, this.page.endIndex);

  }

  /**
   * Filter event handler method
   * will return pokemon objects
   * from already fetched objects if
   * fond.
   */
  searchPokemon() {

   /**
    * Only filter if searchToken is not undefined and minimum 2 chars.
    */
    if(this.searchToken && this.searchToken !== '' && this.searchToken.length >= 2) {
      console.log('Searching....' + this.searchToken);

      this.pokemon = Object.assign([], this.fetchedPokemon).filter(
        item => item.name.toLowerCase().indexOf(this.searchToken.toLowerCase()) > -1
      );

    }
  }

  /**
   * Reset or clear search
   * event handler method.
   */
  clearSearch() {

    console.log("Clear Search Criteria.");
    this.searchToken = '';

    // get current page of pokemon
    this.pokemon = this.fetchedPokemon.slice(this.page.startIndex, this.page.endIndex);
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

}
