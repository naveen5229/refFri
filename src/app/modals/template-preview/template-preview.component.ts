import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../..//services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
template={
  preview:null
}
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal

  ) { 
    if (this.common.params.title == 'Preview') {
      this.template.preview=this.common.params.userPreview._id;
      
    }
    this.preview();
  }

  ngOnInit() {
  }

  preview()
  {
    this.common.loading++;
      this.api.get('userTemplate/preview?tId='+this.template.preview)
      .subscribe(res => {
        --this.common.loading;
        console.log("preview : ",res['data']);
        this.template.preview=res['data'];
        //console.log("preview : ",this.template.preview)
      })
  }

  closeModal()
  {
    this.activeModal.close({ex: 'Modal has been closed'});
  }


}
