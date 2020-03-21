import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { State, Country } from './covid.service';

export interface Bookmark {
  item: Country|State
};

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  public bookmarks = {};
  private _bookmarkSubject = new Subject<any>();
  public bookmarkSub = this._bookmarkSubject.asObservable();

  private _key = "bookmarks";

  constructor() {
    this.bookmarks = this.getBookmarks();
  }
  
  public add(item:any) {
    if (item.country) {
      this.bookmarks[item.country] = item;
    } else if (item.state) {
      this.bookmarks[item.state] = item;
    }
    this._persist();
    this._bookmarkSubject.next(item);
  }

  public remove(item:any) {
    if (item.country) {
      delete this.bookmarks[item.country]
    } else if (item.state) {
      delete this.bookmarks[item.state]
    }
    this._persist();
    this._bookmarkSubject.next(this.bookmarks);
  }

  getBookmarks():any {
    return JSON.parse(window.localStorage.getItem(this._key)) || {};
  }

  private _persist() {
    window.localStorage.setItem(this._key,JSON.stringify(this.bookmarks));
  }
}
