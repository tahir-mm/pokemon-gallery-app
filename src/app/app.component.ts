import { Component, OnInit } from '@angular/core';

import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Pokemon Gallery';

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    console.log('loading all pokemon');
    /**
    * Load all Pokemon
    */
    this.pokemonService.loadData();
  }
}
