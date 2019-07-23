import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {
  dataPerson=[];
  id=null;
  show_dialog=false;
  driver = {
    licencePhoto:null,
    adharPhoto:null,
    photo:null
  };
  show_aadhar=false;
  show_pan=false;
  aadharData=null; 
  panData=null;
  licenceData=null;
  searchId=null;

   constructor(public api:ApiService,
    public activeModal:NgbActiveModal,
    public common:CommonService) { 
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.api.get("Suggestion/getDriverDocList")
    .subscribe(
      res => {
        this.dataPerson = res['data']
        console.log("autosugg", this.dataPerson);
        this.aadharData=this.dataPerson[0]
        this.panData=this.dataPerson[1]
        this.licenceData=this.dataPerson[2]
        console.log("data",this.licenceData)

        
        // this.dataPerson.


      }
    )
  }

  closeModal() {
    this.activeModal.close();
  }


  proveUpload(){

  }

  getList(event) {
    this.searchId = event.target.value;
    console.log("event", this.searchId);
  }

  getInformation(){
    if(this.searchId == 1){
      this.show_aadhar=true;

    }
    else if (this.searchId == 2){
      this.show_aadhar=false;
      this.show_pan=true;

    }
    else 
    {
      this.show_dialog=true;
      this.show_aadhar=false;
      this.show_pan=false;
    }
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

        console.log('Base 64: ', res);
        if (index == 1) {
          this.driver.licencePhoto = res;
        }
        if (index == 2) {
          this.driver.adharPhoto = res;
        }
        if (index == 3) {

          this.driver.photo = res;
        }
        // this.driver.lisencephoto = { 'image'+ index: res };

        // console.log('photos', this.driver.lisencephoto);
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }
}
