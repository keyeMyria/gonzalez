import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, InfiniteScroll } from 'ionic-angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {Events} from 'ionic-angular';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-vendor-reviews',
  templateUrl: 'vendor-reviews.html',
})
export class VendorReviewsPage {
hideMe :boolean = true;
items: Observable<any[]>;
my_item: any;
reviews: any = [];
vendor: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ref: ChangeDetectorRef,
              public fire: AngularFireAuth,
              public events: Events,
              public alertCtrl: AlertController,
              public loadingCtrl : LoadingController,
              public db: AngularFireDatabase,
              ) {
  }

ionViewDidLoad() {
   if(navigator.onLine)
   {
     this.loadMore();
     this.hideMe=false;
   }
   else{
     this.hideMe=false;
     this.alert("","No internet Connection.\n Check to a connection and try again later");
   } 
}

loadMore(){
  console.log("Start Data Loading");
  this.hideMe=true;
  this.my_item=[];
  this.items = this.db.list('/Reviews/a1-gmail_com',  r => r.orderByChild('created_at')).valueChanges();
  this.items.subscribe(  (data)=>{
    console.log("Data" +JSON.stringify(data));
    this.my_item=JSON.parse(JSON.stringify(data));
    this.my_item= this.my_item.reverse();
    for (let i of this.my_item){
      let time = moment(i.created_at).format('MMMM DD, YYYY');
      let d = new Date(i.created_at);
      console.log("Timestamp"+ JSON.stringify(i.created_at)+ "Time is: "+ JSON.stringify(time) + "Date: "+ JSON.stringify(d));
      let r={
        name: "",
        rating: "",
        time: ""
      }
      r.name=i.name;
      r.rating=i.rating;
      console.log("Rating: "+JSON.stringify(r.rating));
      r.time=time;
      this.reviews.push(r);
    }
    this.ref.detectChanges();
  },(err)=>{
    this.ref.detectChanges();
    console.log("Data: "+JSON.stringify("Error Reading" + err));
  })
}

loadMoreData(infinitrscroll ,load_count:number){
  console.log("Load count: " +load_count);
  if(load_count==0){
    infinitrscroll.complete();
    return;
  }
  this.my_item=[];
  this.items = this.db.list('/Reviews/a1-gmail_com',  r => r.orderByChild('created_at')).valueChanges();
  this.items.subscribe((data)=>{
    console.log("Data: " +JSON.stringify(data));
    this.my_item= JSON.parse(JSON.stringify(data));
    this.my_item= this.my_item.reverse();
    for (let i of this.my_item){
      this.reviews.push(i);
    }
    infinitrscroll.complete();
    this.ref.detectChanges();
    let new_size = this.my_item.length;
    console.log("New loaded list size "+ this.my_item.length);
    if(new_size <5){
      this.loadMoreData(infinitrscroll, load_count-1);
    }
  },(err)=>{
    infinitrscroll.complete();
    this.ref.detectChanges();
    console.log("Data: "+JSON.stringify("Error reading : " + err));
  })
}
doRefresher(refresher){
if(navigator.onLine){
  this.reviews = null;
  this.reviews = [];
  this.my_item = [];
  this.items = this.db.list('/Reviews/a1-gmail_com',  r => r.orderByChild('created_at')).valueChanges();
  this.items.subscribe((data)=>{
    console.log("Data: "+JSON.stringify(data));
    this.my_item= JSON.parse(JSON.stringify(data));
    this.my_item= this.my_item.reverse();
    for(let i of this.my_item){
      this.reviews.push(i);
    }
    refresher.complete();
    this.ref.detectChanges();
    console.log("Reviews size: "+ this.reviews.length);
  },(err)=>{
    refresher.complete();
    this.ref.detectChanges();
    console.log("Data: " + JSON.stringify("Error Reading " + err));
  })
}
  else{
    this.alert("", "No Internet Connection Found.\nConnect to a network and try again.")
  }
}
  alert(subject:string, error:string){
    let a= this.alertCtrl.create({
      title: subject,
      subTitle: error,
      buttons:['OK']
    });
    a.present();
  }
}
