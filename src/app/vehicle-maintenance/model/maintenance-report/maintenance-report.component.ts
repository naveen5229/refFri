import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'maintenance-report',
  templateUrl: './maintenance-report.component.html',
  styleUrls: ['./maintenance-report.component.scss'],
  providers: [DatePipe]
})
export class MaintenanceReportComponent implements OnInit {


  title = '';
  data = [];
  fodata = [];

  reportData = {
    id: null,
    status: '',
  };
  selectedVehicle = null;
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};


  constructor(public api: ApiService,
    private datePipe: DatePipe,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.title = this.common.params.title;
    this.reportData.status = this.common.params.status;
    console.info("report data", this.reportData);

    this.getReport();
    // /this.getTableColumns();

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  printPDF(tblEltId) {
    //  this.common.loading++;
    //  let userid = this.user._customer.id;
    //  if (this.user._loggedInBy == "customer")
    //    userid = this.user._details.id;
    //  this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
    //    .subscribe(res => {
    //      this.common.loading--;
    //      this.fodata = res['data'];
    //      let left_heading = this.fodata['name'];
    //      let strstatus = this.reportData.status.toUpperCase();
    //      switch (strstatus) {
    //        case 'VERIFIED': strstatus = 'VERIFIED DOCUMENTS'; break;
    //        case 'UNVERIFIED': strstatus = 'UNVERIFIED DOCUMENTS'; break;
    //        case 'PENDINGIMAGE': strstatus = 'PENDING IMAGES'; break;
    //        case 'EXPIRING30DAYS': strstatus = 'DOCUMENTS EXPIRING IN 30 DAYS'; break;
    //        case 'EXPIRED': strstatus = 'EXPIRED DOCUMENTS'; break;
    //        case 'PENDINGDOC': strstatus = 'PENDING DOCUMENTS'; break;
    //        default: break;
    //      }
    //      let center_heading = strstatus;
    //      this.common.getPDFFromTableId(tblEltId, left_heading, center_heading);
    //    }, err => {
    //      this.common.loading--;
    //      console.log(err);
    //    });
  }



  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      console.log("Doc Data:", doc);
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };


      }


      columns.push(this.valobj);
    });
    return columns;
  }




  //  add(row) {
  //    console.log("row Data:", row);
  //    this.common.params = { row, title: 'Upload Image' };
  //    const activeModal = this.modalService.open(AddDocumentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //    activeModal.result.then(data => {
  //      if (data.response) {
  //        this.closeModal(true);
  //        this.getReport();

  //      }
  //    });
  //  }


  getReport() {
    let params = {
      id: this.common.params.docReoprt.maintenance_type_id,
      reportType: this.reportData.status
    };
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('VehicleMaintenance/getMaintenanceSummaryReports', { reportType: params.reportType, maintTypeId: params.id })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }


  //  imageView(doc) {
  //    console.log("image data", doc);
  //    let images = [{
  //      name: "image",
  //      image: doc._imgurl1
  //    },
  //    {
  //      name: "image",
  //      image: doc._imgurl2
  //    },
  //    {
  //      name: "image",
  //      image: doc._imgurl3
  //    }
  //    ];
  //    console.log("images:", images);
  //    if (this.checkForPdf(images[0].image)) {
  //      window.open(images[0].image);
  //      return;
  //    }
  //    this.common.params = { images, title: 'Image' };
  //    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  //  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }


}