import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { EncryptService } from '../../services/encrypt.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'beehive',
  templateUrl: './beehive.component.html',
  styleUrls: ['./beehive.component.scss']
})
export class BeehiveComponent implements OnInit {
  lat1: "";
  long1: "";
  circlesData = [];
  encryptSecretKey = 'elogist123';
  data = null;
  LatLong = [];
  publicKey1133 = null;
  lat2: "";
  latLngs: "";
  long2: "";
  count = null;
  current = null;
  // arr1 = [
  //   this.lat1,
  //   this.long1,
  //   this.lat2,
  //   this.long2
  // ];
  size = "";
  first = null;
  second = null;
  print = null;
  encryptedArray = [];
  decrypt = null;
  privateDecrypted: any;
  componentType = 'page';

  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public encrypt: EncryptService,
    public activeModal: NgbActiveModal,
  ) {
    this.componentType;
    if (this.common.params && this.common.params.reference) {
      this.componentType = this.common.params.reference
    }
    else {
      this.componentType = 'page';
    }
    this.LatLong = this.common.params;
    this.common.refresh = this.refresh.bind(this);
    // console.log(this.pass1);
    // console.log(this.pass);
    // console.log("private-->",this.forgePrivateKey);
    // console.log("public-->",this.forgePublicKey);
    // console.log("public pem-->",this.publicKey);
    // console.log("public ssh-->",this.sshPublicKey);


  }

  refresh(){
    console.log('Refresh');
    this.LatLong = this.common.params;
  }
  ngOnInit() {

  }
  closeModal() {
    this.activeModal.close();
  }

  // ngAfterViewInit() {
  //   this.mapService.mapIntialize("map", 8);

  //   setTimeout(() => {
  //     this.getMapping();
  //   }, 2000);
  // }
  // getEncrypt(){
  //   this.encryptedArray = this.encrypt.encryptData(this.data , this.publicKey);
  //   // this.getDecrypt(this.encryptedArray[0] , this.privateKey , this.encryptedArray[1]);
  //   console.log(this.encryptedArray[0]);
  //   console.log(this.encryptedArray[1]);
  // }
  // getDecrypt(print , privateKey, transmitData){
  //   this.privateDecrypted = this.encrypt.decrypt(print , privateKey);
  //   this.print = this.encrypt.decryptData(transmitData , this.privateDecrypted );
  //   console.log("decypted---->",this.print);
  //   console.log("privateDecrypted---->",this.privateDecrypted);
  //   // this.print = this.encrypt.decryptData(this.decrypt);
  // }
  // encrypt1(){
  //   // this.print = this.encrypt.encrypt(this.data, this.pass);
  //   this.decrypt = this.print;
  //   console.log(this.decrypt);
  // }
  // decrypt1(){
  //   // this.print = this.encrypt.decrypt(this.decrypt,this.pubprivkey.private);
  //   console.log(print);
  // }
  // getTweetNacl(publicKey){
  //   let alice =nacl.box.keyPair();
  //   alice = nacl.box.keyPair.fromSecretKey(alice.secretKey);
  // let nonce = nacl.randomBytes(24);
  // // message for Alice
  // let utf8 = this.data;
  // // Bob encrypts message for Alice
  // const box = nacl.box(
  //   naclutil.decodeUTF8(utf8),
  //   nonce,
  //   publicKey,
  //   alice.secretKey
  // );
  // let data = naclutil.decodeUTF8(utf8);
  // this.tweetNacl(box,alice.publicKey);

  // }
  // getPublicKey(){
  //   ++this.common.loading;
  //   this.api.get('Test/getPublicKey')
  //     .subscribe(res => {
  //       --this.common.loading;
  //       console.log("response", res);
  //       this.publicKey1133 = res['data'];
  //       this.getTweetNacl(this.publicKey1133);
  //       // console.log("Receipt",this.receipts);
  //     }, err => {
  //       --this.common.loading;
  //       console.log('Err:', err);
  //     });
  // }
  // tweetNacl(box , publicKey  ) {
  //   const params = {
  //     box: box,
  //     public :  publicKey,
  //   };
  //   console.log("params-->",params);
  //   this.common.loading++;
  //   this.api.post("Test/tweetNacl",params)
  //     .subscribe(res => {
  //       let data = res['data'];
  //       this.common.loading--;
  //       console.log('Res: ', res['data']);
  //     }, err => {
  //       console.error(err);
  //       this.common.showError();
  //     });
  // }
  checkEncrypt() {
    let params = {
      name: "This is Prateek",
      company: "Elogist",
      data: this.data
    };
    this.common.loading++;
    this.api.post("Test/encrpytDecryptTest", params)
      .subscribe(res => {
        let data = res['data'];
        this.common.loading--;
        console.log('Res: ', res);
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  checkEncrypt1() {
    let params = {
      name: "This is Prateek",
      company: "Elogist",
      data: this.data
    };
    this.common.loading++;
    this.api.postEncrypt("Test/encrpytDecryptTest", params)
      .subscribe(res => {
        let data = res['data'];
        this.common.loading--;
        console.log('Res: ', res);
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  getSubSites() {
    // this.getFencing();
    let params = "name=prateek";
    this.common.loading++;
    this.api.get('Test/checkEncrypt?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  getSubSites1() {
    // this.getFencing();
    let params = "name=prateek";
    this.common.loading++;
    this.api.getEncrypt('Test/checkEncrypt?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  getMapping() {
    this.mapService.clearAll();
    console.log('params:---------------- ');
    this.common.loading++;
    this.api.get('Test/beeHive')
      .subscribe(async res => {
        this.common.loading--;

        this.LatLong = res['data'];
        console.log(res['data']);
        this.count = res['data'].length;
        this.current = 0;
        this.common.params = this.LatLong;
        this.mapService.createMarkers(res['data']['latLngs'], false, true, ["lat", "lng"]);
        for (const marker in this.mapService.markers) {
          if (this.mapService.markers.hasOwnProperty(marker)) {
            const thisMarker = this.mapService.markers[marker];
            this.current++;
            let circlesData = this.mapService.createCirclesOnPostion(thisMarker.position, res['data']['radius']);
            this.api.post('Test/generateBeeHive', {
              lat: thisMarker.position.lat(), long: thisMarker.position.lng(), radius: res['data']['radius']
            })
              .subscribe(res => {
                console.log(res['data']);
                switch (res['data']) {
                  case 2:
                    // Count >= 20 Color iS Blue
                    console.log("here2");
                    circlesData.setOptions({
                      fillColor: "#0000FF",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#0000FF"
                    });
                    break;
                  case 3:
                    // Count < 20 Color iS Green
                    console.log("here3");

                    circlesData.setOptions({
                      fillColor: "#00FF00",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#00FF00"
                    });
                    break;
                  case 4:
                    // If Api Status is not OK , Color iS yellow
                    console.log("here4");
                    circlesData.setOptions({
                      fillColor: "#FFFF00",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#FFFF00"
                    });
                    break;
                  case 5:
                    // already Exist in DB , Magenta
                    console.log("here5");
                    circlesData.setOptions({
                      fillColor: "#FF00FF",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#FF00FF"
                    });
                    break;
                  default:
                    // Color Is Red 
                    console.log("hereDefault", res['data']);

                    break;
                }
              },
                err => {
                  this.common.showError();
                });

            await this.sleep(500);

          }
        }
      },
        err => {
          this.common.loading--;
          this.common.showError();
        })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateBeeHive(lat, lng, radius) {

    let params = {
      lat: lat,
      long: lng,
      radius: radius
    };

    this.api.post('Test/generateBeeHive', params)
      .subscribe(res => {
        console.log(res['data']);
        return res['data'];
      },
        err => {
          this.common.showError();
        });
    return 1;

  }
}
