import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { VendersPage } from '../venders/venders';


@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  babySister(){
   console.log("venders page loaded");
   this.navCtrl.push(VendersPage);
  }

  cleaningServices(){
    let loading = this.loadingCtrl.create({
      content: 'User Request.<br/>Please wait...'
     });
    loading.present();
    loading.dismiss();  
    this.showAlert("Cleaning Services page");
  }

  gardeningServices(){
    let loading = this.loadingCtrl.create({
      content: 'User Request.<br/>Please wait...'
     });
    loading.present();
    loading.dismiss();  
    this.showAlert("Gardening Services page");
  }

  doctorServices(){
    let loading = this.loadingCtrl.create({
      content: 'User Request.<br/>Please wait...'
     });
    loading.present();
    loading.dismiss();  
    this.showAlert("Doctor & Nurse Services page");
  }

  blumberServices(){
    let loading = this.loadingCtrl.create({
      content: 'User Request.<br/>Please wait...'
     });
    loading.present();
    loading.dismiss();  
    this.showAlert("Blumber Services page");
  }

  laundryServices(){
    let loading = this.loadingCtrl.create({
      content: 'User Request.<br/>Please wait...'
     });
    loading.present();
    loading.dismiss();  
    this.showAlert("Laundry Services page");
  }

  showAlert(subject:string) {
    let alert = this.alertCtrl.create({
      title: subject,
      // subTitle: error,
      buttons: ['OKAY']
    });
    alert.present();
  }
}
