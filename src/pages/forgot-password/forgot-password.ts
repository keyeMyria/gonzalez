import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';


/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var navigator;

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  resetPasswordForm : FormGroup;
  // email: AbstractControl;
  
  constructor(public navCtrl: NavController,
              private fire: AngularFireAuth,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
    })
    // this.email = this.resetPasswordForm.controls['email'];
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
          this.showAlert("RESET PASSWORD Success", JSON.stringify(res));
        })
        .catch( err => {
          loading.dismiss();
        this.showAlert("RESET PASSWORD FAILED", err);
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
