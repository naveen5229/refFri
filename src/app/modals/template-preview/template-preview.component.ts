import { Component, OnInit, Renderer } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../..//services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: 'template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
  template = {
    PreviewId:null,
    preview: null,
    refId: null,
    refType: null,
  };
  title = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public renderer: Renderer,
    private sanitizer: DomSanitizer
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1600');
    if (this.common.params && this.common.params.previewData) {
      //this.common.refresh = this.refresh.bind(this);
      console.log("params:", this.common.params);

      this.template.PreviewId = this.common.params.previewData.previewId ? this.common.params.previewData.previewId : '';
      this.template.refId = this.common.params.previewData.refId ? this.common.params.previewData.refId : '';
      this.template.refType = this.common.params.previewData.refType ? this.common.params.previewData.refType : '';
      this.title = this.common.params.previewData.title ? this.common.params.previewData.title : 'Preview';
    }
    this.preview();
  }

  ngOnInit() {
  }

  refresh() {
    this.preview();
  }

  preview() {
    this.common.loading++;
    this.api.get('userTemplate/preview?tId=' + this.template.PreviewId + '&refid=' + this.template.refId + '&ref_type=' + this.template.refType)
      .subscribe(res => {
        --this.common.loading;
        // console.log("preview : ", res['data']);
        this.template.preview = this.sanitizer.bypassSecurityTrustHtml(res['data']);
        //console.log("preview : ",this.template.preview)
      })
  }

  closeModal() {
    this.activeModal.close({ ex: 'Modal has been closed' });
  }


  onPrint(id) {
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);
  }

  printHandler() {
    this.renderer.setElementClass(document.body, 'test', true);
    let css = '@page { size: landscape !important; }';
    let head = document.head || document.getElementsByTagName('head')[0];
    let style = document.createElement('style');

    style.type = 'text/css';
    style.media = 'print';

    if (style['styleSheet']) {
      style['styleSheet'].cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

    window.print();
    let printWindowListener = setInterval(() => {
      if (document.readyState == "complete") {
        clearInterval(printWindowListener);
        head.removeChild(style);
        this.renderer.setElementClass(document.body, 'test', false);
      }
    }, 1000);
  }





}
