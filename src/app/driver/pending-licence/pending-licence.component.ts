import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { MapService } from '../../services/map.service';
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
    private modalService: NgbModal,
    private mapService: MapService) {
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
    let params = { x_user_id: this.user._details.id, x_admin: 1, x_advreview: 0 };
    if (this.listtype == 1) {
      params = { x_user_id: this.user._details.id, x_admin: 1, x_advreview: 1 };
    }
    this.api.post('Drivers/getPendingLicenceList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.columns = [];
        if (this.data.length) {
          for (var key in this.data[0]) {
            if (key.charAt(0) != "_")
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
        latitude: null,
        longitude: null
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
    setTimeout(() =>{
      console.log('--------------Address:', "address-" + modal);
      this.mapService.autoSuggestion("address-" + modal, (place, lat, lng) => {
        console.log('---------------------------- Test ------------');
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
  
        this.modal[modal].data.driver.address = place;
        this.modal[modal].data.driver.latitude = lat;
        this.modal[modal].data.driver.longitude = lng;
      });
    }, 5000)
    

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
        this.modal[modal].data.driver.empname = res['data'][0].empname;
        this.modal[modal].data.driver.newlicenceno = res['data'][0].licence_no;
        this.modal[modal].data.driver.licence_photo = res["data"][0].licence_photo;
        this.modal[modal].data.driver.remarks = res["data"][0].remarks;
        this.modal[modal].data.driver.review = res["data"][0].reviewcount;
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

  checkDatePattern(strdate) {
    let dateformat = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (dateformat.test(strdate)) {
      return true;
    } else {
      return false;
    }
  }

  checkExpiryDateValidityByValue(flddate, expdate, modal) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    console.log("comparing " + flddate + "-" + expdate);
    let d1 = new Date(flddate);
    let d2 = new Date(expdate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      this.common.showError("Invalid Date. Date formats should be DD/MM/YYYY");
      return 0;
    }
    if (d1 > d2) {
      this.modal[modal].data.spnexpdt = 1;
      return 0;
    }
    return 1;
  }

  validateLicenceno(elt) {
    let strval = elt.target.value;
    elt.target.value = (strval.replace(" ", "")).toUpperCase();
  }

  updateDocument(modal, status?, confirm?) {
    console.log('Test');
    console.log(this.modal[modal].data.driver.lcv);
    console.log('mcv');
    console.log(this.modal[modal].data.driver.mcv);
    console.log('hcv');

    console.log(this.modal[modal].data.driver.hcv);
    if (this.user._loggedInBy == 'admin' && this.modal[modal].data.canUpdate == 1) {
      let driver = this.modal[modal].data.driver;
      let lctype = '';
      if (driver.lcv == true) {
        lctype = 'LCV';
      }
      if (driver.mcv == true) {
        if (lctype)
          lctype = lctype + ',MCV';
        else
          lctype = 'MCV';
      }
      if (driver.hcv == true) {
        if (lctype)
          lctype = lctype + ',HCV';
        else
          lctype = 'HCV';
      }
      const params = {
        x_user_id: this.user._details.id,
        x_licence_no: driver.newlicenceno.toUpperCase(),
        x_advreview: status || 0,
        x_driver_id: driver.id,
        x_driver_name: driver.newempname,
        x_effective_date: driver.x_effective_date,
        x_expiry_date: driver.expiry_date,
        x_nt_expiry_date: driver.ntexpiry_date,
        x_dob: driver.dob,
        x_licence_type: lctype,
        x_address: driver.address,
        x_remarks: driver.remarks,
        x_latitude: driver.latitude,
        x_longitude: driver.longitude
      };
      console.log("Id is", params);

      if (driver.effective_date) {
        let valid = this.checkDatePattern(driver.effective_date);
        if (!valid) {
          this.common.showError("Invalid Effective Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (driver.expiry_date) {
        let valid = this.checkDatePattern(driver.expiry_date);
        if (!valid) {
          this.common.showError("Invalid Expiry Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }
      if (driver.ntexpiry_date) {
        let valid = this.checkDatePattern(driver.ntexpiry_date);
        if (!valid) {
          this.common.showError("Invalid NT Expiry Date. Date must be in DD/MM/YYYY format");
          return false;
        }
      }

      let expdt_valid = 1;
      let ntexpdt_valid = 1;
      if (driver.effective_date != "undefined" && driver.expiry_date != "undefined") {
        if (driver.effective_date && driver.expiry_date)
          expdt_valid = this.checkExpiryDateValidityByValue(driver.effective_date, driver.expiry_date, modal);
      }
      if (driver.effective_date != "undefined" && driver.ntexpiry_date != "undefined") {
        if (driver.effective_date && driver.ntexpiry_date)
          ntexpdt_valid = this.checkExpiryDateValidityByValue(driver.effective_date, driver.ntexpiry_date, modal);
      }
      if (expdt_valid && ntexpdt_valid) {
        this.modal[modal].data.spnexpdt = 0;
      } else {
        this.modal[modal].data.spnexpdt = 1;
      }

      if (this.modal[modal].data.spnexpdt) {
        this.common.showError("Please check the Expiry Date/NT Expiry Date validity");
        return false;
      }

      if (driver.effective_date) {
        params.x_effective_date = driver.effective_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_effective_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Effective Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (driver.expiry_date) {
        params.x_expiry_date = driver.expiry_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_expiry_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid Expiry Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (driver.ntexpiry_date) {
        params.x_nt_expiry_date = driver.ntexpiry_date.split("/").reverse().join("-");
        let strdt = new Date(params.x_expiry_date);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid NT Expiry Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }
      if (driver.dob) {
        params.x_dob = driver.dob.split("/").reverse().join("-");
        let strdt = new Date(params.x_dob);
        if (isNaN(strdt.getTime())) {
          this.common.showError("Invalid DOB Date. Date formats should be DD/MM/YYYY");
          return false;
        }
      }

      console.log("api params:");
      console.log(params);

      this.common.loading++;
      let response = '';

      this.api.post('Drivers/updateDLDetails', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("api result", res);
          let result = (res['msg']);
          if (result == "success") {
            alert("Success");
            this.closeModal(true, modal);
          }
          else if (res['code'] != -2) {

            alert(result);

          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });

      return response;
    }

  }

  getDate(date, modal) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        let strdate = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        this.modal[modal].data.driver[date] = this.getDateInDisplayFormat(strdate);
        console.log('Date:', this.modal[modal].data.driver[date]);
      }
    });
  }

  setDate(date, modal) {
    console.log("fetch Date", date);
    this.modal[modal].data.driver[date] = this.common.dateFormatter(this.modal[modal].data.driver[date], 'ddMMYYYY').split(' ')[0];
    console.log('Date:', this.modal[modal].data.driver[date]);
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
  }

  deleteImage(id, modal) {
    let remark;
      let ret = confirm("Are you sure you want to discard this image?");
      if (ret) {
        this.common.params = { RemarkModalComponent, title: 'Discard Image' };

        const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
        activeModal.result.then(data => {
          if (data.response) {
            console.log("Remarks: ", data.remark);
            remark = data.remark;
            this.common.loading++;
            this.api.post('Drivers/deleteDriverById', { x_driver_id: id, x_remarks: remark, x_user_id: this.user._details.id, x_deldrv: 0 })
              .subscribe(res => {
                this.common.loading--;
                console.log("data", res);
                this.closeModal(true, modal);
                this.common.showToast("Successfully Deleted");
              }, err => {
                this.common.loading--;
                console.log(err);

              });
              
          }
        })
      }
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
