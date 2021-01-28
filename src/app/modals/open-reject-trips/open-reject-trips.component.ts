import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'open-reject-trips',
  templateUrl: './open-reject-trips.component.html',
  styleUrls: ['./open-reject-trips.component.scss']
})
export class OpenRejectTripsComponent implements OnInit {
  vehicleId=null;
  startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  endDate = new Date();

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
  }

  rejectTrips(){
    let params = {
      sdate: this.common.dateFormatter(this.startDate),
      edate: this.common.dateFormatter(this.endDate),
      vid:this.common.params.vehicleId
    };
    console.log("Params:",params);
    this.common.loading++;
    this.api.post('HaltOperations/rejectMultiTrip', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close();
        }
        else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        this.common.showError('Error!');
      });
  }

  closeModal(){
    this.activeModal.close();
  }

}
