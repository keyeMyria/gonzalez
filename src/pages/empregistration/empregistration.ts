import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SignUpPage } from '../sign-up/sign-up';
import { VendorMainPage } from '../vendor-main/vendor-main';
declare var navigator;  
@IonicPage()
@Component({
  selector: 'page-empregistration',
  templateUrl: 'empregistration.html',
})
export class EmpregistrationPage {
  registrationform: FormGroup;
  empData={
    id: "",
    image: "",
    name:"",
    email:"",
    address:"",
    gender:"",
    age:"",
    language:"",
    nationality:"",
    maritalstatus:"",
    category: "",
    numberOfReviews: 0,
    rating: 0.0
  }

  constructor(private fire: AngularFireAuth,
    private db: AngularFireDatabase, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public detector: ChangeDetectorRef,
    public loadingCtrl: LoadingController) {
    this.registrationform = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")] ),
      password: new FormControl('', [Validators.required, Validators.minLength(7)]),
      address: new FormControl('', Validators.required),
      gender : new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      language : new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      maritalstatus : new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmpregistrationPage');
  }
  Submit(){
    if (navigator.onLine){
      let _name= this.registrationform.value.name;
      _name = this.toUpper(_name);
      let _email = this.registrationform.value.email;
      let _password = this.registrationform.value.password;
      let _address= this.registrationform.value.address;
      _address = this.toUpper(_address)
      let _gender = this.registrationform.value.gender;
      let _age = this.registrationform.value.age;
      let _language= this.registrationform.value.language;
      _language = this.toUpper(_language);
      let _nationality = this.registrationform.value.nationality;
      _nationality = this.toUpper(_nationality);
      let _maritalstatus = this.registrationform.value.maritalstatus;
      let _category = this.registrationform.value.category;
      console.log("Name: " + _name);
      console.log("Email: " + _email);
      console.log("Password: " + _password);
      console.log("Address: " + _address);
      console.log("Gender: " + _gender);
      console.log("Language: " + _language);
      console.log("Age: " + _age);
      console.log("Nationality: " + _nationality);
      console.log("Martial Status: " + _maritalstatus);
      console.log("Category: " + _category);
      let flag = this.isValid(_name,_email,_password,_address,_gender,_age,_language,_nationality,_maritalstatus, _category);
      if(flag == ""){ 
        console.log("Value: " + this.registrationform.value);     
        let loading = this.loadingCtrl.create({
          content: 'Registering Employee.<br/>Please wait...'
        });
        loading.present();
        this.fire.auth.createUserWithEmailAndPassword(_email,_password).then(r=>{
          console.log("Success: " + JSON.stringify(r));
            if(r != null && r.user != null){
              this.empData.name = _name;
              this.empData.email = _email;
              this.empData.address = _address;
              this.empData.nationality = _nationality;
              this.empData.language = _language;
              this.empData.age = _age;
              this.empData.maritalstatus = _maritalstatus;
              this.empData.gender = _gender;
              this.empData.category = _category;
              r.user.updateProfile({displayName:_name , photoURL:"" }).then(r1 => {

                let id = this.empData.email;
                id= id.replace("@" , "-");
                id = id.replace(/\./g,"_");
                console.log("ID:" + id);
                this.empData.id = id;
                this. db.object(`Vendors/${this.empData.id}`). set(this.empData).then(r =>{
                  loading.dismiss();
                  localStorage.clear();
                  localStorage.setItem("vendor", JSON.stringify(this.empData));
                  this.navCtrl.setRoot(VendorMainPage);
                }).catch(error1 =>{
                  loading.dismiss();
                  console.log("ERROR IS: " + error1);
                  let st = JSON. stringify(error1);
                  console.log("Stringify: " + st);
                  let errors = JSON.parse(st);
                  console.log("Errors: " + errors["message"]);
                  this.showAlert("Registration Failed: " , errors.message);
                });
             
            }).catch(error2 =>{
              loading.dismiss();
              console.log("Error is : " + error2);
              let st = JSON.stringify(error2);
              console.log("Stringify: " + st);
              let errors = JSON.parse(st);
              console.log("Errors: " +errors["message"]);
              this.showAlert("Registration Failed: " , errors.message);
            });
          }
          else{
            loading.dismiss();
            console.log("Failed: " +JSON.stringify(r));
            this.showAlert("Registration-FAILED!","Something went wrong.\nPlease try Again Later.");

          }
        }).catch(error1 =>{
          loading.dismiss();          
          console.log("Error is: " + error1);
          let str = JSON.stringify(error1);
          console.log("Stringify: " + str);
          let errors = JSON.parse(str);
          console.log("Errors: " + errors["message"]);
          this.showAlert("Registration-Failed", errors.message)
        });
      }
      else{
        this.showAlert("Registration Failed", flag);
      }
    }
    else{
      this.showAlert("Registration Failed!", "No Internet Connection Found.<br/>Connect to a network and try again.");
    }
  }
  isValid(name:string,email:string,password:string,address:string,gender:string,age:string,language:string,nationality:string,maritalstatus:string, category:string)
  {
    let error="";
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
    
    if(address == ""){
      error = error + "*Address is required.<br/>";
    }
    if(gender == null || gender == undefined || gender == ""){
      error = error + "*Gender is required.<br/>";
    }
    if(age == null || age == undefined || age == ""){
      error = error + "*Age is required.<br/>";
    }
    if(language == ""){
      error = error + "*Language is required.<br/>";
    }
    if(nationality == ""){
      error = error + "*Nationality is required.<br/>";
    }
    if(maritalstatus == null || maritalstatus == undefined || maritalstatus == ""){
      error = error + "*Marital-Status is required.<br/>";
    }
    if(category == null || category == undefined || category == ""){
      error = error + "*Employee Category is required.<br/>";
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

    gotToSignIn() {
      console.log("SignIn box is clicked");
      this.navCtrl.popToRoot();
    }

    gotToSignUpUser(){
      console.log("Signup box is clicked");
      this.navCtrl.popToRoot();
      this.navCtrl.push(SignUpPage); 
    }
    toUpper(str:string){
      var splitStr = str.toLowerCase().split(' ');
      for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
      }
      return splitStr.join(' ');
    }
  }
  