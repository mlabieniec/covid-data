import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BookmarkService } from './services/bookmark.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public objectKeys = Object.keys;
  public appPages = [
    {
      title: 'World',
      url: '/folder/World',
      icon: 'earth'
    },
    {
      title: 'Countries',
      url: '/folder/Countries',
      icon: 'flag'
    },
    {
      title: 'States',
      url: '/folder/States',
      icon: 'navigate'
    },
    {
      title: 'Historical',
      url: '/folder/Historical',
      icon: 'archive'
    }
  ];
  public bookmarks = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private bookmarkService: BookmarkService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initBookmarks();
    });
  }

  initBookmarks() {
    this.bookmarks = this.bookmarkService.bookmarks;
    this.bookmarkService.bookmarkSub.subscribe(
      (item:any) => {
        this.bookmarks = this.bookmarkService.bookmarks;
      }
    )
  }

  removeBookmark(item) {
    console.log('remove: ', item);
    this.bookmarkService.remove(item);
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

}
