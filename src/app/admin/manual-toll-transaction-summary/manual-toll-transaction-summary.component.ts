import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'manual-toll-transaction-summary',
  templateUrl: './manual-toll-transaction-summary.component.html',
  styleUrls: ['./manual-toll-transaction-summary.component.scss']
})
export class ManualTollTransactionSummaryComponent implements OnInit {
  transitTime = {
    transactiontime: this.common.dateFormatter(new Date()),
  }
  regno = null;
  plazaName = null;
  amount = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal, ) {
    this.gettollTransactionSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {

  }

  refresh() {
    console.log('Refresh');
    this.gettollTransactionSummary();
  }
  selectVehicle(userVeh) {
    this.regno = userVeh.id;

  }
  SelectPlaza(plaza) {
    this.plazaName = plaza.plaza_name;

  }
  getDate(time) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.transitTime[time] = this.common.dateFormatter(data.time).split(' ')[0];
      console.log('Date:', this.transitTime[time]);
    });

  }
  gettollTransactionSummary() {
    let params = {
      vehicle_id: this.regno,

      transtime: this.transitTime.transactiontime,
      amount: this.amount,
      plaza_name: this.plazaName,
    }
    this.common.loading++;
    let response;
    this.api.post('Toll/manualTollPlazaEntry', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

}
