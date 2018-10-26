import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';

declare var navigator;  
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profileForm: FormGroup;
  public flag: boolean;
  public isEnabled: boolean;
  public buttonText: string;
  public user: any;
  userData = {
    email: "",
    name: "",
    image: "",
    contact: "",
    nationality: "",
    address: "",
    id: ""
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private fire: AngularFireAuth,
              private db: AngularFireDatabase, 
              public loadingCtrl: LoadingController) {
    const data = JSON.parse(localStorage.getItem("user"));
    console.log(data.email);
    this.user = data;
    // Disbaled all input fields
    this.flag = false;
    this.isEnabled = true;
    this.profileForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
      username: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required]),
      nationality: new FormControl('', []),
      address: new FormControl('', []),
    })
    this.buttonText = "Edit";
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  editProfile(){

    if(this.flag){// Save Button clicked
      // Disbaled all input fields
      if(navigator.onLine){
        this.userData.email  = this.profileForm.value.email;
        this.userData.name = this.profileForm.value.username;
        this.userData.contact = this.profileForm.value.contact;
        this.userData.nationality = this.profileForm.value.nationality;
        this.userData.address = this.profileForm.value.address;
        this.userData.id = this.user.id;
        this.userData.image = this.user.image;

        this.userData.name = this.toUpper(this.userData.name);
        this.userData.nationality = this.toUpper(this.userData.nationality);
        this.userData.address = this.toUpper(this.userData.address);

        console.log("Email: " + this.userData.email);
        console.log("Username: " + this.userData.name);
        console.log("Contact: " + this.userData.contact);
        console.log("Nationality: " + this.userData.nationality);
        console.log("Address: " + this.userData.address);
        console.log("ID: " + this.userData.id);
        let flag = this.isValid(this.userData.email, this.userData.name, this.userData.contact);
        if(flag == ""){
          // Update User here
          // Show Progress Dialog
          let loading = this.loadingCtrl.create({
            content: 'Updating Profile.<br/>Please wait...'
          });

          loading.present();
          console.log("Ready to update");
          this.fire.auth.currentUser.updateProfile({displayName: this.userData.name, photoURL: this.userData.image}).then( res=> {
            console.log("Profile Updated");
            // this.db.object(`Users/${this.userData.id}`).update()
            this.db.object(`Users/${this.userData.id}`).update(this.userData).then( datRes=>{
              loading.dismiss();
              this.user = this.userData;
              localStorage.removeItem("user");
              localStorage.setItem("user", JSON.stringify(this.user));
              console.log("Profile Updated in Database");
              this.flag = false;
              this.isEnabled = true;
              this.buttonText = "Edit";
            }).catch(dataErr=>{
              loading.dismiss();
              console.log("Profile Updation Error occur in database: " + dataErr);
              this.showAlert("Ops!!!", "Something Went wrong.\nPlease Try Again Later");
            })
          }).catch( err=>{
            loading.dismiss();
            console.log("Profile Updation Error occur: " + err);
            this.showAlert("Ops!!!", "Something Went wrong.\nPlease Try Again Later");
          })
        }
        else{
          this.showAlert("Ops!!!", flag);
        }
      }
      else{
        this.flag = false;
        this.isEnabled = true;
        this.buttonText = "Edit";
        this.showAlert("Ops!!!", "No Internet Connection Found.<br/>Connect to a network and try again.");
      }
    }
    else{// Edit Button
      //Enabled all inputs
      // Button text change from edit to save
      this.flag = true;
      this.isEnabled = false;
      this.buttonText = "Save";
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

  isValid(email:string, name:string, contact:string){
    let error = "";
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email == ""){
      error = error + "*Email is required.<br/>";
    }
    else if(!re.test(email)) {
      error = error + "*Enter a valid Email.<br/>";
    }
    if(name == ""){
      error = error + "*Name is required.<br/>";
    }
    if(contact == ""){
      error = error + "*Contact Number is required.<br/>";
    }
    return error;
  }

  toUpper(str:string){
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' ');
  }

}
