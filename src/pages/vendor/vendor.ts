import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReviewsPage } from '../reviews/reviews';
import { DummyPage } from '../dummy/dummy';


@IonicPage()
@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html',
})
export class VendorPage {
  item: any;
  public isEnabled: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl:ModalController) {
    let it = navParams.get('vendor');
    console.log("Vendor Page: " + JSON.stringify(it));
    this.item = JSON.parse(JSON.stringify(it));
    this.isEnabled = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorPage');
  }
  
  goToReviews(item: any){
    console.log(JSON.stringify(item));
    this.navCtrl.push(ReviewsPage, {vendor: item});
  }

  // onItemClick(item: any){
  //   console.log(JSON.stringify(item));
  //   this.navCtrl.push(ReviewsPage, {review: item});
  // }
  hireMe(hire: string){
    console.log("Hire me:" + hire);
     //this.navCtrl.push(DummyPage,{dummy:hire});
     let model=this.modalCtrl.create(DummyPage);
     model.present();
  }
 
}
