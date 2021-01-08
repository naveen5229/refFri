import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import "jspdf-autotable";
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'tag-summary',
  templateUrl: './tag-summary.component.html',
  styleUrls: ['./tag-summary.component.scss']
})
export class TagSummaryComponent implements OnInit {

  foid = null;
  data=null;
  typedKey = '';
  result = [];

  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
  vehId=null;
  regno=null;

  table = null;

  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) { 
      this.foid = this.user._loggedInBy == 'admin' ? this.user._customer.foid:this.user._details.foid;
    }

  ngOnInit(): void {
  }

  selectVehicle(vehData) {
    this.vehId = vehData.id;
    this.regno = vehData.regno;
  }

  filterData(event) {
    console.log('typedKey', this.typedKey)
    this.data = this.result.filter((ele) => {
      if (!this.typedKey) {
        return true;
      } else {
        console.log("ele", ele);
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
      }
    })
    console.log("data", this.data);
  }

  tagSummary(){
    let params = "startDate=" + this.common.dateFormatter(new Date(this.startTime)) + "&endDate=" + this.common.dateFormatter(new Date(this.endTime)) +"&vehid="+this.vehId;
    this.common.loading++;
    // let response;
    this.api.walle8Get('FinancialAccountSummary/getVehicleTagTxnSummary.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    // return response;
  }

  setTable() {
    let headings = {
      txntype: { title: 'Transaction Type', placeholder: 'Transaction Type' },
      addtime: { title: 'Processing Time', placeholder: 'Processing Time' },
      transtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      regno: { title: 'Reg No.', placeholder: 'Reg. No' },
      plazaname: { title: 'Plaza Name', placeholder: 'Plaza Name' },
      amount:{title:'Txn Amount',placeholder:'Txn Amount'},
      balance:{title:'Balance',placeholder:'Balance'},
      txnid:{title:'Transaction ID',placeholder:'Transaction ID'},
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
        txntype: { value: doc.txntype },
        addtime: { value: doc.addtime},
        transtime: { value: doc.transtime },
        regno: { value: doc.regno },
        plazaname: { value: doc.plazaname },
        amount:{value:doc.amount},
        balance:{value:doc.balance},
        txnid:{value:doc.txnid}
      };
      columns.push(column);
    });
    return columns;
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter1(this.startTime),'End Date: '+this.common.dateFormatter1(this.endTime),  'Report: '+'Tag-Summary']
    ];
    this.pdfService.jrxTablesPDF(['tagSummary'], 'tagSummary', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter1(this.startTime),enddate:'End Date:'+this.common.dateFormatter1(this.endTime), report:"Report:Tag-Summary"}
    ];
    this.csvService.byMultiIds(['tagSummary'], 'tagSummary', details);
  }

}
