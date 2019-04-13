import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
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
  }

  ngOnInit() {
  }
  getFoList(user) {
    console.log("user", user);
    this.data.foid = user.id;
  }
  getDistance() {
    this.data.startDate = this.common.dateFormatter(this.data.startDate, 'YYYYMMDD', true, "-");
    this.data.endDate = this.common.dateFormatter(this.data.endDate, 'YYYYMMDD', true, "-");
    console.log("Data:", this.data);
    let params = {
      foid: this.data.foid,
      fromTime: this.data.startDate,
      tTime: this.data.endDate,
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

}
