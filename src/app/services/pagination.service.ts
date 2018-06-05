import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {

  private totalPokemon : number = 151;

  private pageSize : number = 20;

  private startIndex : number = 0;

  private endIndex : number = 0;

  constructor() { }

  getNextPageIndexes () {

    if(this.endIndex <= this.totalPokemon ) {
      this.startIndex = this.endIndex;
      this.endIndex = this.endIndex + this.pageSize ;
    }

    return {
      startIndex: this.startIndex,
      endIndex: this.endIndex
    };
  }

  getPreviousPageIndexes () {

    if(this.startIndex !== 0 && this.endIndex !== this.pageSize) {
        this.startIndex = this.startIndex - this.pageSize;
        this.endIndex = this.endIndex - this.pageSize ;
    }

    return {
        startIndex: this.startIndex,
        endIndex: this.endIndex
    };
  }

}
