import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  startTime = new Date();
  endTime = new Date();
  traficdata:any;
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination:true
    }
  };
  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public user: UserService) {

     }

  ngOnInit(): void {
  }
    selectstartDate(event) {
      this.startDate=event;
  }
  selectendDate(event) {
    this.startDate=event;
  }
  getData() {
    this.traficdata = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      }
    };
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    let foid=512;
    ++this.common.loading;
    const subscription = this.api.getJavaPortDost(8085, 'report/' + foid+'/'+startDate+'/'+endDate+'/'+this.startTime+'/'+this.endTime)
    .subscribe((res: any) => {
        --this.common.loading;
        console.log('Res:',res,res['reports']);
        // this.vehicleId = -1;
        // this.vehicleTrips = res['data'];
        //this.vehicleTrips = JSON.parse(res['data']);
        this.traficdata = res['reports'];
        //this.table = this.setTable();
        if (this.traficdata != null) {
          console.log('vehicleTrips', this.traficdata);
          let first_rec = this.traficdata[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              if (key === 'Start Date' || key=== 'End Date') {
                headerObj['type'] = 'date';
              }
              this.table.data.headings[key] = headerObj;
            }

          }
          let action = { title: 'Action', placeholder: 'Action' };
          this.table.data.headings['action'] = action;
          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
        } else {
          this.common.showToast('No Record Found !!');
        }
      subscription.unsubscribe();

      }, err => {
        --this.common.loading;
        console.log('Err:', err);
        subscription.unsubscribe();

      });
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
    for (var i = 0; i < this.traficdata.length; i++) {
      this.valobj = {};
      console.log('headings',this.traficdata,this.headings);
      for (let j = 0; j < this.headings.length; j++) {
        // this.valobj['action'] = {
        //   value: '', isHTML: true, action: null,
        //   icons: this.actionIcons(this.traficdata[i])
        // }
        
      this.valobj[this.headings[j]] = { value: this.traficdata[i][this.headings[j]], class: 'black', action: '',isHTML: true, };
      console.log('valobj',this.traficdata,this.headings[j]);
      }
      this.valobj['style'] = { background: this.traficdata[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }
}
