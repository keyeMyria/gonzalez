import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SignUpPage } from '../sign-up/sign-up';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { from } from 'rxjs/observable/from';
import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainPage } from '../main/main';


declare var navigator;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  signInForm: FormGroup;

  constructor(public fire: AngularFireAuth, 
              public statusBar: StatusBar,
              public alertCtrl: AlertController,
              private network: Network,
              public loadingCtrl: LoadingController,
              public navCtrl: NavController) {
     
      this.signInForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      })           

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.statusBar.backgroundColorByHexString("#95CF31");
    if(localStorage.getItem("user")){
      this.navCtrl.setRoot(MainPage);
    }
  }

  loginWithFacebook(){
    if(navigator.onLine){
      this.fire.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(res => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res));
        this.navCtrl.setRoot(MainPage);
      }).catch( res => {
        console.log("Error: " + res);
      })
    }
    else{
      this.showAlert("SIGNIN-FAILED!", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }

  signIn(){
    if(navigator.onLine){
      let _email = this.signInForm.value.email;
      let _password = this.signInForm.value.password;
      let flag = this.isValid(_email, _password);
      if(flag == ""){
        console.log("Value: " + this.signInForm.value);     
        // Show Progress Dialog
        let loading = this.loadingCtrl.create({
          content: 'Authenticating Your Detail.<br/>Please wait...'
         });
        loading.present();

        this.fire.auth.signInWithEmailAndPassword(_email, _password)
        .then(data => {
          console.log("SignIn: " , this.fire.auth.currentUser);
          console.log("SignIn: " + JSON.stringify(data));
          loading.dismiss();          
          localStorage.setItem("user", JSON.stringify(data));
          this.navCtrl.setRoot(MainPage);
        })
        .catch( err => {
          loading.dismiss();          
          this.showAlert("SIGNIN-FAILED", err);
        })

       }
       else{
         this.showAlert("SIGNIN-FAILED", flag);
       }
    }
    else{
      this.showAlert("SIGNUP-FAILED!", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }
  

  
  isValid(email:string, password:string){
    let error = "";
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email == ""){
      error = error + "*Email is required.<br/>";
    }
    else if(!re.test(email)) {
      error = error + "*Enter a valid Email.<br/>";
    }
    if(password == ""){
      error = error + "*Password is required.<br/>";
    }
    else if(password.length < 6){
      error = error + "*Password must be greater than 6 alphanumeric characters.<br/>";
    }
    return error;
  }

  gotToPassword(){
    console.log("Forget Password box clicked");
    this.navCtrl.push(ForgotPasswordPage);
  }

  gotToSignUp(){
    console.log("Signup box is clicked");
    this.navCtrl.push(SignUpPage);
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
