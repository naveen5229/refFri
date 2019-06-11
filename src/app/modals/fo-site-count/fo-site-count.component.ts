import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3';
import { DateService } from '../../services/date.service';
@Component({
  selector: 'fo-site-count',
  templateUrl: './fo-site-count.component.html',
  styleUrls: ['./fo-site-count.component.scss']
})
export class FoSiteCountComponent implements OnInit {
  startDate = null;
  //endDate = null;
  foid = null;
  data = [];
  constructor(private modalService: NgbModal,
    private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService) {


    let endDay, startday;
    let today = new Date();
    // this.endDate = new Date(today.setDate(today.getDate()))

    this.startDate = new Date(today.setDate(today.getDate() - 5))
  }

  ngOnInit() {
  }
  selectFoUser(user) {
    this.foid = user.id;
  }
  // getDistance() {
  //   let params = "foid=" + this.foid + "&startFrom=" + this.startDate;
  //   this.common.loading++;
  //   let response;
  //   this.api.get('site/setFoSiteCount?' + params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Res:', res['data']);
  //       this.data = res['data'];
  //       // this.table.data.columns = this.getTableColumns(this.formattData());

  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  //   return response;

  // }
}
