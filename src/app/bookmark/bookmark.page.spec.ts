import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookmarkPage } from './bookmark.page';

describe('BookmarkPage', () => {
  let component: BookmarkPage;
  let fixture: ComponentFixture<BookmarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
