import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';
declare var navigator;
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  resetPasswordForm : FormGroup;
  
  constructor(public navCtrl: NavController,
              private fire: AngularFireAuth,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  gotToSignIn() {
    console.log("SignIn box is clicked");
    this.navCtrl.popToRoot();
  }

  resetPassword(){
    if(navigator.onLine){
      let _email = this.resetPasswordForm.value.email;
      let flag = this.isValid(_email);
      console.log("Value: " + _email + " Flag : " + flag);     
      if(flag == ""){
        console.log("Value: " + _email);     
        // Show Progress Dialog
        let loading = this.loadingCtrl.create({
          content: 'Authenticating Your Detail.<br/>Please wait...'
         });  
        loading.present();
        this.fire.auth.sendPasswordResetEmail(_email)
        .then( res => {
          console.log('Email sent', res);
          loading.dismiss();          
          this.showAlert("", "An email with instructions to change Your password has been sent to Your account. Follow the instructions to update Your password");
        })
        .catch( err => {
          loading.dismiss();
          console.log("Error is: " + err);
          let str = JSON.stringify(err);
          console.log("Stringify: " + str);
          let errors = JSON.parse(str);
          console.log("Errors: " + errors["message"]);
          this.showAlert("RESET PASSWORD FAILED", errors.message);
        })
      }
      else{
        this.showAlert("RESET PASSWORD FAILED", flag);
      }
    }
      
  }

  isValid(email:string){
    let error = "";
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email == ""){
      error = error + "*Email is required.<br/>";
    }
    else if(!re.test(email)) {
      error = error + "*Enter a valid Email.<br/>";
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
