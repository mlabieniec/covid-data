import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  private _ipApi = "http://ip.jsontest.com/";
  private _geoApi = "http://api.ipstack.com";
  private _geoKey = "3cd83d1932bdd988526847a2233b9f00";

  private _ip:string;
  private _geo:any;

  constructor( private http:HttpClient ) { 
    
  }

  /*
  {
    "ip":"134.201.250.155",
    "type":"ipv4",
    "continent_code":"NA",
    "continent_name":"North America",
    "country_code":"US",
    "country_name":"United States",
    "region_code":"CA",
    "region_name":"California",
    "city":"Los Angeles",
    "zip":"90012",
    "latitude":34.0655517578125,
    "longitude":-118.24053955078125,
    "location":{
      "geoname_id":5368361,
      "capital":"Washington D.C.",
      "languages":[
        {
          "code":"en",
          "name":"English",
          "native":"English"
        }
      ],
      "country_flag":"http:\/\/assets.ipstack.com\/flags\/us.svg",
      "country_flag_emoji":"\ud83c\uddfa\ud83c\uddf8",
      "country_flag_emoji_unicode":"U+1F1FA U+1F1F8",
      "calling_code":"1",
      "is_eu":false
    }
  }
  */
  async getLocation() {
    if (window.localStorage.getItem('geo')) {
      return JSON.parse(window.localStorage.getItem('geo'));
    }

    if (!window.localStorage.getItem('ip')) {
      this._ip = (await this.http.get(this._ipApi).toPromise() as any).ip;
      this._persistIp();
    } else {
      this._ip = window.localStorage.getItem('ip');
    }

    this._geo = await this.http.get(`${this._geoApi}/${this._ip}?access_key=${this._geoKey}`).toPromise();
    this._persistGeo();
    
    return Promise.resolve(this._geo);
  }

  private _persistIp() {
    window.localStorage.setItem('ip',this._ip);
  }

  private _persistGeo() {
    window.localStorage.setItem('geo',JSON.stringify(this._geo));
  }
}
