import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BarcodeScanner} from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Firebase } from '@ionic-native/firebase';
import { Globalization } from '@ionic-native/globalization';
import { HTTP } from '@ionic-native/http';
import { Keyboard } from '@ionic-native/keyboard';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QrScannerPage } from '../pages/qr-scanner/qr-scanner';
import { AlertPage } from '../pages/alert/alert';
import { RegisterPage } from '../pages/register/register'
import { NotificationPage } from '../pages/notification/notification'
import { AlertStudentPage } from '../pages/alert-student/alert-student'

import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EncriptionDecriptionProvider } from '../providers/encription-decription/encription-decription';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QrScannerPage,
    AlertPage,
    RegisterPage,
    NotificationPage,
    AlertStudentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
  }),
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })        
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QrScannerPage,
    AlertPage,
    RegisterPage,
    NotificationPage,
    AlertStudentPage
  ],
  providers: [
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    DatePicker,
    EncriptionDecriptionProvider,
    Network,
    BackgroundMode,
    LocalNotifications,
    Firebase,
    Globalization,
    HTTP,
    Keyboard
  ]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


