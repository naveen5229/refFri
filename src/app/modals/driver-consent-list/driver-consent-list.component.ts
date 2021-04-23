import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'driver-consent-list',
  templateUrl: './driver-consent-list.component.html',
  styleUrls: ['./driver-consent-list.component.scss']
})
export class DriverConsentListComponent implements OnInit {

  driverConsentList = [];
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public activeModal: NgbActiveModal,
    private common: CommonService,
    private api: ApiService) {
    this.getDriverConsentList();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit(): void {
  }

  refresh() {
    this.getDriverConsentList();
  }


  closeModal() {
    this.activeModal.close({ response: true });
  }

  getDriverConsentList() {
    this.driverConsentList = [];
    let response;
    this.common.loading++;
    this.api.getJavaPortDost(8083, 'simdataconsent/drivermapping')
      .subscribe(res => {
        this.common.loading--;
        this.driverConsentList = res['data'];
        this.setConsentTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  setConsentTable() {
    this.table.data = {
      headings: this.generateHeadingsNormal(),
      columns: this.getTableColumnsNormal(),
    };
    return true;
  }

  generateHeadingsNormal() {
    let headings = {
      empName: { title: 'Driver', placeholder: 'Driver' },
      mobileNo: { title: 'Mobile No', placeholder: 'Mobile No' },
      status: { title: 'Status', placeholder: 'Status' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return headings;
  }

  getTableColumnsNormal() {
    let columns = [];
    this.driverConsentList.map((consent) => {
      let column = {};
      let consentStatus = [];
      consentStatus = consent['status'];
      let actionIcon = this.statusActionIcons(consentStatus, consent);
      for (let key in this.generateHeadingsNormal()) {
        if (key === 'empName') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'mobileNo') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'status') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else {
          column['action'] = { value: "", isHTML: true, action: null, icons: actionIcon };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  statusActionIcons(type, consent) {
    if (type === 'PENDING') {
      return this.actionIconsPending(consent);
    } else if (type === 'ALLOWED') {
      return
    } else {
      return this.actionIconNull(consent);
    }
  }

  actionIconsPending(consent) {
    let icons = [
      {
        class: "fas fa-user-check",
        action: this.simDataConsentVerify.bind(this, consent),
        txt: "",
        title: null,
      },
    ]
    return icons;
  }

  actionIconNull(consent) {
    let icons = [
      {
        class: "fas fa-share-square",
        action: this.simDataConsentSend.bind(this, consent),
        txt: "",
        title: null,
      },
    ]
    return icons;
  }

  simDataConsentVerify(consent) {
    this.common.loading++;
    this.api.getJavaPortDost(8083, `simdataconsent/verify/${consent['id']}`)
      .subscribe((res) => {
        this.common.loading--;
        console.log('response is: ', res);
        this.common.showToast(res['message']);
        this.refresh();
      },
        err => {
          this.common.loading--;
          console.log('error is:', err);

        });
  }

  simDataConsentSend(consent) {
    console.log('consent is :', consent);

    this.common.loading++;
    this.api.getJavaPortDost(8083, `simdataconsent/send/${consent['driverId']}`)
      .subscribe(res => {
        this.common.loading--;
        console.log('response is :', res);
        this.common.showToast(res['message'])
        this.refresh();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
