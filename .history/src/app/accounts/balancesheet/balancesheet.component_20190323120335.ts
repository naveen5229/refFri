import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  balanceData = {
    enddate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
  // startdate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatter('21/03/2019', 'ddMMYYYY', false, '-'),
    branch: {
      name: '',
      id: 0
    }

  };
  branchdata = [];
  balanceSheetData = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    // this.getBalanceSheet();
    this.getBranchList();
  }

  ngOnInit() {
  }

  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getBalanceSheet() {
    console.log('Balance Sheet:', this.balanceData);
    let params = {
      startdate: this.balanceData.startdate,
      enddate: this.balanceData.enddate,
      branch: this.balanceData.branch.id,
    };

    this.common.loading++;
    this.api.post('Company/GetBalanceData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.balanceSheetData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  filterData(assetdata, slug) {
    return assetdata.filter(data => { return (data.y_is_assets === slug ? true : false) });
  }
}
