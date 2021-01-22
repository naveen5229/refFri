import { Component, OnInit, NgZone, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { DatePipe } from '@angular/common';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'print-manifest',
  templateUrl: './print-manifest.component.html',
  styleUrls: ['./print-manifest.component.scss', '../../pages/pages.component.css']
})
export class PrintManifestComponent implements OnInit {

  manifestDetail = null;
  lrdescriptions = null;
  otherDetails = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public datepipe: DatePipe,
    public renderer: Renderer2
  ) {
    let manifestId = this.common.params.manifestId;
    this.getManifestDetail(manifestId);
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
    this.renderer.addClass(document.body, 'test');
  }

  getManifestDetail(manifestId) {

    let params = "manifestId=" + manifestId;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/printLrManifest?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.manifestDetail = res['data'][0];
        this.lrdescriptions = JSON.parse(this.manifestDetail.lrdetails);
        this.otherDetails = JSON.parse(this.manifestDetail._otherdetails)
        console.log('manifestDetail', this.manifestDetail);
        console.log('lrdescriptions', this.lrdescriptions);
        console.log('otherDetails', this.otherDetails);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }



  onPrint() {
    this.renderer.addClass(document.body, 'test');
    window.print();
    this.renderer.addClass(document.body, 'test');


  }
}
