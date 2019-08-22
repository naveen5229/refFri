import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'routes-timetable',
  templateUrl: './routes-timetable.component.html',
  styleUrls: ['./routes-timetable.component.scss']
})
export class RoutesTimetableComponent implements OnInit {
  routesDetails = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    this.getRoutes();
  }

  ngOnInit() {
  }
  getRoutes() {
    let params = {
      vehicleId: 29192,
      routeId: 69,
      routeTtId: 6,
    }
    this.common.loading++;
    this.api.post('ViaRoutes/getVehicleTimeTable', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routesDetails = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  closeModal() {
    this.activeModal.close();
  }
}
