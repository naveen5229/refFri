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
data ={
  foid:'',
  startDate : '',
  endDate : '',

};
distance =[];
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

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }
  getFoList(user) {
    console.log("user",user);
    this.data.foid = user.id;
  }
  getDistance(){
    this.data.startDate = this.common.dateFormatter(this.data.startDate, 'YYYYMMDD', true, "-");
    this.data.endDate = this.common.dateFormatter(this.data.endDate, 'YYYYMMDD', true, "-"),
    console.log("Data:",this.data);
    let params = {
      foid:this.data.foid,
      fromTime:this.data.startDate,
      tTime:this.data.endDate,
    };
    this.common.loading++;
    this.api.post('vehicles/foVehicleDistance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.distance = res['data'];
        let first_rec = this.distance[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.distance.map(dis => {
      this.valobj = {};
      for(let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:",dis[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: dis[this.headings[i]], class: 'black', action : ''};        
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

}
