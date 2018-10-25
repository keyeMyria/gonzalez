import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import {ChangeDetectorRef} from '@angular/core'
import {AlertController} from 'ionic-angular'
import {LoadingController} from 'ionic-angular'
import { AngularFireDatabase } from '@angular/fire/database';
import { VendorPage } from '../vendor/vendor';
declare var  navigator;
@IonicPage()
@Component({
  selector: 'page-venders',
  templateUrl: 'venders.html',
})
export class VendersPage {
hideme:boolean=true;
items:Observable<any[]>
public user:any;
my_items:any;
venders:any=[];
upper: number=5.000;
lower:number= 4.800;
category: string;
constructor(public navCtrl: NavController,
  public ref: ChangeDetectorRef,
    public fire: AngularFireAuth,  
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private db: AngularFireDatabase, 
     public navParams: NavParams) {
  this.category = navParams.get("category");
  console.log('ionViewDidLoad VendersPage : ' + this.category);  
}

ionViewDidLoad() {
  console.log('ionViewDidLoad VendersPage');
 console.log("Vender Size: " + this.venders.length);
  if(navigator.onLine){
    this.loadMore();
    this.hideme=false;
  }
  else{
    this.sAlert("","No internet connection found.\n ckech your connection and try again.");
  }
}
loadMore(){
  console.log("Load More Function Started");

  this.hideme=true;
  this.my_items=[];
  this.items= this.db.list('/Vendors',ref =>ref.orderByChild('rating').startAt (this.lower).endAt(this.upper)).valueChanges();
  this.items.subscribe((data)=>{
    console.log("Data:"+ JSON.stringify(data));
    this.my_items=JSON.parse(JSON.stringify(data));
    this.my_items=this.my_items.reverse();
    for(let i of this.my_items){
      this.venders.push(i);
    }
    this.hideme=false;
    this.ref.detectChanges();
    let count = this.venders.length;
    console.log("Vender size:"+this.venders.length);
    if(count<5){
      this.upper= this.lower - 0.001;
      this.lower -=0.3;
      this.loadMore();
    }
  }, (err)=>{
    this.hideme=false;
    this.ref.detectChanges();
    console.log("Data:"+JSON.stringify("Error reading" + err));
  })
}



loadMoreData(InfiniteScroll, load_count: number){
  console.log("Load count:" + load_count);
  if(load_count==0){
    InfiniteScroll.complete();
    return;
  }
  this.my_items = [];
  this.upper = this.lower - 0.001; 
  this.lower -= 0.3;
  this.items = this.db.list('/Vendors', ref => ref.orderByChild('rating').startAt(this.lower).endAt(this.upper)).valueChanges();    
  this.items.subscribe( (data) => {
    console.log("Data " + JSON.stringify(data));
    this.my_items = JSON.parse(JSON.stringify(data));
    this.my_items = this.my_items.reverse();
    for(let i of this.my_items){
      this.venders.push(i);
    }
    InfiniteScroll.complete();
    this.ref.detectChanges();
    let new_size = this.my_items.length;
    console.log("New loaded list size"+ this.my_items.length);
    if(new_size<5){
      this.loadMoreData(InfiniteScroll , load_count-1);
    }
  },(err)=>
  {
    InfiniteScroll.complete();
    this.ref.detectChanges();
    console.log("Data:"+ JSON.stringify("Error reading" + err));
  })
}
doRefresh(refresher){
  if(navigator.onLine)
  {
    this.venders=null;
    this.venders=[];
    this.my_items=[];
    this.upper=5.000;
    this.lower=4.800;
    this.items= this.db.list('/Vendors' , ref=> ref.orderByChild('rating').startAt(this.lower).endAt(this.upper)).valueChanges();
    this.items.subscribe((data)=>{
      console.log("Data:"+JSON.stringify(data));
      this.my_items=JSON.parse(JSON.stringify(data));
      this.my_items= this.my_items.reverse();
      
      for(let i of this.my_items){
        this.venders.push(i);
      }

      

      refresher.complete();
      this.ref.detectChanges();
      let count = this.venders.length;
      console.log("Vender size: "+this.venders.length);
      if(count < 5)
      {
        this.upper = this.lower - 0.001;
        this.lower -=0.3;
        this.loadMore();
      }
    }, (err)=>{
      refresher.complete();
      this.ref.detectChanges();
      console.log("Data: " +JSON.stringify("Erroe loading" + err));
    })
    }
    else 
    {
       this.sAlert("", "No internet connection found.\n Please try again.")
    }
  }
  onClickItem(item: any)
  {
    console.log(JSON.stringify("Item: " + item));
    this.navCtrl.push(VendorPage, {vendor: item});
  }
  sAlert(subject:string, error:string) {
    let alert = this.alertCtrl.create({
      title: subject,
      subTitle: error,
      buttons: ['OKAY']
    });
    alert.present();
  }
}
