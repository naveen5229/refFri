import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getUrlScheme } from '@angular/compiler';
import { CardusageComponent } from '../../modals/cardusage/cardusage.component';
@Component({
  selector: 'card-usage',
  templateUrl: './card-usage.component.html',
  styleUrls: ['./card-usage.component.scss', '../../pages/pages.component.css']
  // './../../pages/pages.component.css'
})
export class CardUsageComponent implements OnInit {
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

  

  dates = {
    start: null,
    end: this.common.dateFormatter1(new Date()),
  }
  // userId = '946';
  // mobileno = 9812929999;
  // startdate = '1/5/2019';
  // enddate = '31/5/201'
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 30)));
    this.getcardUsage();
    //this.calculateTotal();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh(){
    this.getcardUsage();
    //this.calculateTotal();
  }
  ngAfterViewInit() {


  }

  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (date == 'start') {
        this.dates.start = this.common.dateFormatter(data.date).split(' ')[0];
      }
      if (date == 'end') {
        this.dates.end = this.common.dateFormatter(data.date).split(' ')[0];
      }

    });
  }
  getcardUsage() {


    //let params = "aduserid=" + this.user._details.foid + "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;
    let params =  "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;
    console.log("-----------",params);
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
          if(key == 'vid') {
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
        if(this.headings[i]=='vehicle'){
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'blue', action: this.showdata.bind(this, matrix) };
        }
        else{
          this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
        }
      }
        

      // this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }


  // actionIcons(details) {
  //   let icons = [];
  //   icons.push(
  //     {
  //       class: "fa fa-edit",
  //       // action: this.openAddIssueModel.bind(this, details)

  //     }
  //   )
  //   console.log("details-------:", details)
  //   return icons;
  // }

  formatTitle(title) {
    if (title.length <= 4) {
      return title.toUpperCase() 
    }
    return title.charAt(0).toUpperCase() + title.slice(1)
  }


  showdata(data){
    console.log()
    this.common.params = { vehicleid: data.vid, startdate:this.dates.start,enddate:this.dates.end};
    const activeModal = this.modalService.open(CardusageComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static'});
     activeModal.result.then(data => {
     });
    
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
        let center_heading = "Card Usage";
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
        let center_heading = "Card Usage";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading,["Action"],'');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  
}
