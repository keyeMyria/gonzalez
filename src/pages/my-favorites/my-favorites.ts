import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { VendorPage } from '../vendor/vendor';

declare var navigator;
@IonicPage()
@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html',
})
export class MyFavoritesPage {

  hideMe:boolean=true;
  items: Observable<any[]>
  public user: any;
  my_item: any;
  favorites: any = [];
  upper: number = 5.000;
  lower: number = 4.800;

  constructor(public navCtrl: NavController,
              public ref: ChangeDetectorRef,
              public fire: AngularFireAuth,  
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private db: AngularFireDatabase, 
              public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFavoritesPage');

    console.log("Favorite Size: " + this.favorites.length);
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
    this.items = this.db.list('/Vendors', ref => ref.orderByChild('rating').startAt(this.lower).endAt(this.upper)).valueChanges();    
    this.items.subscribe( (data) => {
      console.log("Data " + JSON.stringify(data));
      this.my_item = JSON.parse(JSON.stringify(data));
      this.my_item = this.my_item.reverse();
      for(let i of this.my_item){
        this.favorites.push(i);
      }
      this.hideMe = false;
      this.ref.detectChanges();
      let count = this.favorites.length;
      console.log("Favorite Size: " + this.favorites.length);
      if(count < 5 ){
        this.upper = this.lower - 0.001; 
        this.lower -= 0.3;
        this.loadMore();
      }
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
    this.upper = this.lower - 0.001; 
    this.lower -= 0.3;
    this.items = this.db.list('/Vendors', ref => ref.orderByChild('rating').startAt(this.lower).endAt(this.upper)).valueChanges();    
    this.items.subscribe( (data) => {
      console.log("Data " + JSON.stringify(data));
      this.my_item = JSON.parse(JSON.stringify(data));
      this.my_item = this.my_item.reverse();
      for(let i of this.my_item){
        this.favorites.push(i);
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
      this.favorites = null;
      this.favorites = [];
      this.my_item = [];
      this.upper = 5.000;
      this.lower = 4.800;
      this.items = this.db.list('/Vendors', ref => ref.orderByChild('rating').startAt(this.lower).endAt(this.upper)).valueChanges();    
      this.items.subscribe( (data) => {
        console.log("Data " + JSON.stringify(data));
        this.my_item = JSON.parse(JSON.stringify(data));
        this.my_item = this.my_item.reverse();
        for(let i of this.my_item){
          this.favorites.push(i);
        }
        refresher.complete();
        this.ref.detectChanges();
        let count = this.favorites.length;
        console.log("Favorite Size: " + this.favorites.length);
        if(count < 5 ){
          this.upper = this.lower - 0.001; 
          this.lower -= 0.3;
          this.loadMore();
        }
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

  onItemClick(item: any){
    console.log(JSON.stringify(item));
    this.navCtrl.push(VendorPage, {vendor: item});
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
