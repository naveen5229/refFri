import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'card-mapping',
  templateUrl: './card-mapping.component.html',
  styleUrls: ['./card-mapping.component.scss']
})
export class CardMappingComponent implements OnInit {
  data = [];
  // mobileno = 9812929999;

  table = null;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public user: UserService) {
    // this.mobileno=this.user._details.mobile;
    this.getDetail();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh(){
    this.getDetail();
  }
  getDetail() {
    // console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('CardRechargeApi/getFoCardResults.json?mobileno=' + this.user._details.fo_mobileno)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      Vehicle: { title: 'Vehicle', placeholder: 'Vehicle' },
      IOCL: { title: '	IOCL', placeholder: '	IOCL' },
      BPCL: { title: 'BPCL', placeholder: 'BPCL' },
      ATM: { title: 'ATM', placeholder: 'ATM' },
      HPCL: { title: 'HPCL', placeholder: 'HPCL' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      let column = {
        Vehicle: { value: doc.vehicle },
        IOCL: { value: doc.iocl },
        BPCL: { value: doc.bpcl == null ? "-" : doc.bpcl },
        ATM: { value: doc.atm == null ? "-" : doc.atm },
        HPCL: { value: doc.hpcl == null ? "-" : doc.hpcl },
      };
      columns.push(column);
    });
    return columns;
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Card Mapping";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCSV(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Card Mapping";
        this.common.getCSVFromTableId(tblEltId);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
