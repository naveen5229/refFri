import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { VehicleFuelFillingEntryComponent } from '../../modals/vehicle-fuel-filling-entry/vehicle-fuel-filling-entry.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-average-issues',
  templateUrl: './fuel-average-issues.component.html',
  styleUrls: ['./fuel-average-issues.component.scss']
})
export class FuelAverageIssuesComponent implements OnInit {
  table = null;
  fuelAvgIssues = [];
  constructor(public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public modalService: NgbModal) {
    this.getFuelAvgIssues();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  
  refresh() {
    console.log('Refresh');
    this.getFuelAvgIssues();
  }

  getFuelAvgIssues() {
    this.common.loading++;
    this.api.get('FuelDetails/getFuelAvgIssues')
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        this.fuelAvgIssues = res['data'];
        this.common.showToast(res['msg']);
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      regno: { title: 'Reg No.', placeholder: 'Reg No.' },
      startDate: { title: 'Start Date ', placeholder: 'Start Date' },
      endDate: { title: 'End Date ', placeholder: 'End Date' },
      litre: { title: 'Litre', placeholder: 'Litre' },
      amount: { title: 'Amount ', placeholder: 'Amount' },
      avg: { title: 'Avg ', placeholder: 'Avg' },
      totalDistance: { title: 'Total Distance', placeholder: 'Total Distance' },
      loadingDistance: { title: 'Loading Distance', placeholder: 'Loading Distance' },
      unloadingDistance: { title: 'Unloading Distance', placeholder: 'Unloading Distance' },
      startLoc: { title: 'StartLoc', placeholder: 'StartLoc' },
      endLoc: { title: 'EndLoc', placeholder: 'EndLoc' }
      //action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"

      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.fuelAvgIssues.map(issues => {
      let column = {
        regno: { value: issues.regno, class: 'blue', action: this.vehicleFFdateWise.bind(this, issues) },
        startDate: { value: this.datePipe.transform(issues.start_time, 'dd MMM yyyy') },
        endDate: { value: this.datePipe.transform(issues.end_time, 'dd MMM yyyy') },
        litre: { value: issues.litre },
        amount: { value: issues.amount },
        avg: { value: issues.avg },
        totalDistance: { value: issues.total_distance },
        loadingDistance: { value: issues.loading_distance },
        unloadingDistance: { value: issues.unloading_distance },
        startLoc: { value: issues.startloc },
        endLoc: { value: issues.endloc },
        // AngleFrom: { value: norm.angle_from },
        // AngleTo: { value: norm.angle_to },
        // action: {
        //   value: '', isHTML: false, action: null, icons: [
        //     { class: 'fas fa-edit  edit-btn', action: this.updateRule.bind(this, norm) },
        //     { class: " fa fa-trash remove", action: this.deleteRule.bind(this, norm) }
        //   ]
        // },
        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }

  vehicleFFdateWise(value) {

    this.common.params = { value };
    const activeModal = this.modalService.open(VehicleFuelFillingEntryComponent, { size: 'lg', container: 'nb-layout' });

  }

}



