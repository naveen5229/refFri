import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'current-tag-balance',
  templateUrl: './current-tag-balance.component.html',
  styleUrls: ['./current-tag-balance.component.scss']
})
export class CurrentTagBalanceComponent implements OnInit {
  data = [];
  table = null;
  constructor(
    public common: CommonService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public api: ApiService,
    public user: UserService,
  ) {
    this.getDetail();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.getDetail();
  }
  getDetail() {
    //  console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('CurrentTagBalance/getCurrentTagBalance.json')
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
      regno: { title: 'Vehicle', placeholder: 'Vehicle' },
      balance: { title: '	Balance', placeholder: 'Balance' },
      balance_time: { title: 'Balance Time', placeholder: 'Balance Time' },

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
        regno: { value: doc.regno },
        balance: { value: doc.balance },
        balance_time: { value: doc.balance_time == null ? "-" : doc.balance_time },

      };
      columns.push(column);
    });
    return columns;
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Report: '+'Current-Tag-Balance']
    ];
    this.pdfService.jrxTablesPDF(['currentTagBalance'], 'toll-setteled', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,report:"Report:Current-Tag-Balance"}
    ];
    this.csvService.byMultiIds(['currentTagBalance'], 'toll-setteled', details);
  }

  // printPDF(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = fodata['name'];
  //       let center_heading = "Current Tag Balance";
  //       this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  // printCSV(tblEltId) {
  //   this.common.loading++;
  //   let userid = this.user._customer.id;
  //   if (this.user._loggedInBy == "customer")
  //     userid = this.user._details.id;
  //   this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       let fodata = res['data'];
  //       let left_heading = fodata['name'];
  //       let center_heading = "Current Tag Balance";
  //       this.common.getCSVFromTableId(tblEltId);
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }
}
