import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
file = null;
fileType =null;
sampleURL = null;
  constructor(public api: ApiService,
    public common: CommonService,
    private activeModal: NgbActiveModal) {
      if(this.common.params){
      this.sampleURL =  this.common.params.sampleURL?this.common.params.sampleURL:null;
      }
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  
  ngAfterViewInit(){
    
    if(this.common.params){
      console.log("this.common.params.sampleURL",this.common.params.sampleURL);
    this.sampleURL =  this.common.params.sampleURL?this.common.params.sampleURL:null;
    }
  }
  closeModal(response) {
    this.activeModal.close({ response: response,file:this.file,fileType:this.fileType });
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
       
        console.log('Base 64: ', res);
        this.file=res;
        this.fileType = file.type;
        // this.driver['image' + index] = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  sampleCsv() {
    window.open(this.sampleURL);
  }
}

