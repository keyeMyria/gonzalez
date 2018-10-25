import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import firebase from 'firebase';
// import { DatePipe } from '@angular/common'
// import { Moment } from 'moment';
import moment from 'moment';
/**
 * Generated class for the ReviewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reviews',
  templateUrl: 'reviews.html',
})
export class ReviewsPage {

  hideMe:boolean=true;
  items: Observable<any[]>
  // public user: any;
  my_item: any;
  reviews: any = [];
  vendor: any;


  constructor(public navCtrl: NavController,
              public ref: ChangeDetectorRef,
              // public datepipe: DatePipe,
              // public moment: Moment,
              public fire: AngularFireAuth,  
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private db: AngularFireDatabase, 
              public navParams: NavParams) {
    this.vendor = JSON.parse(JSON.stringify(navParams.get("vendor")));
  }

  ionViewDidLoad() {

     if(navigator.onLine){
       this.loadMore();
       this.hideMe = false;
     }
     else{
      this.hideMe = false;
       this.showAlert("", "No Internet Connection Found.\nConnect to a network and try again.")
     }

  }

  loadMore(){
    this.hideMe = true;
    this.my_item = [];
    this.items = this.db.list(`/Reviews/${this.vendor.id}`,  r => r.orderByChild('created_at')).valueChanges();    
    this.items.subscribe( (data) => {
      console.log("Data " + JSON.stringify(data));
      this.my_item = JSON.parse(JSON.stringify(data));
      this.my_item = this.my_item.reverse();
      for(let i of this.my_item){
        let time = moment(i.created_at).format('MMM DD, YYYY HH:MM');
        console.log("TimeStamp: " + JSON.stringify(i.created_at) + " Time is: " + JSON.stringify(time));
        let r = {
          name: "",
          rating: 0,
          time: ""
        }
        r.name = i.name;
        r.rating = i.rating;
        r.time = time;
        this.reviews.push(r);
        
        // var dateString = moment().format("MM/DD/YYYY");
        // var time = moment().format('HHmmss');
        // console.log("Date: " + dateString);
        // console.log("Time: " + time);
        // console.log(this.moment.toISOString(i.created_at));
        // let d1 = this.moment.unix();
        // let d = this.moment.unix(i.created_at).format("MM/DD/YYYY");
      }
      this.hideMe = false;
      this.ref.detectChanges();
      // let count = this.reviews.length;
      // console.log("Favorite Size: " + this.reviews.length);
      // if(count < 5 ){
      //   this.upper = this.lower - 0.001; 
      //   this.lower -= 0.3;
      //   this.loadMore();
      // }
    }, (err) => {
      this.hideMe = false;
      this.ref.detectChanges();
      console.log("Data: " + JSON.stringify("Error Reading " + err));
    }) 
  }

  loadMoreData(infiniteScroll, load_count: number){
    console.log("Load Count: " + load_count);
    if(load_count == 0){
      infiniteScroll.complete();
      return;
    }
    this.my_item = [];
    // this.upper = this.lower - 0.001; 
    // this.lower -= 0.3;
    this.items = this.db.list(`/Vendors/${this.vendor.id}/reviews`).valueChanges();    
    this.items.subscribe( (data) => {
      console.log("Data " + JSON.stringify(data));
      this.my_item = JSON.parse(JSON.stringify(data));
      this.my_item = this.my_item.reverse();
      for(let i of this.my_item){
        this.reviews.push(i);
      }
      infiniteScroll.complete();
      this.ref.detectChanges();
      let new_size = this.my_item.length;
      console.log("New Loaded List Size: " + this.my_item.length);
      if(new_size < 5){
        this.loadMoreData(infiniteScroll, load_count-1);
      }
    }, (err) => {
      infiniteScroll.complete();
      this.ref.detectChanges();
      console.log("Data: " + JSON.stringify("Error Reading " + err));
    }) 
  }

  doRefresh(refresher) {
    if(navigator.onLine){
      this.reviews = null;
      this.reviews = [];
      this.my_item = [];
      // this.upper = 5.000;
      // this.lower = 4.800   


      this.items = this.db.list(`/Vendors/${this.vendor.id}/reviews`).valueChanges();    
      this.items.subscribe( (data) => {
        console.log("Data " + JSON.stringify(data));
        this.my_item = JSON.parse(JSON.stringify(data));
        this.my_item = this.my_item.reverse();
        for(let i of this.my_item){
          this.reviews.push(i);
        }
        refresher.complete();
        this.ref.detectChanges();
        console.log("Favorite Size: " + this.reviews.length);
        // if(count < 5 ){
        //   this.upper = this.lower - 0.001; 
        //   this.lower -= 0.3;
        //   this.loadMore();
        // }
      }, (err) => {
        refresher.complete();
        this.ref.detectChanges();
        console.log("Data: " + JSON.stringify("Error Reading " + err));
      }) 
    }
    else{
      this.showAlert("", "No Internet Connection Found.\nConnect to a network and try again.")
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
}