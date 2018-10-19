import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from 'ionic-angular';

declare var navigator;

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  changePasswordForm: FormGroup;
  public user: any;

  constructor(public navCtrl: NavController,
              private fire: AngularFireAuth,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public app: App) {

      const data = JSON.parse(localStorage.getItem("user"));
      this.user = data.user;
      
      console.log(this.user);
      console.log(this.user.email);
      console.log(this.user.Password);

    this.changePasswordForm = new FormGroup({
      Old_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      New_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      Confirm_New_Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
    console.log(JSON.stringify(this.user.changePassword));
    console.log(JSON.stringify(this.user.changePassword));
    console.log(JSON.stringify(this.user.changePasswordForm));

      
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

        this.fire.auth.signInWithEmailAndPassword(this.user.email, _current)
        .then(data => {
          console.log("SignIn: " , this.fire.auth.currentUser);
          console.log("SignIn: " + JSON.stringify(data));

          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(data));

          this.fire.auth.currentUser.updatePassword(_new).then( res=> {
            loading.dismiss();
            this.showAlert("", "Password Updated Successfully");
          }).catch( err => {
            loading.dismiss();
            console.log("Error is: " + err);
            let str = JSON.stringify(err);
            console.log("Stringify: " + str);
            let errors = JSON.parse(str);
            console.log("Errors: " + errors["message"]);
            this.showAlert("", errors.message);
          });
        })
        .catch( err => {
          loading.dismiss();
          console.log("Error is: " + err);
          let str = JSON.stringify(err);
          console.log("Stringify: " + str);
          let errors = JSON.parse(str);
          console.log("Errors: " + errors["message"]);
          this.showAlert("", errors.message);
        })
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
      error = error + "*Password does not match.<br/>";
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