import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorReviewsPage } from './vendor-reviews';

@NgModule({
  declarations: [
    VendorReviewsPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorReviewsPage),
  ],
})
export class VendorReviewsPageModule {}
