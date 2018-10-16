import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SignUpPage } from '../sign-up/sign-up';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { from } from 'rxjs/observable/from';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public afAuth: AngularFireAuth, 
              public statusBar: StatusBar,
              public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.statusBar.backgroundColorByHexString("#95CF31");
  }

  loginWithFacebook(){
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
    .then(res => {
      console.log(res);
    }).catch( res => {
      console.log("Error: " + res);
    })

  }

  gotToPassword(){
    console.log("Forget Password box clicked");
    this.navCtrl.push(ForgotPasswordPage);
  }

  gotToSignUp(){
    console.log("Signup box is clicked");
    this.navCtrl.push(SignUpPage);
  }

}
