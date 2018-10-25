import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendersPage } from './venders';

@NgModule({
  declarations: [
    VendersPage,
  ],
  imports: [
    IonicPageModule.forChild(VendersPage),
  ],
})
export class VendersPageModule {}
