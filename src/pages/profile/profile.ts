import { Component, Input, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { DISABLED } from '@angular/forms/src/model';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profileForm: FormGroup;
  public user: any;
  public flag: boolean;
  public isUserName: boolean;
  public isEmail: boolean;
  public isContact: boolean;
  public isNationality: boolean;
  public isAddress: boolean;
  public buttonText: string;



  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              ) {
    const data = JSON.parse(localStorage.getItem("user"));
    this.user = data.user;
    // Disbaled all input fields
    this.flag = false;
    this.isUserName = true;
    this.isEmail = true;
    this.isContact = true;
    this.isNationality = true;
    this.isAddress = true;
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
    // this.profileForm = new FormGroup({
    //   username: new FormControl({value:' ', isDisbaled: true}),
    //   email: new FormControl({value:' ', isDisbaled: true}),
    //   Contact: new FormControl({value:' ', isDisbaled: true}),
    //   Nationality: new FormControl({value:' ', isDisbaled: true}),
    //   Address: new FormControl({value:' ', isDisbaled: true}), 
    // })
    
  }

  editProfile(){

    if(this.flag){// Save Button
      // Disbaled all input fields  
      this.flag = false;
      this.isUserName = true;
      this.isEmail = true;
      this.isContact = true;
      this.isNationality = true;
      this.isAddress = true;
      this.buttonText = "Edit";
    }
    else{// Edit Button
      //Enabled all inputs
      // Button text change from edit to save
      this.flag = true;
      this.isUserName = false;
      this.isEmail = false;
      this.isContact = false;
      this.isNationality = false;
      this.isAddress = false;
      this.buttonText = "Save";

    }
  }
}
