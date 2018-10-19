import { Component, ChangeDetectorRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { MainPage } from '../main/main';

declare var navigator;
@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  signupForm: FormGroup;
  userData = {
    email: "",
    name: "",
    image: ""
  }

  constructor(private fire: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public detector: ChangeDetectorRef,
              public loadingCtrl: LoadingController) {
    this.signupForm = new FormGroup({
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  gotToSignIn() {
    console.log("SignIn box is clicked");
    this.navCtrl.popToRoot();
  }

  submit(){
    if(navigator.onLine){
      // Validating User Side Data
      let _name = this.signupForm.value.fullname;
      let _email = this.signupForm.value.email;
      let _pass = this.signupForm.value.password;
      let flag = this.isValid(_name, _email, _pass);
      if(flag == ""){ // If data is Valid
        console.log("Value: " + this.signupForm.value);     
        // Show Progress Dialog
        let loading = this.loadingCtrl.create({
          content: 'Registering User.<br/>Please wait...'
        });

        loading.present();
        // Make Server Call
        this.fire.auth.createUserWithEmailAndPassword(_email, _pass)
        .then( res => {
          console.log("Success: " + JSON.stringify(res));
          if(res != null && res.user != null){
            res.user.updateProfile({displayName: _name, photoURL: ""})
            .then( res1 => {
              this.userData.email = res.user.email;
              this.userData.name = res.user.displayName;
              this.userData.image = res.user.photoURL;
              console.log(this.userData.email);
              // For Raheem
              // Start from Here and try to save the object userData (in line # 61) in Firebase RealTime Database
              // After saving data, dismiss the loading and save User to localstorage (means sessions) and go to the main page
              // After doing this, go to Home page, create a similar "userData" variable in that class with attributes image, name and email. 
              // And in Facebook login, try to save the User data in Firebase Realtime database, like You do here.
              loading.dismiss();
              localStorage.setItem("user", JSON.stringify(res));
              this.navCtrl.setRoot(MainPage);
            }).catch( err1 => {
              loading.dismiss();          
              console.log("Error is: " + err1);
              let str = JSON.stringify(err1);
              console.log("Stringify: " + str);
              let errors = JSON.parse(str);
              console.log("Errors: " + errors["message"]);
              this.showAlert("SIGNIN-FAILED", errors.message);
            });
          }
          else{
            loading.dismiss();
            console.log("Failed: " + JSON.stringify(res));
            this.showAlert("SIGNUP-FAILED!","Something went wrong.\nPlease try Again Later.");
          }
        }).catch( err => {
          loading.dismiss();          
          console.log("Error is: " + err);
          let str = JSON.stringify(err);
          console.log("Stringify: " + str);
          let errors = JSON.parse(str);
          console.log("Errors: " + errors["message"]);
          this.showAlert("SIGNIN-FAILED", errors.message);
        });   
      }
      else{ // If data is not Valid
        this.showAlert("SIGNUP-FAILED!",flag);
      }
    }
    else{
      this.showAlert("SIGNUP-FAILED!", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }    

  isValid(name:string, email:string, password:string){
    let error = "";
    if(name == ""){
      error = error + "*Name is required.<br/>";
    }
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
  showAlert(subject:string, error:string) {
    let alert = this.alertCtrl.create({
      title: subject,
      subTitle: error,
      buttons: ['OKAY']
    });
    alert.present();
  }
}