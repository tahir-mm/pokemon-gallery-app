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

  fetchedPokemon: Pokemon[] = [];

  pokemon: Pokemon[] = [];

  // pager object
  pager: any = {};

  public cols: Observable<number>;

  public searchToken: string = '';

  constructor(private observableMedia: ObservableMedia, private pokemonService: PokemonService, private paginationService: PaginationService) { }

  ngOnInit() {
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

    this.loadAllPokemon();
  }

  loadAllPokemon() {
      this.pokemonService.fetchPokemon()
            .then((pokemon) => {
             this.fetchedPokemon = pokemon;

             // loading first page for pokemon
             this.loadPage();
           });

  }

  loadPage() {
    console.log('Next >> ');

   // get pager object from service
    this.pager = this.paginationService.getNextPageIndexes();
    // get current page of pokemon
    this.pokemon = this.fetchedPokemon.slice(this.pager.startIndex, this.pager.endIndex);


  }

  loadPreviousPage() {
    console.log('Previous << ');
   // get pager object from service
    this.pager = this.paginationService.getPreviousPageIndexes();
    // get current page of pokemon
    this.pokemon = this.fetchedPokemon.slice(this.pager.startIndex, this.pager.endIndex);

  }

  searchPokemon() {
    if(this.searchToken && this.searchToken !== '' && this.searchToken.length >= 2) {
      console.log('Searching....' + this.searchToken);

      this.pokemon = Object.assign([], this.fetchedPokemon).filter(
        item => item.name.toLowerCase().indexOf(this.searchToken.toLowerCase()) > -1
      );

      console.log(this.pokemon.length);
    }

  }

  clearSearch() {

    console.log("Clear Search Criteria.");
    this.pokemon = this.fetchedPokemon;
  }



}
