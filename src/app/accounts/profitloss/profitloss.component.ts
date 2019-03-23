import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'profitloss',
  templateUrl: './profitloss.component.html',
  styleUrls: ['./profitloss.component.scss']
})
export class ProfitlossComponent implements OnInit {

  plData = {
    enddate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    branch: {
      name: '',
      id: 0
    }

  };
  branchdata = [];
  profitLossData = [];
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
    console.log('Balance Sheet:', this.plData);
    let params = {
      startdate: this.plData.startdate,
      enddate: this.plData.enddate,
      branch: this.plData.branch.id,
    };

    this.common.loading++;
    this.api.post('Company/GetProfitLossData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.profitLossData = res['data'];
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
