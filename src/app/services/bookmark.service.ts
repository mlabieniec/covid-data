import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  public bookmarks = [];
  
  constructor() { }
}
