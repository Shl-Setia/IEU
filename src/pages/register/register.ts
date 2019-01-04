import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertPage } from '../alert/alert';
import { NotificationPage } from '../notification/notification'


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  private user : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private formBuilder: FormBuilder) {
    this.user = this.formBuilder.group({
      name: ['', Validators.required],
      day:[''],
      month:[''],
      year:[''],
      email: ['', Validators.required],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
      address: [''],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  logForm(){
    console.log(this.user.value)
  }

  goToHomePage(){
    this.navCtrl.popToRoot();
  }

  goToOtherPage(page) {
    if('alert' === page){
      this.navCtrl.push(AlertPage);
    }else if('notification' === page){
      this.navCtrl.push(NotificationPage);
    }
  }
}
