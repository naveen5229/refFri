import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUrlScheme } from '@angular/compiler';
import { CardusageComponent } from '../../modals/cardusage/cardusage.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
@Component({
  selector: 'card-usage',
  templateUrl: './card-usage.component.html',
  styleUrls: ['./card-usage.component.scss', '../../pages/pages.component.css']
  // './../../pages/pages.component.css'
})
export class CardUsageComponent implements OnInit {
  mainBalance=null;
  tollBalance=null;
  totalBalance=null;
  cardUsage = [];
  total = 0;

  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };



  // dates = {
  //   start: null,
  //   end: this.common.dateFormatter1(new Date()),
  // }
  // userId = '946';
  // mobileno = 9812929999;
  // startdate = '1/5/2019';
  // enddate = '31/5/201'
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    // let today = new Date();
    // this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 30)));
    // this.endDate = new Date();
    // this.startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 30));
    this.getcardUsage();
    this.getBalance();
    //this.calculateTotal();
    this.common.refresh = this.refresh.bind(this);

    
  }

  ngOnInit() {
  }

  refresh() {
    this.getBalance();
    this.getcardUsage();
    //this.calculateTotal();
  }
  ngAfterViewInit() {
  }

  getBalance() {
    this.mainBalance=null;
    this.tollBalance=null;
    this.totalBalance=null;
    const params = "mobileno=" + this.user._details.fo_mobileno;
    const subURL = "CardRechargeApi/AccountRemainingAmount.json?";
    let title = ' Current Balance';
    this.common.loading--;
    this.api.walle8Get(subURL + params)
      .subscribe(async res => {
        this.common.loading++;
        console.info("Balance:",res);
        this.common.showToast(res['responsemessage']);
        if (res['responsecode'] === 1) {

          const main=res["data"][0].main_balance;
          var mainwithsep=Number(main).toLocaleString('en-GB');
          this.mainBalance=mainwithsep;

          const toll=res["data"][0].toll_balance;
          var tollwithsep=Number(toll).toLocaleString('en-GB');
          this.tollBalance=tollwithsep;

          const total=main+toll;
          var totalwithsep=Number(total).toLocaleString('en-GB');
          this.totalBalance=totalwithsep;
        }
        
      }, err => {
        console.error(err);
        this.common.loading--;
        this.common.showToast('Oops! Some technical error has been occurred. Please try again..');
      });
  }
  
  getcardUsage() {
    let params = "mobileno=" + this.user._details.fo_mobileno + "&startdate=" +this.common.dateFormatter(new Date(this.startDate))+ "&enddate=" + this.common.dateFormatter(new Date(this.endDate));
    console.log("-----------", params);
    let response;
    this.common.loading++;
    this.api.walle8Get('AccountSummaryApi/ViewCardUsages.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res['data']);
        this.cardUsage = res['data'];
        let first_rec = this.cardUsage[0];
        let headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            if (key == 'vid') {
              continue;
            }

            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
          }
        }
        this.table.data = {
          headings: headings,
          columns: this.getTableColumns()
        };
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.cardUsage);
    this.cardUsage.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'vehicle') {
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.showdata.bind(this, matrix) };
        }
        else {
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
        }
      }


      // this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }

  formatTitle(title) {
    if (title.length <= 4) {
      return title.toUpperCase()
    }
    return title.charAt(0).toUpperCase() + title.slice(1)
  }


  showdata(data) {
    this.common.params = {
      vehicleName:data.vehicle,
      vehicleid: data.vid,
      startdate: this.common.dateFormatter(new Date(this.startDate)),
      enddate: this.common.dateFormatter(new Date(this.endDate)),
      name: this.user._loggedInBy=='admin'?this.user._details.username:this.user._details.name,
      mobileno: this.user._details.fo_mobileno
    };
    const activeModal = this.modalService.open(CardusageComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });

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
  //       let center_heading = "Card Usage";
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
  //       let center_heading = "Card Usage";
  //       this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name, 'Start Date: '+this.startDate,'End Date: '+this.endDate,  'Report: '+'Card-Usage']
    ];
    this.pdfService.jrxTablesPDF(['cardUsage'], 'card-usage', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:"Start Date:"+this.startDate,enddate:"End Date: "+this.endDate, report:"Report:Card-Usage"}
    ];
    this.csvService.byMultiIds(['cardUsage'], 'card-usage', details);
  }

}