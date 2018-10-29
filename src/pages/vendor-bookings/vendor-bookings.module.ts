import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorBookingsPage } from './vendor-bookings';

@NgModule({
  declarations: [
    VendorBookingsPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorBookingsPage),
  ],
})
export class VendorBookingsPageModule {}
