import { Component, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../..//services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'template-devview',
  templateUrl: './template-devview.component.html',
  styleUrls: ['./template-devview.component.scss']
})
export class TemplateDevviewComponent implements OnInit {
  template = {
    type:null,
    devView: null,
    templateName: null,
    templateHtml: null,
    id:null
  };
  title='';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { 
      this.common.handleModalSize('class', 'modal-lg', '1200');
      this.devView();
    }
  
    ngOnInit() {
    }

    devView()
    {
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

    closeModal() {
      this.activeModal.close({ ex: 'Modal has been closed' });
    }
  }
