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
   * envoked when the component
   * is created.
   */
  ngOnInit() {

    /**
    * Responsive configurations
    */
    const grid = new Map([
      ["xs", 1],
      ["sm", 2],
      ["md", 2],
      ["lg", 4],
      ["xl", 4]
    ]);
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

  loadAllPokemon() {
    this.pokemonService.fetchPokemon()
      .then((pokemon) => {

       /**
        * populating fetched pokemon cache.
        */
       this.fetchedPokemon = pokemon;

       /**
        * Load the first page of Pokemon.
        */
        this.loadPage();
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
    this.pokemon = this.fetchedPokemon;
  }


}
