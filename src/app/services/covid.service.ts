import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import API from "@aws-amplify/api";
import Config from "src/aws-exports";
API.configure(Config);

// If this is undefined, make sure you ran `amplify init` on
// your project root directory (see README)
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
  // private api = "https://corona.lmao.ninja";

  constructor() {}

  /**
   * Returns all total cases, recovery, and deaths.
   */
  public all(): Promise<any | All> {
    return API.get(api, "/all", {});
  }

  /**
   * Returns data of all countries that has COVID-19
   */
  public countries(): Promise<any | [Country]> {
    return API.get(api, "/countries", {});
  }

  /**
   * Returns data of a specific country
   * @param country The country
   */
  public async country(country: string): Promise<any | Country> {
    try {
      let countries = await API.get(api, "/countries", {});
      let c = countries.find(e =>
        e.country.toLowerCase().includes(country.toLowerCase())
      );
      return Promise.resolve(c);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Returns all United States of America and their Corona data
   */
  public states(): Promise<any | [State]> {
    return API.get(api, "/states", {});
  }

  /**
   * Get historical data from the start of 2020. (JHU CSSE GISand Data)
  public historical(): Observable<any> {
    return this.http.get(`${this.api}/historical`);
  }
  */
}
