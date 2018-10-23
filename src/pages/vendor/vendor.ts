import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html',
})
export class VendorPage {
  item: any;
  public isEnabled: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    let it = navParams.get('vendor');
    console.log("Vendor Page: " + JSON.stringify(it));
    this.item = JSON.parse(JSON.stringify(it));
    this.isEnabled = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorPage');
  }
  

}
