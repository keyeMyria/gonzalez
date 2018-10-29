import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HomePage } from '../pages/home/home';
import { VendorMainPage }  from '../pages/vendor-main/vendor-main';
import { VendorProfilePage } from '../pages/vendor-profile/vendor-profile';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = VendorMainPage;//HomePage;

  constructor(platform: Platform, statusBar: StatusBar, ) {
   
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
    });
  }
}

