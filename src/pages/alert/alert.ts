import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { RegisterPage } from '../register/register'
import { NotificationPage } from '../notification/notification'
import { RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Observable } from 'rxjs/Rx';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the AlertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//Application Status
@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html',
})
export class AlertPage {
  //private URL = 'http://localhost:8100'; // this is used for web/dev testing
  private URL = 'http://ieu.viennaadvantage.com'; // this is used for testing on actual device. When change the URL, restart the server, ionic serve  
  
  sessionId;

  items = [
    // {
    //   'name' : 'Your application form cancelled. As you didnt submit the documnets.',
    //   'type' : 'ieu-error',
    //   'color' : 'error'
    // },
    //  {
    //    'name' : 'Application status is 100%',
    //    'type' : 'ieu-success',
    //    'color' : 'success'
    // },
    //  {
    //    'name' : 'You have to submit the documents otherwisw the form will be rejected.',
    //  'type' : 'ieu-warning',
    //  'color' : 'warning'
    // },
    // {
    //    'name' : 'The Legend of Zelda',
    //  'type' : 'ieu-error',
    //  'color' : 'error'
    // }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private platform: Platform, public http: HTTP, 
              private toastCtrl: ToastController, private storage: Storage,
              private translate: TranslateService) {
                
      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.platform.exitApp();
        });
      });

      this.storage.get('SESSION_ID').then((sid) => {
        this.sessionId = sid;
      });

      this.storage.get('USER_TYPE').then((val) => {
       console.log('USER_TYPE', val);

        if('Member' === val){
          this.storage.get('AD_USER_ID').then((user_id) => {
            console.log('AD_USER_ID', user_id);
            this.fetchAlerts(user_id);
            
          });  
        }
        
      });
     
  }

  goToHomePage(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.popToRoot();
  }

  logout(){
    this.storage.clear();
    this.goToHomePage();
  }

  goToOtherPage(page) {
    if('register' === page){
      this.navCtrl.push(RegisterPage);
    }else if('notification' === page){
      this.navCtrl.push(NotificationPage);
    }
  }

async fetchAlerts(ad_user_id : string){
    //selectQuery=Select+*+FROM+OfficeMemo&accessKey=caff4eb4fbd6273e37e8a325e19f0991
    //SELECT+NAME+,+SUBJECT+,+MESSAGE+,+DOCUMENTNO+FROM+OFFICEMEMO+WHERE+isactive+=+'Y'+AND+CREATED+BETWEEN+ADD_MONTHS(SYSDATE,-4)+AND+SYSDATE+ORDER+BY+OFFICEMEMO_ID+DESC

    // var res =[
    //   {
    //     'title' : 'Your Application Number ‘1000408’ has following status:',
    //     'statuses' :[
    //       {
    //         'st' : '65% - Approved By Audit Department'
    //       },
    //       {
    //         'st' : '35% - Payment Completed'
    //       },
    //       {
    //         'st' : '20% - Verified By Promotion Department'
    //       },
    //       {
    //         'st' : '10% - Personal Information Sent For Verification'
    //       }
    //     ] 
    //   },

    //   {
    //     'title' : 'Your Application Number ‘1000410’ has following status:',
    //     'statuses' :[
    //       {
    //         'st' : '35% - Payment Completed'
    //       },
    //       {
    //         'st' : '20% - Verified By Promotion Department'
    //       },
    //       {
    //         'st' : '40% - Verified By Promotion Department'
    //       },
    //       {
    //         'st' : '0% - Personal Information Sent For Verification'
    //       }
    //     ] 
    //   }

    // ] 

    

    var myParams = new URLSearchParams();
    var queryString1 = 'SELECT+*+FROM+IEU01_CurrentStatus_V+WHERE+ad_user_id+=+\'';
    var queryString2 = queryString1.concat(ad_user_id);
    var queryString3 = queryString2.concat('\'');
    console.log(queryString3);
    // myParams.set('selectQuery', queryString3);
    // myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');
    // myParams.set('_session_ID', '1010031');		// bind it
   //var options = new RequestOptions({params: myParams });


    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    let url1 = this.URL + '/api/Values/GetRecord?_session_ID=' + this.sessionId +'&accessKey=e3d1cbebc50a1f278b2a2f6a4cce2770&selectQuery='
    let url2 = url1 + queryString3;
    
    this.http.get(url2, {}, {})
    .then(res => {
      console.log(res);
       let data = JSON.parse(res.data);
       console.log(data);

       var groupedStatuses = [];
       if(data.length > 0){
        let currentAppNumber = 'abc';
        let currentStatuses = [];
        data.forEach((value, index) => {
          //console.log(value.VALUE);
          if( currentAppNumber.localeCompare(value.VALUE) != 0){
            //console.log(typeof value.VALUE)
             currentAppNumber = value.VALUE;
             console.log(currentAppNumber);

             var yan;  //Your Application Number
             var hfs;  //has following status
             this.translate.get('YOUR_APP_NUMBER').subscribe(value => {
              // value is our translated string
               yan = value;
              })

              this.translate.get('HAS_FOLLOWING_STATUS').subscribe(value => {
                // value is our translated string
                hfs = value;
              })


             let newGroup = {
              title : yan + ' ' + value.VALUE + ' ' + hfs,
              appNumber : value.VALUE,
              color : 'success',
              name : 'ieu-success',
              statuses: []
             };

             currentStatuses = newGroup.statuses;

             groupedStatuses.push(newGroup);
          }//end of if

          currentStatuses.push(value.CURRENTSTATUS)
        }); // end of for each

        console.log(groupedStatuses);
        this.items = groupedStatuses;
       }else{
        this.translate.get('ERROR').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
    
        console.log('No Alerts found!');
      }
    }).catch(err => {
      this.translate.get('ERROR').subscribe(value => {
        // value is our translated string
        let alertTitle = value;
        this.presentToast(alertTitle);
      })
     console.log('Error while fetching Alerts!')
    });


    // this is angular http
    // this.http.get(this.URL+'/api/Values/GetRecord', options)        // use this whilte testing in browser, this use proxy
    //   .map(res => res.json())
    //   .subscribe(
    //             data => {
    //               console.log(data);
    //               //var alerts;
    //               var groupedStatuses = [];
    //               if(data.length > 0){
                    
                    
    //                 // var applicationNumberArray : number[] = new Array(data.length);
    //                 // var num:number;
    //                 // for(num=0;num<data.length;num++) {
    //                 //   //console.log(data[num].VALUE);
    //                 //   applicationNumberArray[num] = data[num].VALUE;  
    //                 // }
    //                 // console.log(applicationNumberArray);
    //                 // // find unique app numbers 
    //                 // var uniqueAppNum = applicationNumberArray.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    //                 //https://www.joshmorony.com/an-introduction-to-lists-in-ionic-2/
                    
    //                 let currentAppNumber = 'abc';
    //                 let currentStatuses = [];
    //                 data.forEach((value, index) => {
    //                   //console.log(value.VALUE);
    //                   if( currentAppNumber.localeCompare(value.VALUE) != 0){
    //                     //console.log(typeof value.VALUE)
    //                      currentAppNumber = value.VALUE;
    //                      console.log(currentAppNumber);

    //                      var yan;  //Your Application Number
    //                      var hfs;  //has following status
    //                      this.translate.get('YOUR_APP_NUMBER').subscribe(value => {
    //                       // value is our translated string
    //                        yan = value;
    //                       })

    //                       this.translate.get('HAS_FOLLOWING_STATUS').subscribe(value => {
    //                         // value is our translated string
    //                         hfs = value;
    //                       })


    //                      let newGroup = {
    //                       title : yan + ' ' + value.VALUE + ' ' + hfs,
    //                       appNumber : value.VALUE,
    //                       color : 'success',
    //                       name : 'ieu-success',
    //                       statuses: []
    //                      };

    //                      currentStatuses = newGroup.statuses;

    //                      groupedStatuses.push(newGroup);
    //                   }//end of if

    //                   currentStatuses.push(value.CURRENTSTATUS)
    //                 }); // end of for each

    //                 console.log(groupedStatuses);
    //                 this.items = groupedStatuses;
    //               }else{
    //                 this.translate.get('ERROR').subscribe(value => {
    //                   // value is our translated string
    //                   let alertTitle = value;
    //                   this.presentToast(alertTitle);
    //                 })
                
    //                 console.log('No Alerts found!');
    //               }
    //             },
    //             err => {
    //               this.translate.get('ERROR').subscribe(value => {
    //                 // value is our translated string
    //                 let alertTitle = value;
    //                 this.presentToast(alertTitle);
    //               })
    //              console.log('Error while fetching Alerts!')
    //             });
  }

  


  presentToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


}
