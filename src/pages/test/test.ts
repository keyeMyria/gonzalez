import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  data = {
    name: "",
    rating: 0,
    created_at: ""
  }



  constructor(public navCtrl: NavController,
              private db: AngularFireDatabase,
               public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');

    this.data.name = "sehrish";
    this.data.rating = 3.9;
    // this.data.created_at = firebase.database.ServerValue.TIMESTAMP;

    this.db.list("/Reviews/a1-gmail_com").push({
      name: this.data.name,
      rating: this.data.rating,
      created_at: firebase.database.ServerValue.TIMESTAMP
    }).then( res=>{
      console.log("Success");
    });
    // this.db.object(`/Vendors/a1-gmail_com/reviews/${firebase.database.ServerValue.TIMESTAMP}`).set({
    //   name: this.data.name,
    //   rating: this.data.rating,
    //   created_at: firebase.database.ServerValue.TIMESTAMP
    // }).then( res=>{
    //   console.log("Success");
    // }).catch(err=>{
    //   console.log("Fail");
    // });
  }

}
