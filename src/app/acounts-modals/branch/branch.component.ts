import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  Branches = {
    name: '',
    user: {
      name: '',
    },
    rowid: null,
    code: '',
    phonenumber: '',
    mobilenumber: '',
    faxnumber: '',
    tollfreenumber: '',
    email: '',
    exciseno: '',
    tinno: '',
    panno: '',
    importexportno: '',
    tanno: '',
    gstno: '',
    taxexemptionno: '',
    isactive: '',
    addressline: '',
    remarks: '',
    lrTerm: '',
    lrFooter: '',
    constcenter: 0,
    site:{
      id:0,
      name:'Not Applicable'
    },
    state:{
      id:0,
      name:'Not Applicable'
    },
    city:{
      id:0,
      name:'Not Applicable'
    },
    latitude: 'null',
    longitude: 'null',
    precode: '',
    lrcodewidth: 5,
    lrcodelastid: 0,
    mannual:false
  };
  siteData = [];
  allowBackspace = true;
  statedata =[];
  citydata =[];
  activeid='';
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {


    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);
      this.Branches = {
        name: this.common.params.name,
        rowid: this.common.params.id,
        user: {
          name: this.common.params.name,
        },

        code: this.common.params.code,
        phonenumber: this.common.params.phonenumber,
        mobilenumber: this.common.params.mobilenumber,
        faxnumber: this.common.params.faxnumber,
        tollfreenumber: this.common.params.tollfreenumber,
        email: this.common.params.email,
        exciseno: this.common.params.exciseno,
        tinno: this.common.params.tinno,
        panno: this.common.params.panno,
        importexportno: this.common.params.importexportno,
        tanno: this.common.params.tanno,
        gstno: this.common.params.gstno,
        taxexemptionno: this.common.params.taxexemptionno,
        isactive: this.common.params.isactive,
        addressline: this.common.params.addressline,
        remarks: this.common.params.remarks,
        lrTerm: this.common.params.lr_terms,
        lrFooter: this.common.params.lr_footer,
        constcenter: this.common.params.is_constcenterallow,
        site: {
          id: (this.common.params.site_id) ? this.common.params.site_id : 0,
          name: (this.common.params.sitename) ? this.common.params.sitename : ''
        },
        state: {
          id:(this.common.params.province_id) ? this.common.params.province_id :0 ,
          name:(this.common.params.province_name) ? this.common.params.province_name : ''
        },
        city: {
          id: (this.common.params.city_id) ? this.common.params.city_id : 0,
          name:(this.common.params.cityname) ? this.common.params.cityname : ''
        },
        latitude: (this.common.params.lat == null) ? 'null': this.common.params.lat,
        longitude: (this.common.params.long ==null) ? 'null' : this.common.params.long,
        precode: (this.common.params.lr_pre_code) ? this.common.params.lr_pre_code : '',
        lrcodewidth: this.common.params.lr_code_width,
        lrcodelastid: this.common.params.lr_code_lastid,
        mannual: this.common.params.is_inv_manualapprove,

      }
      if(this.Branches.state.id !=null){
        setTimeout(() => {
          this.GetCity(this.Branches.state.id);
       // this.setdataofstate();
        }, 1000);
      }

      //  console.log('Accounts: ', this.Accounts);
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.GetState()
    this.getSite();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  dismiss(response) {
    console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response, Branch: this.Branches });
  }

  onSelected(selectedData, type, display) {
    this.Branches[type].name = selectedData[display];
    this.Branches[type].id = selectedData.id;
    console.log('Accounts User: ', this.Branches);
  }
  onSelectedSite(selectedData, type, display) {
    this.Branches[type].name = selectedData[display];
    this.Branches[type].id = selectedData.id;
    console.log('Selected Data: ', selectedData, type, display);
    if(type=='state'){
      this.GetCity(selectedData.id);
    }
    //  console.log('order User: ', this.getstatedata);
    //  this.setFoucus('submit');
  }
  getSite() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllSite', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('site Res:', res['data']);
        this.siteData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  GetState() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/GetState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.statedata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

 

  GetCity(stateid) {
    let params = {
      state: stateid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetCity', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.citydata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    this.activeid=activeId;
    console.log('event', event);
    if (event.key == "Escape") {
      this.showExit = true;
    }
    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
        event.preventDefault();
        this.activeModal.close();
        return;
        // this.close();
      } else if (key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }

    }

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Accounts show confirm:', this.Branches);
        this.dismiss(true);
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      console.log('active', activeId);
      if (activeId.includes('user')) {
        this.setFoucus('name');
      } else if (activeId.includes('name')) {
        this.setFoucus('code');
      } else if (activeId.includes('precode')) {
        this.setFoucus('lrcodewidth');
      } else if (activeId.includes('lrcodelastid')) {
        this.setFoucus('lr-terms');
      } else if (activeId.includes('lrcodewidth')) {
        this.setFoucus('lrcodelastid');
      } else if (activeId.includes('code')) {
        this.setFoucus('phonenumber');
      } else if (activeId.includes('phonenumber')) {
        this.setFoucus('mobilenumber');
      } else if (activeId.includes('mobilenumber')) {
        this.setFoucus('faxnumber');
      } else if (activeId.includes('faxnumber')) {
        this.setFoucus('tollfreenumber');
      } else if (activeId.includes('tollfreenumber')) {
        this.setFoucus('email');
      } else if (activeId.includes('email')) {
        this.setFoucus('exciseno');
      } else if (activeId.includes('exciseno')) {
        this.setFoucus('tinno');
      } else if (activeId.includes('tinno')) {
        this.setFoucus('panno');
      } else if (activeId.includes('panno')) {
        this.setFoucus('importexportno');
      } else if (activeId.includes('importexportno')) {
        this.setFoucus('tanno');
      } else if (activeId.includes('tanno')) {
        this.setFoucus('gstno');
      } else if (activeId.includes('gstno')) {
        this.setFoucus('taxexemptionno');
      } else if (activeId.includes('taxexemptionno')) {
        if(this.common.params){
          this.setFoucus('isactive');
        }else{
        this.setFoucus('site');
        }

      } else if (activeId.includes('isactive')) {
        this.setFoucus('site');
      } else if (activeId.includes('lr-terms')) {
        this.setFoucus('lr-footer');
      } else if (activeId.includes('lr-footer')) {
        this.setFoucus('addressline');
      } else if (activeId.includes('site')) {
        this.setFoucus('latitude');
      } else if (activeId.includes('latitude')) {
        this.setFoucus('longitude');
      } else if (activeId.includes('longitude')) {
        this.setFoucus('mannual');
      }else if (activeId.includes('mannual')) {
        this.setFoucus('state');
      } else if (activeId.includes('state')) {
        this.setFoucus('city');
      }else if (activeId.includes('city')) {
        this.setFoucus('lr-terms');
      }else if (activeId.includes('addressline')) {
        this.setFoucus('remarks');
      } else if (activeId.includes('remarks')) {
        this.showConfirm = true;
        // this.setFoucus('submit');
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      if (activeId.includes('name')) {
        this.setFoucus('user');
      } else if (activeId.includes('lrcodelastid')) {
        this.setFoucus('lrcodewidth');
      } else if (activeId.includes('lrcodewidth')) {
        this.setFoucus('precode');
      } else if (activeId.includes('precode')) {
        this.setFoucus('longitude');
      } else if (activeId.includes('code')) {
        this.setFoucus('name');
      } else if (activeId.includes('phonenumber')) {
        this.setFoucus('code');
      } else if (activeId.includes('mobilenumber')) {
        this.setFoucus('phonenumber');
      } else if (activeId.includes('faxnumber')) {
        this.setFoucus('mobilenumber');
      } else if (activeId.includes('tollfreenumber')) {
        this.setFoucus('faxnumber');
      } else if (activeId.includes('email')) {
        this.setFoucus('tollfreenumber');
      } else if (activeId.includes('exciseno')) {
        this.setFoucus('email');
      } else if (activeId.includes('tinno')) {
        this.setFoucus('exciseno');
      } else if (activeId.includes('panno')) {
        this.setFoucus('tinno');
      } else if (activeId.includes('importexportno')) {
        this.setFoucus('panno');
      } else if (activeId.includes('tanno')) {
        this.setFoucus('importexportno');
      } else if (activeId.includes('gstno')) {
        this.setFoucus('tanno');
      } else if (activeId.includes('taxexemptionno')) {
        this.setFoucus('gstno');
      } else if (activeId.includes('isactive')) {
        this.setFoucus('taxexemptionno');
      } else if (activeId.includes('addressline')) {
        this.setFoucus('lr-footer');
      } else if (activeId.includes('longitude')) {
        this.setFoucus('latitude');
      } else if (activeId.includes('latitude')) {
        this.setFoucus('site');
      } else if (activeId.includes('site')) {
        this.setFoucus('isactive');
      } else if (activeId.includes('lr-footer')) {
        this.setFoucus('lr-terms');
      } else if (activeId.includes('lr-terms')) {
        this.setFoucus('city');
      } else if (activeId.includes('city')) {
        this.setFoucus('state');
      } else if (activeId.includes('state')) {
        this.setFoucus('mannual');
      } else if (activeId.includes('mannual')) {
        this.setFoucus('longitude');
      }  else if (activeId.includes('remarks')) {
        this.setFoucus('addressline');
      }

    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }



  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }


}
