import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'iframe-modal',
  templateUrl: './iframe-modal.component.html',
  styleUrls: ['./iframe-modal.component.scss']
})
export class IframeModalComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef
  url = null;
url1 = `https://www.google.com/maps/dir/'23,75'/'24,75'/'26,75'/'25,75&hl=es;z=14&amp;output=embed`;
// 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14235.999293684969!2d75.7757448!3d26.8717467!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7d57c9668341c858!2seLogist%20Solutions!5e0!3m2!1sen!2sin!4v1597058800362!5m2!1sen!2sin"';
title = 'Map Route'
  constructor(public common: CommonService, public api: ApiService,
    private activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer) { 
      this.url = this.common.params.data.url ? this.sanitizer.bypassSecurityTrustResourceUrl(this.common.params.data.url) :this.sanitizer.bypassSecurityTrustResourceUrl(this.url1);
      this.title = this.common.params.data.title ? this.common.params.data.title :this.title;
    }

  ngOnInit() {
  }

  dismiss(flag){
    this.activeModal.close();
  }

  ngAfterViewInit() {
   this.iframe.nativeElement.setAttribute('src', this.url);
  }
}
