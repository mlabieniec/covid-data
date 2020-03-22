import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import API from "@aws-amplify/api";
import Config from "src/aws-exports";
API.configure(Config);

// amplify add api
const api = Config.aws_cloud_logic_custom[0].name;

export interface All {
  cases: string;
  deaths: string;
  recovered: string;
  updated: number;
}

export interface Country {
  country: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
}

export interface State {
  state: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
}

@Injectable({
  providedIn: "root"
})
export class CovidService {
  // Root URL for https://github.com/NovelCOVID/API
  private api = "https://corona.lmao.ninja";

  constructor(private http: HttpClient) {}

  /**
   * Returns all total cases, recovery, and deaths.
   */
  public all(): Promise<any | All> {
    //return this.http.get(`${this.api}/all`);
    return API.get(api, "/all", {});
  }

  /**
   * Returns data of all countries that has COVID-19
   * @param sort Returns data of each country sorted by the parameter
   */
  public countries(sort?: string): Promise<any | [Country]> {
    /*return this.http.get(
      this.api + (sort ? `/countries?sort=${sort}` : "/countries")
    );*/
    return API.get(api, sort ? `/countries?sort=${sort}` : "/countries", {});
  }

  /**
   * Returns data of a specific country
   * @param country The country
   */
  public country(country: string): Promise<any | Country> {
    return this.http.get(`${this.api}/countries/${country}`).toPromise();
  }

  /**
   * Returns all United States of America and their Corona data
   */
  public states(): Promise<any | [State]> {
    //return this.http.get(`${this.api}/states`);
    return API.get(api, "/states", {});
  }

  /**
   * Get historical data from the start of 2020. (JHU CSSE GISand Data)
   */
  public historical(): Observable<any> {
    return this.http.get(`${this.api}/historical`);
  }
}
