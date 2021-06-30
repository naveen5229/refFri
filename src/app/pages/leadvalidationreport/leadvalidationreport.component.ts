import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'leadvalidationreport',
  templateUrl: './leadvalidationreport.component.html',
  styleUrls: ['./leadvalidationreport.component.scss']
})
export class LeadvalidationreportComponent implements OnInit {
  tripData = [];
  tripMasterReportData = [];
  selectedVehicle = {
    id: 0
  };
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  startTime = new Date();
  endTime = new Date();

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    public user: UserService) {
    let today = new Date();
    this.startTime = new Date(today.setDate(today.getDate() - 1));
  }

  ngOnInit(): void {
  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase', this.selectedVehicle.id);
  }

  // getTripMasterReport(){

  // }

  getTripMasterReport() {
    this.tripData = [];
    const params = "startTime=" + this.common.dateFormatter(this.startTime) +
      "&endTime=" + this.common.dateFormatter(this.endTime);
    this.common.loading++;
    this.api.get('TripsOperation/getLeadValidationReport?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.tripData =  res['data']
        if (res['code'] > 0) {
          this.tripData =  res['data'];

         console.log('vehicleTrips', this.tripData);
          let first_rec = this.tripData[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }

          }
        
          // let action = { title: 'Action', placeholder: 'Action' };
          // this.table.data.headings['action'] = action;


          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.tripData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
      this.valobj[this.headings[j]] = { value: this.tripData[i][this.headings[j]], class: 'black', action: '',isHTML: true, };
      console.log('valobj',this.valobj,this.tripData[i][this.headings[j]]);
      }
     // this.valobj['style'] = { background: this.tripData[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
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
        let center_heading = "Trip Tat Report";
       // let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Trip Profit And Loss";
       // let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}