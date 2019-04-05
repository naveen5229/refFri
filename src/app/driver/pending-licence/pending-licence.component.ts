import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { from } from 'rxjs';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { PendingLicenceDetailComponent } from '../../modals/pending-licence-detail/pending-licence-detail.component';

@Component({
  selector: 'pending-licence',
  templateUrl: './pending-licence.component.html',
  styleUrls: ['./pending-licence.component.scss']
})
export class PendingLicenceComponent implements OnInit {
  data = [];
  userdata = [];
  columns = [];
  columns2 = [];
  listtype = 0;
  modal = {
    active: '',
    first: {
      show: false,
      class: '',
      data: this.setModalData()
    },
    second: {
      show: false,
      class: '',
      data: this.setModalData()
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      this.getPendingLicences();
      this.common.refresh = this.refresh.bind(this);
    }

  ngOnInit() {
  }

  refresh() {
    window.location.reload();
  }

  selectList(id) {
    this.listtype = parseInt(id);
    this.getPendingLicences();        
  }

  getPendingLicences() {
    this.common.loading++;
    let params = { x_user_id : this.user._details.id, x_admin: 1, x_advreview: 0};
    if(this.listtype == 1) {
      params = { x_user_id : this.user._details.id, x_admin: 1, x_advreview: 1};
    }
    this.api.post('Drivers/getPendingLicenceList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.columns = [];
        if(this.data.length) {
          for(var key in this.data[0]) {
            if(key.charAt(0) != "_")
              this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setModalData() {
    return {
      title: '',
      btn1: '',
      btn2: '',
      imageViewerId: (new Date()).getTime(),
      canUpdate: 1,
      canreadonly: false,
      spnexpdt: 0,
      current_date: new Date(),
      images: [],
      imgs: [],
      doc_not_img: 0,
      driver: {
        id: null,
        empname: null,
        licence_photo: null,
        licence_no: null,
        newlicenceno: null,
        expiry_date: null,
        effective_date: null,
        ntexpiry_date: null,
        licence_type: null,
        lcv: null,
        mcv: null,
        hcv: null,
        remarks: null,
        dob: null,
      },
    }
  }

  showDetails(row) {
    /*
    let rowData = [];
    
    this.common.loading++;
    this.api.post('Drivers/getPendingLicenceDetail', { x_user_id: this.user._details.id, x_driver_id: row._drvid, x_advreview: this.listtype })
      .subscribe(res => {
        this.common.loading--;
        if(res['success'] && res['data'].length) {
          rowData = res['data'][0];
        }
        
        this.common.params = { rowData, title: 'License Details', canUpdate: 1};
        this.common.handleModalSize('class', 'modal-lg', '1200');
        const activeModal = this.modalService.open(PendingLicenceDetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
            activeModal.result.then(mdldata => {
              console.log("response:", mdldata);
            });
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    */
   let rowData = {
      id: row._drvid
    };
    console.log("Model Doc Id:", rowData.id);
    this.modalOpenHandling({ rowData, title: 'Update Licence Details', canUpdate: 1 });
  }

  modalOpenHandling(params) {
    console.log('Handler Start: ', this.modal.active);
    if (!this.modal.active) {
      this.modal.first.class = 'custom-active-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.active = 'first';
    } else if (this.modal.active == 'first') {
      this.modal.second.class = 'custom-passive-modal';
      this.modal.second.show = true;
      this.handleModalData('second', params);
      this.modal.active = 'first';
    } else if (this.modal.active == 'second') {
      this.modal.first.class = 'custom-passive-modal';
      this.modal.first.show = true;
      this.handleModalData('first', params);
      this.modal.active = 'second';
    }
    console.log('Handler End: ', this.modal.active);
  }

  handleModalData(modal, params) {
    this.modal[modal].data.title = params.title;
    this.modal[modal].data.btn1 = params.btn1 || 'Update';
    this.modal[modal].data.btn2 = params.btn2 || 'Discard Image';

    if (!params.canUpdate) {
      this.modal[modal].data.canUpdate = 0;
      this.modal[modal].data.canreadonly = true;
    }

    this.modal[modal].data.driver = params.rowData;
    if (this.modal[modal].data.driver.effective_date)
      this.modal[modal].data.driver.effective_date = this.common.dateFormatter(this.modal[modal].data.driver.effective_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.driver.expiry_date)
      this.modal[modal].data.driver.expiry_date = this.common.dateFormatter(this.modal[modal].data.driver.expiry_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.driver.ntexpiry_date)
      this.modal[modal].data.driver.ntexpiry_date = this.common.dateFormatter(this.modal[modal].data.driver.ntexpiry_date, 'ddMMYYYY').split(' ')[0];
    if (this.modal[modal].data.driver.dob)
      this.modal[modal].data.driver.dob = this.common.dateFormatter(this.modal[modal].data.driver.dob, 'ddMMYYYY').split(' ')[0];

    this.modal[modal].data.imgs = [];
    if (this.modal[modal].data.driver.licence_photo != "undefined" && this.modal[modal].data.driver.licence_photo) {
      this.modal[modal].data.imgs.push(this.modal[modal].data.driver.licence_photo);
    }
    this.modal[modal].data.images = this.modal[modal].data.imgs;

    this.getPendingDLDetail(modal);
    // this.getDocumentsData(modal);
  }

  getPendingDLDetail(modal) {
    const params = {
      x_user_id: this.user._details.id,
      x_driver_id: this.modal[modal].data.driver.id,
      x_advreview: this.listtype
    }
    console.log('Params: ', params);
    this.api.post('Drivers/getPendingLicenceDetail', params)
      .subscribe(res => {
        console.log("pending details:", res);
        this.modal[modal].data.driver.id = res['data'][0].driver_id;
        this.modal[modal].data.driver.newlicenceno = res['data'][0].licence_no;
        this.modal[modal].data.driver.licence_photo = res["data"][0].licence_photo;
        this.modal[modal].data.driver.remarks = res["data"][0].remarks;
        //this.modal[modal].data.driver.review = res["data"][0].reviewcount;
        this.modal[modal].data.images = [];
        if (this.modal[modal].data.driver.licence_photo != "undefined" && this.modal[modal].data.driver.licence_photo) {
          this.modal[modal].data.images.push(this.modal[modal].data.driver.licence_photo);
        }
        if (res["msg"] != "success") {
          alert(res["msg"]);
          this.closeModal(true, modal);
          console.log("sucess......");
        }

      }, err => {
        // this.common.loading--;
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  deleteDocument(row) {
    let remark;
    let ret = confirm("Are you sure you want to delete this Driver Record?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete Driver Record' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("reason For delete: ", data.remark);
          remark = data.remark;
          /*
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: row._docid, x_remarks: remark, x_user_id: this.user._details.id, x_deldoc: 1 })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
              this.columns = [];
              //this.getPendingDetailsDocuments();
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);
              //this.getPendingDetailsDocuments();
            });
          */
        }
      })
    }
  }

  closeModal(option, modal) {
    if (this.modal.first.show && this.modal.second.show) {
      if (modal == 'first') {
        this.modal.first.show = false;
        this.modal.second.class = 'custom-active-modal';
        this.modal.first.data = this.setModalData();
        this.modal.active = 'second';
      } else {
        this.modal.second.show = false;
        this.modal.first.class = 'custom-active-modal';
        this.modal.second.data = this.setModalData();
        this.modal.active = 'first';
      }
    } else {
      this.modal.active = '';
      this.modal[modal].show = false;
      this.modal[modal].class = '';
      this.modal[modal].data = this.setModalData();
    }

  }

  customerByUpdate(modal) {
    
  }

  updateDocument(modal, status?, confirm?) {
  }

  getDate(date, modal) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.modal[modal].data.driver[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('Date:', this.modal[modal].data.driver[date]);
      }
    });
  }

  setDate(date, modal) {
    console.log("fetch Date", date);
    this.modal[modal].data.document[date] = this.common.dateFormatter(this.modal[modal].data.driver[date], 'ddMMYYYY').split(' ')[0];
    console.log('Date:', this.modal[modal].data.document[date]);
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
  }

  deleteImage(id, modal) {

  }

  openNextModal(modal) {
    this.showDetails({ _drvid: 0 });

  }

  checkDateFormat(modal, dateType) {
    let dateValue = this.modal[modal].data.driver[dateType];
    if (dateValue.length < 8) return;
    let date = dateValue[0] + dateValue[1];
    let month = dateValue[2] + dateValue[3];
    let year = dateValue.substring(4, 8);
    this.modal[modal].data.driver[dateType] = date + '/' + month + '/' + year;
    console.log('Date: ', this.modal[modal].data.driver[dateType]);
  }
}
