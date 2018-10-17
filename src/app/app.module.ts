import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { CategoriesPage } from '../pages/categories/categories';
import { BookingHistoryPage } from '../pages/booking-history/booking-history';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';
import { AccountPage } from '../pages/account/account';
import { MainPage } from '../pages/main/main';
import { ExperiencePage } from '../pages/experience/experience';
import { ProfilePage } from '../pages/profile/profile';




import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire'

var config = {
  apiKey: "AIzaSyBouFPqwMCAb33Bf2I5fzNDDJikUBkUTE0",
  authDomain: "gonzalez-42eb6.firebaseapp.com",
  databaseURL: "https://gonzalez-42eb6.firebaseio.com",
  projectId: "gonzalez-42eb6",
  storageBucket: "gonzalez-42eb6.appspot.com",
  messagingSenderId: "359653515008"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ForgotPasswordPage,
    SignUpPage,
    ChangepasswordPage,
    MainPage,
    CategoriesPage,
    BookingHistoryPage,
    MyFavoritesPage,
    AccountPage,
    ProfilePage,
    ExperiencePage
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(config),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ForgotPasswordPage,
    SignUpPage,
    ChangepasswordPage,
    MainPage,
    CategoriesPage,
    BookingHistoryPage,
    MyFavoritesPage,
    AccountPage,
    ProfilePage,
    ExperiencePage
  ],
  providers: [
    StatusBar,    
    InAppBrowser,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
