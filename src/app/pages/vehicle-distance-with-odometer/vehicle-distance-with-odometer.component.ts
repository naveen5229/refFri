import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-distance-with-odometer',
  templateUrl: './vehicle-distance-with-odometer.component.html',
  styleUrls: ['./vehicle-distance-with-odometer.component.scss']
})
export class VehicleDistanceWithOdometerComponent implements OnInit {
 foid=null;
 endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
 table=null;
 data=[];

  constructor(
    public api:ApiService,
    public user:UserService,
    public common:CommonService,
  ) {
    this.foid=this.user._customer.id;
    console.log("foid",this.foid);
    

   }

  ngOnDestroy(){}
ngOnInit() {
  }

  setTable() {
    let headings = {
      regno:{ title: 'Regno', placeholder: 'Regno' },
      first_date: { title: 'First Date', placeholder: 'First Date' },
      first_kms: { title: 'First Kms', placeholder: 'First Kms' },
      last_date: { title: 'Last Date', placeholder: 'Last Date' },
      last_kms: { title: 'Last Kms', placeholder: 'Last Kms' },
      dis_diff_FromODO: { title: 'disFromODO', placeholder: 'disFromODO' },
      disFromDB: { title: 'disFromDB', placeholder: 'disFromDB' },
      diff_percentage: { title: 'difference %', placeholder: 'difference  %' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns(),
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
      regno:{  value: doc.regno },
      first_date: {  value: this.common.changeDateformat2(doc.first_date) },
      first_kms: {  value: doc.first_kms },
      last_date: {  value: this.common.changeDateformat2(doc.last_date) },
      last_kms: {  value: doc.last_kms },
      dis_diff_FromODO: {  value: doc.dis_diff_FromODO },
      disFromDB: {  value: doc.disFromDB },
      diff_percentage: {  value: doc.diff_percentage },
      };
      columns.push(column);
    });
    return columns;
  }

  showData(){
    
     const params = {
      fromTime:this.common.dateFormatter(this.startDate),
      tTime:this.common.dateFormatter(this.endDate),
    };
   console.log("params",params);
   this.common.loading++;
    this.api.post('Vehicles/getDiffBwDistanceByOdoMeter',params)
      .subscribe(res => 
        {
         
          this.data=res['data'];
          this.table=this.setTable();
          console.log("data", res)
         this.common.loading--; 
      },
        err => console.error('Activity Api Error:', err));
  }

}
