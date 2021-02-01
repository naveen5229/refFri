import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-analysis',
  templateUrl: './vehicle-analysis.component.html',
  styleUrls: ['./vehicle-analysis.component.scss', '../../pages/pages.component.css']
})
export class VehicleAnalysisComponent implements OnInit {
  data = [];
  columns = [];
  constructor(public mapService: MapService,
    public common: CommonService,
    private activeModal: NgbActiveModal) {
    this.data = this.common.params;
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.getdata();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getdata() {
    // this.data = this.data.length;
    if (this.data.length) {
      for (var key in this.data[0]) {
        if (key.charAt(0) != "_")
          this.columns.push(key);
      }
      console.log("columns");
      console.log(this.columns);
    }

  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
}
