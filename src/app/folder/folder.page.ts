import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { All, Country, CovidService, State } from '../services/covid.service';
import { LoadingController } from '@ionic/angular';
import { BookmarkService } from '../services/bookmark.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public all: All;
  public countries: Country[] = []
  public states: State[] = [];
  public today = new Date();
  public percentRecovered:string;
  public percentDied:string;

  descending: boolean = false;
  order: number;
  column: string = 'country';

  constructor(
    private activatedRoute: ActivatedRoute, 
    private covid:CovidService, 
    private bookmarks:BookmarkService,
    public loadingController: LoadingController ) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    switch (this.folder) {
      case 'World':
        if (!this.all)
          this.getAllData();
        break;
      case 'Countries':
        if(!this.countries || this.countries.length === 0)
          this.getCountriesData();
        this.column = 'country';
        break;
      case 'States':
        if (!this.states || this.states.length === 0)
          this.getStatesData();
        this.column = 'state';
        break;
    }
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  async addBookmark(item:Country|State) {
    console.log('add: ', item);
    this.bookmarks.add(item);
  }

  async getAllData() { 
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();   
    this.all = await this.covid.all().toPromise();
    this.percentRecovered = ((this.all.recovered as any) / (this.all.cases as any)*100).toFixed(2) + '%';
    this.percentDied = ((this.all.deaths as any) / (this.all.cases as any)*100).toFixed(2) + '%';
    loading.dismiss();
  }

  async getCountriesData() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();
    this.countries = await this.covid.countries().toPromise();
    loading.dismiss();
  }

  async getStatesData() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    loading.present();
    this.states = await this.covid.states().toPromise();
    loading.dismiss();
  }

}
