import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'vehicle-distance-with-odometer',
  templateUrl: './vehicle-distance-with-odometer.component.html',
  styleUrls: ['./vehicle-distance-with-odometer.component.scss']
})
export class VehicleDistanceWithOdometerComponent implements OnInit {
 foid=null;
 startDate="";
 endDate="";
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

  ngOnInit() {
  }

  setTable() {
    let headings = {
      regno: { title: 'regno', placeholder: 'regno' },
      disFromDB: { title: 'disFromDB', placeholder: 'disFromDB' },
      disFromODO: { title: 'disFromODO', placeholder: 'disFromODO' },
      difference: { title: 'difference', placeholder: 'difference' },
      percentage_diff: { title: 'percentage_diff', placeholder: 'percentage_diff' },
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
      regno: { value: doc.regno },
      disFromDB: { value: doc.disFromDB },
      disFromODO: { value: doc.disFromODO },
      difference: { value: doc.difference },
      percentage_diff: { value: doc.percentage_diff },
      };
      columns.push(column);
    });
    return columns;
  }

  submit(){
    

    const params = {
      foid: this.foid,
      fromtime:this.common.dateFormatter1(this.startDate),
      tTime:this.common.dateFormatter1(this.endDate),
    };

    console.log("params",params);
    this.api.post('Test/getDiffBwDistanceByOdoMeter',params)
      .subscribe(res => 
        {
          this.data=res['data'];
          this.table=this.setTable();
          console.log("data", res)
        },
        err => console.error('Activity Api Error:', err));
    
  }

}
