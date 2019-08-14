import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UnmappedLrComponent } from '../../modals/LRModals/unmapped-lr/unmapped-lr.component';
import { MappedLrComponent } from '../../modals/LRModals/mapped-lr/mapped-lr.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddFieldComponent } from '../../modals/LRModals/add-field/add-field.component';
import { LrInvoiceColumnsComponent } from '../../pages/lr-invoice-columns/lr-invoice-columns.component';
@Component({
  selector: 'lr-diagnostics',
  templateUrl: './lr-diagnostics.component.html',
  styleUrls: ['./lr-diagnostics.component.scss']
})
export class LrDiagnosticsComponent implements OnInit {
  data = [];
  dates = {
    start: null,

    end: this.common.dateFormatter(new Date()),
  }
  constructor(public api: ApiService,
    public router: Router,
    private modalService: NgbModal,
    public common: CommonService,
    public user: UserService) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 4)));
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh(){
    console.log("refresh");
  }

  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }
  getDiagnostics() {

    this.common.loading++;
    let response;
    this.api.get('LorryReceiptsOperation/getUnmappedLr')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (this.data) {
          this.common.params = this.data;
          const activeModal = this.modalService.open(UnmappedLrComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  getmapedLr() {
    let params = {
      start_time: this.dates.start,
      end_time: this.dates.end,
    }
    this.common.loading++;
    let response;
    this.api.post('LorryReceiptsOperation/getMappedLr', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        if (this.data) {
          this.common.params = this.data;
          const activeModal = this.modalService.open(MappedLrComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  mergeLrState() {
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/mergeLrState')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  addFoField() {
    const activeModal = this.modalService.open(AddFieldComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Data:', data);


    });
  }


  lrInvoice() {
    const activeModal = this.modalService.open(LrInvoiceColumnsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }
}
