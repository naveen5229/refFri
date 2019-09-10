import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../..//services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'save-user-template',
  templateUrl: './save-user-template.component.html',
  styleUrls: ['./save-user-template.component.scss']
})
export class SaveUserTemplateComponent implements OnInit {

  showhide = {
    show: true
  }
  template={
    type:null,
    templateName:null,
    templateHtml:null,
    id:null
  }
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal

  ) { 
    this.common.handleModalSize('class', 'modal-lg', '1100', 'px');
    if (this.common.params.title == 'Edit') {
      this.common.params.title="Update";
      this.showhide.show=false;
      this.common.loading++;
      this.api.get('userTemplate/view?id='+this.common.params.userTemplate._id)
      .subscribe(res => {
        --this.common.loading;
        this.template.type=res['data'][0].ref_type;
        this.template.templateName=res['data'][0].title;
        this.template.templateHtml=res['data'][0].details;
        this.template.id=res['data'][0].id;
      })
    }
  }


  ngOnInit() {
  }

  addEdit()
  {
    let params = {
      type: this.template.type,
      templateName: this.template.templateName,
      template: this.template.templateHtml,
      id:this.template.id
    };
    ++this.common.loading;
    this.api.post("UserTemplate/save", params)
      .subscribe(res => {
        --this.common.loading;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          if(this.template.id==null)
          {
            this.reset();
          }
        }
        else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  closeModal()
  {
    this.activeModal.close({ex: 'Modal has been closed'});
  }

  reset()
  {
    this.template.id="";
    this.template.templateHtml="";
    this.template.templateName="";
    this.template.type="";
  }

}
