import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CommonService } from '../../services/common.service';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {
  driverDoc = [];
  docId = '1';
  id = null;
  driverId = null;

  driver = {
    docImage: null,
    expiryDate:null
  };
  photo = null;
  licenseNo = null;
  remark = null;
  panNumber = null;
  aadharNumber = null;
  value = null;
  docNo = null;
  docName = null;
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

  headings = [];
  valobj = {};


  constructor(public api: ApiService,
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getData();
    // this.docId = this.docDet['id'];
    // this.docName = this.docDet['name'];
    if (this.common.params.driver) {
      this.driverId = this.common.params.driver.id;
      this.getdocumentsSummary();

    }
    if (this.common.params.driverId) {
      console.log('idpass', this.common.params.driverId);
      this.driverId = this.common.params.driverId[0].y_id;
      this.getdocumentsSummary();


    }
    if (this.common.params.row || this.common.params.col) {
      // console.log("colvalue:", this.common.params.col);
      //console.log('row', this.common.params.row);
      let feild = this.common.params.col;
      let doctype = feild.split("_");
      this.docId = doctype[0];
      this.driverId = this.common.params.row._driverid;
      this.getdocumentsSummary();


    }


    //console.log('', this.docId);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getData() {
    this.common.loading++;
    this.api.get('Suggestion/getDriverDocList')
      .subscribe(res => {
        this.common.loading--;
        this.driverDoc = res['data'];
        console.log('', this.driverDoc);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close({ response: true });
  }
  backImage(show) {
    this.value = show;
  }

  proveUpload() {
    console.log(this.driver.docImage);
    console.log(this.photo);

    let params = {
      driverId: this.driverId,
      docTypeId: this.docId,
      docTypeName: this.docName,
      docNo: this.docNo,
      img1: this.driver.docImage,
      img2: this.photo,
      remark: this.remark
    }
    if (params.docTypeId == '1') {
      params.docTypeName = "Adhar Card";

    }
    if (params.docTypeId == '2') {
      params.docTypeName = "PAN Card"
    }
    if (params.docTypeId == '3') {
      params.docTypeName = "Driving License"
      params['dlexpdt'] = this.common.dateFormatter(this.driver.expiryDate);
    }
    this.common.loading++;
    this.api.post('Drivers/uploadDocs', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == 1) {
          this.common.showToast(res['msg']);
          this.getdocumentsSummary();
          this.getDocChange();
          this.remark = null;
        }
        else {
          this.common.showError(res['msg']);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getDocChange() {
    this.driver.docImage = null;
    this.remark = null;
    this.driver.expiryDate=null;
    document.getElementById('imageData1')['value'] = '';
    document.getElementById('imageData2')['value'] = '';

    this.docNo = null;
    this.photo = null;
  }
  getList(event) {
    console.log('eventID', event.id);
    this.docId = event.id;
    // console.log("event", this.searchId);
  }


  handleFileSelection(event, index) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
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

        if (index == 1) {
          this.driver.docImage = res;
          console.log('Base 64 index 1: ', this.driver.docImage);
        }

        else if (index == 2) {

          this.photo = res;
          console.log('Base 64 index 2: ', this.photo);
        }

      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }
  getdocumentsSummary() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.data = [];
    this.headings = [];
    this.valobj = {};
    let params = "driverId=" + this.driverId;
    console.log('params', params);
    this.common.loading++;
    this.api.get('Drivers/getDriverDocWrtDocType?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data']['result'] == null) {
          this.data = [];
          this.table = null;
        }
        this.data = res['data']['result'];

        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        // this.showdoughnut();
        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];

    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {

        if (this.headings[i] == "Action") {

          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash', action: this.deleteDocument.bind(this, doc) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }

        this.valobj['View Image'] = { class: '', icons: [{ class: 'fa fa-file', action: this.view.bind(this, doc) }] };

      }
      columns.push(this.valobj);
    });
    return columns;
  }
  deleteDocument(docDetails) {
    let params = {
      urlId: docDetails._url_id,
      docId: docDetails._doc_id
    }
    this.common.loading++;
    this.api.post('Drivers/delDocImage', params)
      .subscribe(res => {
        this.common.loading--;
        // if (res['data'].r_id == 1) {
        this.common.showToast('Document Deleted');
        this.getdocumentsSummary();
        console.log('', this.driverDoc);
        // }
        // else {
        //   this.common.showError(res['data'].r_msg);
        // }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  view(url) {
    let refdata = {
      refid: this.driverId,
      reftype: '52',
      doctype: url._doc_type_id,
      docid : ''
    }
    ;

    this.common.params = { refdata: refdata, title: 'docImage' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });

  }

}



