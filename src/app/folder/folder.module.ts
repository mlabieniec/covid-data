import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts";
import { IonicModule } from "@ionic/angular";

import { FolderPageRoutingModule } from "./folder-routing.module";

import { FolderPage } from "./folder.page";
import { HttpClientModule } from "@angular/common/http";
import { SearchPipe } from "../pipes/search.pipe";
import { SortPipe } from "../pipes/sort.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    HttpClientModule,
    ChartsModule
  ],
  declarations: [FolderPage, SearchPipe, SortPipe]
})
export class FolderPageModule {}
