import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { VendorAccountPage } from '../vendor-account/vendor-account';
import { VendorBookingsPage } from '../vendor-bookings/vendor-bookings';
import { VendorReviewsPage } from '../vendor-reviews/vendor-reviews';


/**
 * Generated class for the VendorMainPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-main',
  templateUrl: 'vendor-main.html'
})
export class VendorMainPage {

  vendorBookingsRoot = VendorBookingsPage;
  vendorReviewsRoot = VendorReviewsPage;
  vendorAccountRoot = VendorAccountPage;


  constructor(public navCtrl: NavController) {}

}
