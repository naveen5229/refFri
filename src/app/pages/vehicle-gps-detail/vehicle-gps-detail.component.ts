import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'vehicle-gps-detail',
  templateUrl: './vehicle-gps-detail.component.html',
  styleUrls: ['./vehicle-gps-detail.component.scss'],
  providers: [DatePipe]
})
export class VehicleGpsDetailComponent implements OnInit {

  gpsDtails = [];
  foid;
  table = null;
  constructor(public api: ApiService,
     public common: CommonService,
     private datePipe: DatePipe,
    public user: UserService,
    public modalService: NgbModal) {
      this.getVehicleGpsDetail();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }
  refresh(){
    this.getVehicleGpsDetail();
  }

  

  getVehicleGpsDetail() {
    this.common.loading++;
    this.api.get('GpsData/getVehicleGpsDetail')
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.gpsDtails = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    let headings = {
      regno: { title: 'Vehicle regno', placeholder: 'Vehicle regno' },
      apiProvider: { title: 'Api Provider', placeholder: 'Api Provider' },
      lastCall: { title: 'last Call ', placeholder: 'last Call' },
      time: { title: 'Date Time ', placeholder: 'Date Time ' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true, tableHeight: '75vh'
      }

    }
  }

  getTableColumns() {
    let columns = [];
    this.gpsDtails.map(doc => {
      let column = {
        regno: { value: doc.regno },
        apiProvider: { value: doc.apiprovider },
        lastCall: { value: this.datePipe.transform(doc.lastcalldt,'dd MMM HH:mm') },
        time: { value: this.datePipe.transform(doc.dttime,'dd MMM HH:mm') },
      
      };
      columns.push(column);
    });
    return columns;
  }



}
