import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

/**
 * Generated class for the MyFavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html',
})
export class MyFavoritesPage {

  items: Observable<any[]>
  // my_item: Observable<any[]>
  public user: any;
  my_item: any;

  constructor(public navCtrl: NavController,
              public ref: ChangeDetectorRef,
              public fire: AngularFireAuth,  
              public loadingCtrl: LoadingController,
              private db: AngularFireDatabase, 
              public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFavoritesPage');

    let loading = this.loadingCtrl.create({
    content: 'Loading Vendors.<br/>Please wait...'
    });
    loading.present();
    this.ref.detectChanges();

    this.items = this.db.list('/Vendors').valueChanges();//.subscribe(res => {

    console.log("data: " + JSON.stringify(this.items));

    this.items.subscribe( (data) => {
      console.log("Data " + JSON.stringify(data));
      this.my_item = JSON.parse(JSON.stringify(data));
      // let d = JSON.parse(JSON.stringify(data));
      // for(let i=0; i< d.length; i++){
      //   this.my_item.push(d[i]);
      // }
      // this.my_item.push(data);

      this.ref.detectChanges();
      loading.dismiss();
    }, (err) => {
      loading.dismiss();
      this.ref.detectChanges();
      console.log("Data: " + JSON.stringify("Error Reading " + err));
    }) 
  }

  loadMoreData(infiniteScroll){
    this.items = this.db.list('/Vendors').valueChanges();//.subscribe(res => {
      console.log("data: " + JSON.stringify(this.items));  
      this.items.subscribe( (data) => {
        console.log("Data " + JSON.stringify(data));
        infiniteScroll.complete();
        this.ref.detectChanges();
      }, (err) => {
        infiniteScroll.complete();
        this.ref.detectChanges();
        console.log("Data: " + JSON.stringify("Error Reading " + err));
      }) 
  }
}
