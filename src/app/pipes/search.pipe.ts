import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
    terms = terms.toLowerCase();
    return items.filter( it => {
      if (it.country) {
        return it.country.toLowerCase().includes(terms);
      }
      return it.state.toLowerCase().includes(terms);
    });
  }

}
