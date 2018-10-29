import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VendorProfilePage } from '../vendor-profile/vendor-profile';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

/**
 * Generated class for the VendorAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-account',
  templateUrl: 'vendor-account.html',
})
export class VendorAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAccountPage');
  }
userclick(user:string){
  console.log("userclick : "+ user);
  this.navCtrl.push(VendorProfilePage, {user});
}
passclick(pass:string){
  console.log("Passclick : "+ pass);
  this.navCtrl.push(ForgotPasswordPage, {pass});
}
}
