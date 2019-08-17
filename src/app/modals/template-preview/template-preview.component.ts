import { Component, OnInit, Renderer } from '@angular/core';
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
  template = {
    preview: null,
    lrId: null,
  };
  title = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public renderer: Renderer,

  ) {
    if (this.common.params && this.common.params.previewData) {
      this
      this.template.preview = this.common.params.previewData.previewId ? this.common.params.previewData.previewId : '';
      this.template.lrId = this.common.params.previewData.lrId ? this.common.params.previewData.lrId : '';
      this.title = this.common.params.previewData.title ? this.common.params.previewData.title : 'Preview';
    }
    this.preview();
  }

  ngOnInit() {
  }

  preview() {
    this.common.loading++;
    this.api.get('userTemplate/preview?tId=' + this.template.preview + '&lrId=' + this.template.lrId)
      .subscribe(res => {
        --this.common.loading;
        console.log("preview : ", res['data']);
        this.template.preview = res['data'];
        //console.log("preview : ",this.template.preview)
      })
  }

  closeModal() {
    this.activeModal.close({ ex: 'Modal has been closed' });
  }
  onPrint() {
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);

  }



}
