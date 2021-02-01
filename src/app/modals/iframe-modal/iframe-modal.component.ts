import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl }from '@angular/platform-browser';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'iframe-modal',
  templateUrl: './iframe-modal.component.html',
  styleUrls: ['./iframe-modal.component.scss']
})
export class IframeModalComponent implements OnInit {
  url: string = "www.elogist.in";
  urlSafe: SafeResourceUrl;
title = 'Map Route'
  constructor(public common: CommonService, public api: ApiService,
    private activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer) { 
      // this.url = url this.common.params.data.url ? this.common.params.data.url :this.url;
      this.title = this.common.params.data.title ? this.common.params.data.title :this.title;
    }

  ngOnDestroy(){}
ngOnInit() {
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  dismiss(flag){
    this.activeModal.close();
  }

 
}
