import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss','../../../pages/pages.component.css']
})
export class ImportDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';

  upload = {
    csv:null,
    foid:''
  };
  csv = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal  ) { 
      this.title = this.common.params.title;
      this.btn1 = this.common.params.btn1 || 'Add';
      this.btn2 = this.common.params.btn2 || 'Cancel';
    }

  ngOnInit() {
  }
  
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  onSelected(data) {
    let id= '';
     console.log("Data",data);
      id = data.id;
     console.log('upload data: ',id);
     this.upload.foid = id;
     console.log(' new upload data: ',this.upload.foid);
     return this.upload.foid;
   }
  uploadCsv(){
    const params = {
      vehicleDocCsv:this.csv,
      foid:this.upload.foid
    };
    console.log("Data :",params);
    this.common.loading++;
    this.api.post('Vehicles/ImportVehicleDocumentCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        // this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  
   
    handleFileSelection(event) {
      this.common.loading++;
      this.common.getBase64(event.target.files[0])
        .then(res => {
          this.common.loading--;
         
          res = res.toString().replace('vnd.ms-excel','csv');
          console.log('Base 64: ', res);
          this.csv = res;
        }, err => {
          this.common.loading--;
          console.error('Base Err: ', err);
        })
    }
  
  
}
