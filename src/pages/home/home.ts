import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SignUpPage } from '../sign-up/sign-up';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainPage } from '../main/main';
import { AngularFireDatabase } from 'angularfire2/database';
import { EmpregistrationPage } from '../empregistration/empregistration';

declare var navigator;  
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  signInForm: FormGroup;

  userData = {
    email: "",
    name: "",
    image: "",
    contact: "",
    nationality: "",
    address: "",
    id: ""
  }

  constructor(public fire: AngularFireAuth, 
              public statusBar: StatusBar,
              public alertCtrl: AlertController,
              private db: AngularFireDatabase, 
              public loadingCtrl: LoadingController,
              public navCtrl: NavController) {
     
      this.signInForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      })           

      if(localStorage.getItem("user")){
        this.navCtrl.setRoot(MainPage);
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.statusBar.backgroundColorByHexString("#6b9423");
  }

  loginWithFacebook(){
    if(navigator.onLine){
      // For real Device
      this.fire.auth.signInWithRedirect(new auth.FacebookAuthProvider()).
      then(()=> {
          this.fire.auth.getRedirectResult().then( data=>{
            // Show Progress Dialog
            let loading = this.loadingCtrl.create({
              content: 'Authenticating Your Detail.<br/>Please wait...'
              });
            loading.present();
            console.log(data);
            // Facebook Login Success
            let id = data.user.email;
            id = id.replace("@", "-");
            id = id.replace(/\./g, "_");
            console.log("ID: " + id);
            this.userData.id = id;
            this.db.object(`Users/${this.userData.id}`).valueChanges().subscribe(res => {
              if(res == null){
                  this.userData.email = data.user.email;
                  this.userData.name = this.toUpper(data.user.displayName);
                  this.userData.image = data.user.photoURL;
                  this.db.object(`Users/${this.userData.id}`).set(this.userData)
                  .then( res => {
                    if(loading.present())
                      loading.dismiss();
                    localStorage.clear();
                    localStorage.setItem("user", JSON.stringify(this.userData));
                    this.navCtrl.setRoot(MainPage);
                  }).catch( err=>{
                    if(loading.present())
                      loading.dismiss();          
                    console.log("Error is: " + err);
                    let str = JSON.stringify(err);
                    console.log("Stringify: " + str);
                    let errors = JSON.parse(str);
                    console.log("Errors: " + errors["message"]);
                    this.showAlert("SIGNIN-FAILED", errors.message);
                  });
              }
              else{
                console.log("User:" + JSON.stringify(res));
                let userData1 = res;
                localStorage.clear();
                localStorage.setItem("user", JSON.stringify(userData1));
                loading.dismiss();
                this.navCtrl.setRoot(MainPage);
              }
            });
          }).catch(err=>{
            console.log("Error is: " + err);
            let str = JSON.stringify(err);
            console.log("Stringify: " + str);
            let errors = JSON.parse(str);
            console.log("Errors: " + errors["message"]);
            this.showAlert("SIGNIN-FAILED", errors.message);
          });
      }).catch( err=> {
        // Facebook Login Failed
        console.log("Error is: " + err);
        let str = JSON.stringify(err);
        console.log("Stringify: " + str);
        let errors = JSON.parse(str);
        console.log("Errors: " + errors["message"]);
        this.showAlert("SIGNIN-FAILED", errors.message);        
      })      
      // This work only on Browers
      // this.fire.auth.signInWithPopup(new auth.FacebookAuthProvider())
      // .then(data => {

      //   // Show Progress Dialog
      //   let loading = this.loadingCtrl.create({
      //     content: 'Authenticating Your Detail.<br/>Please wait...'
      //     });
      //   loading.present();
      //   console.log(data);
      //   // Facebook Login Success
      //   let id = data.user.email;
      //   id = id.replace("@", "-");
      //   id = id.replace(/\./g, "_");
      //   console.log("ID: " + id);

      //   this.db.object(`Users/${id}`).valueChanges().subscribe(res => {
      //     if(res == null){
      //         this.userData.email = data.user.email;
      //         this.userData.name = this.toUpper(data.user.displayName);
      //         this.userData.image = data.user.photoURL;
      //         this.db.object(`Users/${id}`).set(this.userData)
      //         .then( res => {
      //           if(loading.present())
      //             loading.dismiss();
      //           localStorage.clear();
      //           localStorage.setItem("user", JSON.stringify(this.userData));
      //           this.navCtrl.setRoot(MainPage);
      //         }).catch( err=>{
      //           if(loading.present())
      //             loading.dismiss();          
      //           console.log("Error is: " + err);
      //           let str = JSON.stringify(err);
      //           console.log("Stringify: " + str);
      //           let errors = JSON.parse(str);
      //           console.log("Errors: " + errors["message"]);
      //           this.showAlert("SIGNIN-FAILED", errors.message);
      //         });
      //     }
      //     else{
      //       console.log("User:" + JSON.stringify(res));
      //       let userData1 = res;
      //       localStorage.clear();
      //       localStorage.setItem("user", JSON.stringify(userData1));
      //       loading.dismiss();
      //       this.navCtrl.setRoot(MainPage);
      //     }
      //   });


      // }).catch( err => {
      //   // Facebook Login Failed
      //   console.log("Error is: " + err);
      //   let str = JSON.stringify(err);
      //   console.log("Stringify: " + str);
      //   let errors = JSON.parse(str);
      //   console.log("Errors: " + errors["message"]);
      //   this.showAlert("SIGNIN-FAILED", errors.message);
      // })
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
        console.log("Value: " + JSON.stringify(this.signInForm.value));     
        // Show Progress Dialog
        let loading = this.loadingCtrl.create({
          content: 'Authenticating Your Detail.<br/>Please wait...'
         });
        loading.present();

        this.fire.auth.signInWithEmailAndPassword(_email, _password)
        .then(data => {
          console.log(data);

          let id = data.user.email;
          id = id.replace("@", "-");
          id = id.replace(/\./g, "_");
          console.log("ID: " + id);
          this.userData.id  = id;

          this.db.object(`Users/${this.userData.id}`).valueChanges().subscribe(res => {
            if(res == null){
                this.userData.email = data.user.email;
                this.userData.name = data.user.displayName;
                this.userData.image = data.user.photoURL;
                this.db.object(`Users/${this.userData.id}`).set(this.userData).then( res=> {
                  loading.dismiss();
                  localStorage.clear();
                  localStorage.setItem("user", JSON.stringify(this.userData));
                  this.navCtrl.setRoot(MainPage);
                }).catch( err=>{
                  loading.dismiss();          
                  console.log("Error is: " + err);
                  let str = JSON.stringify(err);
                  console.log("Stringify: " + str);
                  let errors = JSON.parse(str);
                  console.log("Errors: " + errors["message"]);
                  this.showAlert("SIGNIN-FAILED", errors.message);
                });
            }
            else{
              console.log("User:" + JSON.stringify(res));
              let userData1 = res;
              localStorage.clear();
              localStorage.setItem("user", JSON.stringify(userData1));
              loading.dismiss();
              this.navCtrl.setRoot(MainPage);
            }
          });

        })
        .catch( err => {
          loading.dismiss();          
          console.log("Error is: " + err);
          let str = JSON.stringify(err);
          console.log("Stringify: " + str);
          let errors = JSON.parse(str);
          console.log("Errors: " + errors["message"]);
          this.showAlert("SIGNIN-FAILED", errors.message);
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
  toUpper(str:string){
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' ');
  }

  gotToSignUpEmployer(){
    console.log("Signup box is clicked");
    this.navCtrl.push(EmpregistrationPage); 
  }

}
