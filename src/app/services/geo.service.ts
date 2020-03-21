import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Country, State } from "./covid.service";

@Injectable({
  providedIn: "root"
})
export class GeoService {
  private _geoApi =
    "https://geo.ipify.org/api/v1?apiKey=at_lxzDk1ZLkKMnbxtJh93nZlQO85N4F";
  private _ip: string;
  private _geo: any;

  constructor(private http: HttpClient) {}

  async getLocation() {
    if (window.localStorage.getItem("geo")) {
      return JSON.parse(window.localStorage.getItem("geo"));
    }
    this._geo = await this.http.get(this._geoApi).toPromise();
    if (this._geo) {
      this._persistGeo();
      return Promise.resolve(this._geo);
    } else {
      return Promise.reject("Could not load geo data");
    }
  }

  public setHomeCountry(c: Country) {
    try {
      let geo = JSON.parse(window.localStorage.getItem("geo"));
      if (geo && geo.location) {
        geo.location.country = c.country;
        this._geo = geo;
        this._persistGeo();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public setHomeState(s: State) {
    try {
      let geo = JSON.parse(window.localStorage.getItem("geo"));
      if (geo && geo.location) {
        geo.location.region = s.state;
        this._geo = geo;
        this._persistGeo();
      }
    } catch (error) {
      console.log(error);
    }
  }

  private _persistGeo() {
    window.localStorage.setItem("geo", JSON.stringify(this._geo));
  }
}
