import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from '@angular/fire/auth';
declare var navigator;

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public user: any;

  constructor(public navCtrl: NavController,
              public fire: AngularFireAuth, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public app: App,
              public navParams: NavParams) {
    const data = JSON.parse(localStorage.getItem("user"));
    console.log("Email: " + data.email + " Name:" + data.name);
    this.user = data;
    console.log("Email: " + this.user.email + " Name:" + this.user.name);
            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  userProfile(){
    console.log("Forget Password box clicked");
    this.navCtrl.push(ProfilePage);
  }

  changePassword(){
    console.log("Change Password box clicked");
    this.navCtrl.push(ChangepasswordPage);
  }

  onLogout(){
    if(navigator.onLine){
      console.log("Clicked");
      let loading = this.loadingCtrl.create({
        content: 'LOGOUT.<br/>Please wait...'
      });
      loading.present();
      // Make Server Call
      this.fire.auth.signOut().then( res => {
        console.log(res);
        localStorage.clear();
        loading.dismiss();
        this.app.getRootNav().setRoot(HomePage);
      })
      .catch( err => {
        console.log(err);
        loading.dismiss();
      }); 
    }
    else{
      this.showAlert("LOGOUT FAILED", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }
  showAlert(subject:string, error:string) {
    let alert = this.alertCtrl.create({
      title: subject,
      subTitle: error,
      buttons: ['OKAY']
    });
    alert.present();
  }
}
