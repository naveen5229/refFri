import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
      this.sampleURL =  this.common.params.sampleURL?this.common.params.sampleURL:null;
  }

  ngOnInit() {
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

