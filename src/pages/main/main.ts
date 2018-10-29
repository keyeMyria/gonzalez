import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CategoriesPage } from '../categories/categories';
import { BookingHistoryPage } from '../booking-history/booking-history';
import { MyFavoritesPage } from '../my-favorites/my-favorites';
import { AccountPage } from '../account/account';
@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  categoriesRoot = CategoriesPage;
  bookingHistoryRoot = BookingHistoryPage;
  myFavoritesRoot = MyFavoritesPage;
  accountRoot = AccountPage;


  constructor(public navCtrl: NavController) {}

}
