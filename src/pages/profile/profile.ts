import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              ) {
    const data = JSON.parse(localStorage.getItem("user"));
    console.log(data.email);
    this.user = data;
    // Disbaled all input fields
    this.flag = false;
    this.isEnabled = true;
    this.profileForm = new FormGroup({
      username: new FormControl({value:true}),
      email: new FormControl({value:true}),
      Contact: new FormControl({value:true}),
      Nationality: new FormControl({value:true}),
      Address: new FormControl({value:true}), 
    })
    this.buttonText = "Edit";
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
  }

  editProfile(){

    if(this.flag){// Save Button
      // Disbaled all input fields  
      this.flag = false;
      this.isEnabled = true;
      this.buttonText = "Edit";
    }
    else{// Edit Button
      //Enabled all inputs
      // Button text change from edit to save
      this.flag = true;
      this.isEnabled = false;
      this.buttonText = "Save";
    }
  }
}
