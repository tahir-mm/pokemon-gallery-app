import { Component, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";

import { Pokemon } from './../../model/pokemon';
import { PokemonService } from './../../services/pokemon.service';


@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  /**
   * a array of Pokemon objects
   * of page size (20) that will
   * be rendered, initialized it to an empty
   * array.
   */
  pokemon: Pokemon[] = [];

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
      private pokemonService: PokemonService) { }

  /**
   * A lifecycle method
   * that is automatically
   * invoked when the component
   * is created.
   */
  ngOnInit() {

    this.responsiveGridConfig();

    /**
     * Load first pokemon page
     */
    this.loadFirstPage();
  }

  /**
  * Responsive configurations
  * xs 1 column,
  * sm & md 2 columns
  * large & extra large 4 columns
  */
  responsiveGridConfig() {
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
  }

  /**
  *
  * Load first page of Pokemon
  */
  loadFirstPage() {
    this.loading = true;
    this.pokemonService.isDataAvailable.subscribe( (isAvailable) => {

      if(isAvailable) {
        console.log('loaded successfully...');
        this.loading = false;
        this.pokemon = this.pokemonService.getPageData();
      } else {
        this.loading = false;
      }
    });
  }

  /**
  * Get next page of Pokemon
  */
  loadNextPage() {
    console.log('Next >> ');
    this.pokemon = this.pokemonService.getPageData();
  }

  /**
   * Previous page method event handler.
   */
  loadPreviousPage() {
    console.log('Previous << ');
    this.pokemon = this.pokemonService.getPreviousPage();
  }

  /**
   * Filter event handler method
   * will return pokemon objects
   * from already fetched objects if
   * fond.
   */
  searchPokemon() {
    this.pokemon = this.pokemonService.filterPokemonData(this.searchToken);
  }

  /**
   * Reset or clear search
   * event handler method.
   */
  clearSearch() {

    console.log("Clear Search Criteria.");
    this.searchToken = '';

    // get current page of pokemon
    this.pokemon = this.pokemonService.clearSearchResult();
  }

}
