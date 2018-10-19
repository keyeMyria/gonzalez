import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public user: any;
  public flag: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    const data = JSON.parse(localStorage.getItem("user"));
    this.user = data.user;
    this.flag = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    // Disbaled all input fields
  }


  editProfile(){

    if(this.flag){// Save Button

    }
    else{// Edit Button
      this.flag = true;
      //Enabled all inputs
      // Button text change from edit to save
    }
  }
}
