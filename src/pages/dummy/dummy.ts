import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dummy',
  templateUrl: 'dummy.html',
})
export class DummyPage {

  constructor(public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DummyPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
