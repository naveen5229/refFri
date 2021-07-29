import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { CsvService } from '../../services/csv/csv.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDriverCompleteComponent } from '../../modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { ImportDocumentComponent } from '../../documents/documentation-modals/import-document/import-document.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { ExcelService } from '../../services/excel/excel.service';
@Component({
  selector: 'driver-preferences',
  templateUrl: './driver-preferences.component.html',
  styleUrls: ['./driver-preferences.component.scss']
})
export class DriverPreferencesComponent implements OnInit {
  driverConsentList = [];
  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true
    }
  };

  tableHeadings;

  constructor(
    private common: CommonService,
    private csvService: CsvService,
    public pdfService: PdfService,
    private modalService: NgbModal,
    public user: UserService,
    public excelService: ExcelService,
    private api: ApiService) {
    this.getDriverConsentList();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit(): void {
  }

  refresh() {
    this.getDriverConsentList();
  }


  getDriverConsentList() {
    this.driverConsentList = [];
    let response;
    this.common.loading++;
    this.api.getJavaPortDost(8083, 'simdataconsent/drivermapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('response is: ', res);

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
      regNo: { title: 'Reg No', placeholder: 'Reg No' },
      mobileNo: { title: 'Mobile No', placeholder: 'Mobile No' },
      mobileNo2: { title: 'Mobile No', placeholder: 'Mobile No 2' },
      status: { title: 'Status', placeholder: 'Status' },
      pendingTime: { title: 'Start Time', placeholder: 'Start Time' },
      expireTime: { title: 'Expire Time', placeholder: 'Expire Time' },
      isActive: { title: 'isActive', placeholder: 'isActive' },
      modes: { title: 'Modes', placeholder: 'Modes' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };

    this.tableHeadings = headings;
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
        } else if (key === 'regNo') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'mobileNo') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'mobileNo2') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'status') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else if (key === 'pendingTime') {
          column[key] = { value: consent[key] ? this.common.dateFormatter(consent[key]) : '', class: "black", action: "" };
        } else if (key === 'expireTime') {
          column[key] = { value: consent[key] ? this.common.dateFormatter(consent[key]) : '', class: "black", action: "" };
        } else if (key === 'isActive') {
          column[key] = { value: "", isHTML: true, action: null, icons: this.isActiveIcon(consent['isActive']) };
        } else if (key === 'modes') {
          column[key] = { value: consent[key], class: "black", action: "" };
        } else {
          column['action'] = { value: "", isHTML: true, action: null, icons: actionIcon };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  isActiveIcon(isActive) {
    console.log('isActive', isActive)
    let icons = []
    if (isActive == true) {
      icons = [
        {
          class: "fa fa-check",
          action: '',
          txt: "",
          title: null,
        },
      ]
    } else if (isActive == false) {
      icons = [
        {
          class: "fa fa-times",
          action: '',
          txt: "",
          title: null,
        },
      ]
    }
    return icons
  }

  statusActionIcons(type, consent) {
    if (type === 'PENDING') {
      return this.actionIconsPending(consent);
    } else if (type === 'ALLOWED') {
      return this.actionIconsPending(consent);
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

    this.enableDisableActionIcon(consent, icons);

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
    this.enableDisableActionIcon(consent, icons);
    return icons;
  }

  enableDisableActionIcon(consent, icons) {
    if (consent['isActive'] == true) {
      icons.push(
        {
          class: "fa fa-window-close ml-2",
          action: this.enableDisableConsentData.bind(this, consent, false),
          txt: "",
          title: null,
        }
      )
    } else if (consent['isActive'] == false) {
      icons.push(
        {
          class: "fa fa-check-square ml-2",
          action: this.enableDisableConsentData.bind(this, consent, true),
          txt: "",
          title: null,
        }
      )
    }
  }

  enableDisableConsentData(consent, value) {
    let params = {
      id: consent['id'],
      data: value
    }
    this.common.loading++;
    this.api.postJavaPortDost(8083, `simdataconsent/activate/${params.id}/${params.data}`, null)
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

  importDriverCSV() {
    this.common.params = { title: 'Bulk Import Driver', };
    const activeModal = this.modalService.open(ImportDocumentComponent, { container: 'nb-layout', backdrop: 'static' });
  }

  addDriver() {
    const activeModal = this.modalService.open(AddDriverCompleteComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDriverConsentList();
      }
    })
  }


  printPDF() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:", name);
    let details = [
      ['Name: ' + name, 'Report: ' + 'Driver-Preference-List']
    ];
    this.pdfService.jrxTablesPDF(['driverConsentList'], 'driverConsentList', details);
  }

  printCSV() {
    let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    let details = [
      {
        name: name,
      }
    ];
    // this.csvService.byMultiIds(['driverConsentList'], 'driverConsentList', details);


    let headersArray = ["Driver", "Reg No", "Mobile No1", "Mobile No2", "Status", "Start Time", "Expire Time", "isActive", "Modes"];
    let json = this.driverConsentList.map(challan => {
      return {
        "Driver": challan['empName'],
        "Reg No": challan['regNo'],
        "Mobile No1": challan['mobileNo'],
        "Mobile No2": challan['mobileNo2'],
        "Status": challan['status'],
        "Start Time": challan['pendingTime'],
        "Expire Time": challan['expireTime'],
        "isActive": challan['isActive'],
        "Modes": challan['modes'],
      };
    });

    // this.common.getCSVFromDataArray(this.tableHeadings, this.driverConsentList, 'Driver-Prefrence', details)

    this.excelService.dkgExcel("Driver Prefrence", details, headersArray, json, 'Driver Prefrence', false);
  }


}
