import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss','../../../pages/pages.component.css']
})
export class ErrorReportComponent implements OnInit {
  title = '';
  btn = '';
  errors = [];
  reason = null;
  bgColor(bgColor){

    return bgColor?bgColor:'white';
  }
  textColor(textColor){
    return textColor?textColor:'black';
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {

      this.common.handleModalSize('class', 'modal-lg', '1024');
      this.title =this.common.params.title || 'Error Report';
      this.btn = this.common.params.btn || 'Close';
      this.errors = this.common.params.errorData;
      this.reason = this.common.params.Reason;

      // this.reason = this.errors.reason;
      console.log("error data",this.errors);
   
     }

  ngOnInit() {
  }
  // bgcolor(color){
  //   console.log("hello ",color);
  //   return "red";
  // }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
}
