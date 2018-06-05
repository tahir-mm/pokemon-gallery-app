import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {

  /**
   * Property to hold total number of Pokemon object.
   */
  private totalPokemon : number = 151;

  /**
   * Page size configured as 20.
   */
  private pageSize : number = 20;

  /**
   * Fetched Pokemon collection startIndex for pagination.
   */
  private startIndex : number = 0;

  /**
   * Fetched Pokemon collection endIndex for pagination
   */
  private endIndex : number = 0;

  constructor() { }

  /**
   * Return Page object with calculated
   * start index and end Index for next page.
   */
  getNextPageIndexes () {

  /**
   * Only pagination next event work if end index
   * is less than total pokemon objects.
   */
    if(this.endIndex <= this.totalPokemon ) {
      this.startIndex = this.endIndex;
      this.endIndex = this.endIndex + this.pageSize ;
    }

    return {
      startIndex: this.startIndex,
      endIndex: this.endIndex
    };
  }


  /**
   * Return previous page start index and end index.
   */
  getPreviousPageIndexes () {

  /**
   * Check to stop pagination previous event if start index
   * is zero.
   */
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
