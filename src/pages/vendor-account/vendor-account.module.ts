import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorAccountPage } from './vendor-account';

@NgModule({
  declarations: [
    VendorAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorAccountPage),
  ],
})
export class VendorAccountPageModule {}
