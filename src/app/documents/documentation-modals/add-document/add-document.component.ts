import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss', '../../../pages/pages.component.css']
})
export class AddDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';

  agents = [];
  docTypes = [];
  vehicle = null;


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
     this.title = this.common.params.title; 
     this.btn1 = this.common.params.btn1 || 'Add';
     this.btn2 = this.common.params.btn2 || 'Cancel';


    this.vehicle = this.common.params.details.vehicle_info[0];
    this.agents = this.common.params.details.document_agents_info;
    this.docTypes = this.common.params.details.document_types_info;
  }

  ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
}
