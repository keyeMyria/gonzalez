import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import firebase from 'firebase';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var navigator;

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  changePasswordForm: FormGroup;
  user: any;

  constructor(public navCtrl: NavController,
              private fire: AngularFireAuth,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public app: App) {

    this.changePasswordForm = new FormGroup({
      Old_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      New_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Confirm_New_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  changePassword(){
    if(navigator.onLine){
      console.log('Password Form Submitted' + JSON.stringify(this.changePasswordForm.value));
      let _current = this.changePasswordForm.value.Old_Password;
      let _new = this.changePasswordForm.value.New_Password;
      let _confirm = this.changePasswordForm.value.Confirm_New_Password;

      let flag = this.isValid(_current, _new, _confirm);
      if(flag == ""){
        let loading = this.loadingCtrl.create({
          content: 'UPDATING PASSWORD.<br/>Please wait...'
        });
        loading.present();

        // const user = this.fire.auth.currentUser;
        // const credentials = firebase.auth.EmailAuthProvider.credential(user.email, 'Confirm_New_Password')
        // user.reauthenticateWithCredential(credentials)
        // .then(() => console.log('reauth ok'));

        loading.dismiss();
        
      }
      else{
        this.showAlert("PASSWORD-CHANGE-FAILED!",flag);
      }
    }
    else{
      this.showAlert("PASSWORD-CHANGE-FAILED!", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }

  isValid(current:string, new_p:string, confirm:string){
    let error = "";
    if(current == ""){
      error = error + "*Current Password is required.<br/>";
    }
    else if(current.length < 6){
      error = error + "*Current Password must be greater than 5 alphanumeric characters.<br/>";
    }
    if(new_p == ""){
      error = error + "*New Password is required.<br/>";
    }
    else if(new_p.length < 6){
      error = error + "*New Password must be greater than 5 alphanumeric characters.<br/>";
    }
    if(confirm == ""){
      error = error + "*Confirm Password is required.<br/>";
    }
    else if(confirm.length < 6){
      error = error + "*Confirm Password must be greater than 5 alphanumeric characters.<br/>";
    }
    if(new_p != "" && confirm != "" && new_p == confirm)    {

    }
    else{
      error = error + "*New Password does not match.<br/>";
    }
    return error;
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


    