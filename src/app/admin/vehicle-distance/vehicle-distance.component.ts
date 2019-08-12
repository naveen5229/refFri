import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vehicle-distance',
  templateUrl: './vehicle-distance.component.html',
  styleUrls: ['./vehicle-distance.component.scss', '../../pages/pages.component.css']
})
export class VehicleDistanceComponent implements OnInit {
  data = {
    foid: '',
    startDate: null,
    endDate: null,

  };
  result = [];
  table = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }
  getFoList(user) {
    console.log("user", user);
    this.data.foid = user.id;
  }
  getDistance() {
    if(this.data.startDate>this.data.endDate){
      this.common.showError("StartDate Should be less then Enddate");
    }else{
      console.log('Start Date: ', this.common.dateFormatter(this.data.startDate, 'YYYYMMDD', true, "-"));
    console.log('End Date: ', this.common.dateFormatter(this.data.endDate, 'YYYYMMDD', true, "-"));

    console.log("Data:", this.data);
    let params = {
      fromTime: this.common.dateFormatter(this.data.startDate, 'YYYYMMDD', true, "-"),
      tTime: this.common.dateFormatter(this.data.endDate, 'YYYYMMDD', true, "-"),
    };
    this.common.loading++;
    this.api.post('vehicles/foVehicleDistance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.result = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
    }
    
  }

  setTable() {
    let headings = {
      regno: { title: 'Regno Number', placeholder: 'Regno No' },
      dist: { title: 'Distance ', placeholder: 'Distance' },
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
    this.result.map(row => {
      let column = {
        regno: { value: row.regno },
        dist: { value: row.distance },

      };
      columns.push(column);
    });
    return columns;
  }



  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
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
        let center_heading = "Vehicle Distance";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
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
        let center_heading = "Report:" + "Vehicle Distance";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }


}
