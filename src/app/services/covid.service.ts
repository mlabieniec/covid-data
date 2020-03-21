import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface All {
  cases: string,
  deaths: string,
  recovered: string,
  updated: number
};

export interface Country {
  country: string,
  cases: number,
  todayCases: number,
  deaths: number,
  todayDeaths: number,
  recovered: number,
  active: number,
  critical: number,
  casesPerOneMillion: number
};

export interface State {
  state: string,
  cases: number,
  todayCases: number,
  deaths: number,
  todayDeaths: number,
  recovered: number,
  active: number
};

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  // Root URL for https://github.com/NovelCOVID/API
  private api = "https://corona.lmao.ninja";

  constructor( private http:HttpClient ) { }
  
  /**
   * Returns all total cases, recovery, and deaths.
   */
  public all(): Observable<any|All> {
    return this.http.get(`${this.api}/all`);
  }

  /**
   * Returns data of all countries that has COVID-19
   * @param sort Returns data of each country sorted by the parameter
   */
  public countries(sort?:string): Observable<any|[Country]> {
    return this.http.get(
      this.api + ((sort) ? `/countries?sort=${sort}` : '/countries')
    );
  }

  /**
   * Returns data of a specific country
   * @param country The country
   */
  public country(country:string): Observable<any|Country> {
    return this.http.get(
      `${this.api}/countries/${country}`
    );
  }

  /**
   * Returns all United States of America and their Corona data
   */
  public states(): Observable<any|[State]> {
    return this.http.get(`${this.api}/states`);
  }

  /**
   * Get historical data from the start of 2020. (JHU CSSE GISand Data)
   */
  public historical(): Observable<any> {
    return this.http.get(`${this.api}/historical`);
  }
}
