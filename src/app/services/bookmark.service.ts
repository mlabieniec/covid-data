import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { State, Country, CovidService } from "./covid.service";

export interface Bookmark {
  item: Country | State;
}

@Injectable({
  providedIn: "root"
})
export class BookmarkService {
  public bookmarks = {};
  private _bookmarkSubject = new Subject<any>();
  public bookmarkSub = this._bookmarkSubject.asObservable();

  private _key = "bookmarks";

  constructor(private covid: CovidService) {
    this.getBookmarks();
  }

  public add(item: any) {
    if (item.country) {
      this.bookmarks[item.country] = item;
    } else if (item.state) {
      this.bookmarks[item.state] = item;
    }
    this._persist();
    this._bookmarkSubject.next(item);
  }

  public remove(item: any) {
    if (item.country) {
      delete this.bookmarks[item.country];
    } else if (item.state) {
      delete this.bookmarks[item.state];
    }
    this._persist();
    this._bookmarkSubject.next(this.bookmarks);
  }

  async getBookmarks() {
    this.bookmarks = JSON.parse(window.localStorage.getItem(this._key)) || {};
    if (Object.keys(this.bookmarks).length > 0) {
      this._refresh();
    }
  }

  private async _refresh() {
    const countries = await this.covid.countries().toPromise();
    const states = await this.covid.states().toPromise();
    try {
      countries.forEach(c => {
        for (let k in this.bookmarks) {
          if (c.country === k) {
            this.bookmarks[k] = c;
            break;
          }
        }
      });
      states.forEach(s => {
        for (let k in this.bookmarks) {
          if (s.state === k) {
            this.bookmarks[k] = s;
            break;
          }
        }
      });
      this._persist();
    } catch (error) {
      console.log("error refreshing bookmark data: ", error);
    }
  }

  private _persist() {
    window.localStorage.setItem(this._key, JSON.stringify(this.bookmarks));
  }
}
