import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'TJR-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  pdfUrl = '';
  title = '';

  constructor(public activeModal: NgbActiveModal, public common: CommonService) {
    let { pdfUrl, title } = this.common.params;
    this.pdfUrl = pdfUrl;
    this.title = title;
  }

  ngOnInit() {
  }

}
