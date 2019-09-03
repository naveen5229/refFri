import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { UploadDocsComponent } from '../../modals/upload-docs/upload-docs.component';
@Component({
  selector: 'driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.scss', '../../pages/pages.component.css']
})
export class DriverDocumentComponent implements OnInit {
  data = [];
  docdata = [];
  columns = [];
  vehicle_info = [];
  total_recs = 0;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);

    this.getDocumentData();
  }

  ngOnInit() {
  }
  refresh() {
    this.getDocumentData();

  }

  getDocumentData() {
    this.data = [];
    this.docdata = [];
    this.columns = [];
    this.vehicle_info = [];
    this.common.loading++;
    this.api.get('Drivers/getDriverDocWrtFo')
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.total_recs = this.data.length;
        if (this.data.length) {
          for (var key in this.data[0]) {
            if (key.charAt(0) != "_")
              this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  uploadDoc(row, col, colval) {

    this.common.params = { row: row, col: colval };
    const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentData();
      }
    })
  }



  fetchDocumentData(row, col, colval) {
    console.log('col', colval);
    this.common.params = { row: row, col: colval };
    const activeModal = this.modalService.open(UploadDocsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }



  getDocumentType(strval) {

    if (strval) {
      if (strval.indexOf('_') > -1) {
        // console.log("Data get", strval.split('_')[1]);
        return strval.split('_')[1];
      } else {
        return 99;
      }
    } else {
      return 0;
    }
  }


}
