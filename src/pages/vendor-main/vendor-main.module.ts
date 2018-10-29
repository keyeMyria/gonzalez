import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorMainPage } from './vendor-main';

@NgModule({
  declarations: [
    VendorMainPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorMainPage),
  ]
})
export class VendorMainPageModule {}
