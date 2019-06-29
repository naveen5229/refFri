import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';

@Component({
  selector: 'driver-document',
  templateUrl: './driver-document.component.html',
  styleUrls: ['./driver-document.component.scss', '../../pages/pages.component.css']
})
export class DriverDocumentComponent implements OnInit {
  data = { result: [] };
  docdata = [];
  columns = [];
  vehicle_info = [];
  total_recs = 0;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {

    this.getDocumentData();
  }

  ngOnInit() {
  }

  getDocumentData() {
    this.common.loading++;
    this.api.get('Drivers/getDriverDocs')
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.total_recs = this.data.result.length;
        if (this.data.result.length) {
          for (var key in this.data.result[0]) {
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


  fetchDocumentData(row, col, colval) {
    console.log("row:", row);
    console.log("col:", col);

    console.log("colval:");
    console.log(colval);

    console.log("image data", row);
    let images = [{
      name: "image",
      image: row.licence_photo
    },
    {
      name: "image",
      image: row.img_url2
    },
    {
      name: "image",
      image: row.img_url3
    },
    ];
    console.log("images:", images);

    this.common.params = { images, title: 'Image' };
    this.common.handleModalSize('class', 'modal-lg', '1024');
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

}
