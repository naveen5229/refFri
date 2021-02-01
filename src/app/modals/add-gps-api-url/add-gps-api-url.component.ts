import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-gps-api-url',
  templateUrl: './add-gps-api-url.component.html',
  styleUrls: ['./add-gps-api-url.component.scss']
})
export class AddGpsApiUrlComponent implements OnInit {

  rowId = null;

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public common: CommonService) {
    console.log("gpsData", this.common.params);
    if (this.common.params) {
      this.gpsDetails.url = this.common.params.Url;
      this.gpsDetails.userName = this.common.params.UserName;
      this.gpsDetails.passWord = this.common.params.Password;
      this.rowId = this.common.params._id;
    }
    this.common.handleModalSize('class', 'modal-lg', '600');

  }

  gpsDetails = {
    url: '',
    userName: '',
    passWord: '',
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModel.close({ response: false });
  }

  saveMvGpsDetails() {
    if (this.gpsDetails.url == '') {
      this.common.showError("Please Enter Url");
      return;
    } else if (this.gpsDetails.userName == '') {
      this.common.showError("please Enter User Name");
      return;
    } else if (this.gpsDetails.passWord == '') {
      this.common.showError("Please Enter Password");
      return;
    } else {
      let params = {
        url: this.gpsDetails.url,
        userName: this.gpsDetails.userName,
        password: this.gpsDetails.passWord,
        rowId:this.rowId
      }
      if (this.rowId) {
        this.common.loading++;
        this.api.post('GpsData/updateMvGpsDetails', params)
          .subscribe(res => {
            --this.common.loading;
            this.activeModel.close({ response: true });
          },
            err => {
              --this.common.loading;
              console.error(' Api Error:', err)
            });
      } else {
        this.common.loading++;
        this.api.post('GpsData/saveMvGpsDetails', params)
          .subscribe(res => {
            --this.common.loading;
            this.activeModel.close({ response: true });
          },
            err => {
              --this.common.loading;
              console.error(' Api Error:', err)
            });
      }

    }


  }

}
