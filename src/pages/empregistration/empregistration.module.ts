import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmpregistrationPage } from './empregistration';

@NgModule({
  declarations: [
    EmpregistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(EmpregistrationPage),
  ],
})
export class EmpregistrationPageModule {}
