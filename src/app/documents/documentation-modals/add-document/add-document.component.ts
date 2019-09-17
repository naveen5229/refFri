import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { from } from 'rxjs';
import { DropDownListComponent } from '../drop-down-list/drop-down-list.component';
@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss', '../../../pages/pages.component.css']
})
export class AddDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  vehicleId = '';
  spnexpdt = 0;
  // for report model
  updateimage = 0;
  docId = null;
  vehicleid = null;
  docTypeid = null;
  docType = null;
  regno = null;

  document = {
    image1: null,
    image2: null,
    image3: null,
    base64Image: null,

    type: {
      id: '',
      name: ''
    },
    dates: {
      issue: null,
      wef: null,
      expiry: null
    },
    number: '',
    remark: '',
    rto: '',
    agent: {
      id: '',
      name: '',
    },
    amount: '',
  }

  agents = [];
  docTypes = [];
  vehicle = null;
  isFormSubmit = false;
  ignore = 0;

  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Add Document';
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicleId = this.common.params.vehicleId;
    if (this.common.params.row) {
      this.updateimage = 1;
      this.regno = this.common.params.row.Vehicle;
      this.docId = this.common.params.row._docid;
      this.vehicleid = this.common.params.row._vid;
      this.docType = this.common.params.row._docname;
      this.docTypeid = this.common.params.row._doctypeid;
    }

    if (this.common.params.norecordData) {
      this.ignore = 1;
      this.regno = this.common.params.norecordData.vehicle;
      this.vehicleId = this.common.params.norecordData._vid;
      this.docType = this.common.params.col;
      this.docTypeid = this.common.params.colval;
    }

    if (this.document.dates.issue)
      this.document.dates.issue = this.common.dateFormatter(this.document.dates.issue, 'ddMMYYYY').split(' ')[0];
    if (this.document.dates.wef)
      this.document.dates.wef = this.common.dateFormatter(this.document.dates.wef, 'ddMMYYYY').split(' ')[0];
    if (this.document.dates.expiry)
      this.document.dates.expiry = this.common.dateFormatter(this.document.dates.expiry, 'ddMMYYYY').split(' ')[0];
    this.getDocumentsData();
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getDocumentsData() {
    this.common.loading++;
    let response;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
      .subscribe(res => {
        this.common.loading--;
        this.vehicle = res['data'].vehicle_info[0];
        this.docTypes = res['data'].document_types_info;
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  handleFileSelection(event, index) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        let file = event.target.files[0];
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

        this.document['image' + index] = res;
        this.compressImage(res, index);
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  compressImage(base64Image, index) {
    let image = new Image();
    image.onload = () => {
      // Resize the image using canvas  
      let canvas = document.createElement('canvas'),
        max_size = 1504,// TODO : max size for a pic  
        width = image.width,
        height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);

      //Getting base64 string; 
      //this.images[index].base64 = canvas.toDataURL('image/jpeg').split(",")[1];      
      this.document['image' + index] = canvas.toDataURL('image/jpeg');
    }
    image.src = base64Image;
  }




  checkExpiryDateValidity() {
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.dates.issue != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.issue && this.document.dates.expiry)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.dates.issue, this.document.dates.expiry);
    }
    if (this.document.dates.wef != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.wef && this.document.dates.expiry)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.dates.wef, this.document.dates.expiry);
    }
    if (!issuedt_valid || !wefdt_valid) {
      this.common.showError("Please check the Expiry Date validity");
    }
  }

  checkExpiryDateValidityByValue(flddate, expdate) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    let d1 = new Date(flddate);
    let d2 = new Date(expdate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      this.common.showError("Invalid Date. Date formats should be dd/mm/yyyy");
      return 0;
    }
    if (d1 > d2) {
      this.spnexpdt = 1;
      return 0;
    }
    return 1;
  }

  addDocument() {
    if (this.docId) {
      const params = {
        x_entryby: this.user._details.id,
        x_document_id: this.docId,
        x_vehicle_id: this.vehicleid,
        x_document_type_id: this.docTypeid,
        x_document_type: this.docType,
        x_base64img: this.document.image1,
        x_base64img2: this.document.image2,
        x_base64img3: this.document.image3,
      };

      if (!this.document.image1 && !this.document.image2 && !this.document.image3) {
        return this.common.showError("Select Document Image/File");
      }
      this.common.loading++;
      this.api.post('Vehicles/addVehicleDocumentWeb', params)
        .subscribe(res => {
          this.common.loading--;
          let result = res["msg"];
          if (result == "success") {
            this.common.showToast("Success");
            this.closeModal(true);
          }
          else {
            alert(result);

          }

        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
    else {
      const params = {
        x_entryby: this.user._details.id,
        x_vehicle_id: this.vehicle.id,
        x_document_type_id: this.document.type.id,
        x_document_type: this.findDocumentType(this.document.type.id),
        x_base64img: this.document.image1,
        x_base64img2: this.document.image2,
        x_base64img3: this.document.image3,
      };
      if (!this.document.image1 && !this.document.image2 && !this.document.image3) {
        return this.common.showError("Select Document Image/File");
      }
      this.common.loading++;
      this.api.post('Vehicles/addVehicleDocumentWeb', params)
        .subscribe(res => {
          this.common.loading--;
          let result = res["msg"];
          if (result == "success") {
            this.common.showToast("Success");
            this.closeModal(true);
          }
          else {
            alert(result);
          }

        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }


  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document.dates[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
      }
    });
  }

  findDocumentType(id) {
    let documentType = '';
    this.docTypes.map(docType => {
      if (docType.id == id) {
        documentType = docType.document_type
      }
    });
    return documentType;
  }

  // addAgent() {
  //   this.common.params = { title: 'Add Agent' };
  //   const activeModal = this.modalService.open(AddAgentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.getDocumentsData();
  //     }
  //   });
  // }

  selectDocType(docType) {
    this.document.type.id = docType.id
  }

  checkDateFormat(dateType) {
    let dateValue = this.document.dates[dateType];
    if (dateValue.length < 8) return;
    let date = dateValue[0] + dateValue[1];
    let month = dateValue[2] + dateValue[3];
    let year = dateValue.substring(4, 8);
    this.document.dates[dateType] = date + '/' + month + '/' + year;
    console.log('Date: ', this.document.dates[dateType]);
  }

  ignoreDoc() {
    if (this.docTypeid || this.document.type.id) {
      const ignoreData = {
        x_entryby: this.user._details.id,
        x_vehicle_id: this.vehicleId,
        x_document_type_id: this.document.type.id ? this.document.type.id : this.docTypeid,
        x_document_type: this.document.type.id ? this.findDocumentType(this.document.type.id) : this.docType,

      };
      this.common.params = { title: 'ignore Reason', ignoreData };
      const activeModal = this.modalService.open(DropDownListComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          this.returnIgnoreData(data.response, data.record);
        }
      });
    }
    else {
      this.common.showToast("select Document Type");
    }
  }


  returnIgnoreData(ignoreReason, record) {
    const params = {
      x_remarks: ignoreReason.name,
      x_vehicle_id: record.x_vehicle_id,
      x_document_type_id: record.x_document_type_id,

    };
    this.common.loading++;
    this.api.post('vehicles/saveIgnoreVehicleDocument', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.closeModal(true);
        }
        else {
          this.common.showError(res['msg']);
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
}