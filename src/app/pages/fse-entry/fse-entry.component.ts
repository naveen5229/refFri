import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fse-entry',
  templateUrl: './fse-entry.component.html',
  styleUrls: ['./fse-entry.component.scss']
})
export class FSEEntryComponent implements OnInit {
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));;
  table=null;
  data=[];
  vehid=null;

  constructor(
    public api:ApiService,
    public common:CommonService
  ) { }

  ngOnInit() {
  }

  setTable() {
    let headings = {
      regno: { title: 'regno', placeholder: 'regno' },
      entry_time: { title: 'Entry Time', placeholder: 'Entry Time' },
      fuel_station: { title: 'fuel Station', placeholder: 'fuel Station' },
      location: { title: 'location', placeholder: 'location' },
      site_name: { title: 'site name', placeholder: 'site name' },
      litres: { title: 'litres', placeholder: 'litres' },
      rate: { title: 'rate', placeholder: 'rate' },
      amount: { title: 'amount', placeholder: 'amount' },
      is_full: { title: 'is_full', placeholder: 'is_full' },
      fse_id: { title: 'fse_id', placeholder: 'fse_id' },
     addtime: { title: 'addtime', placeholder: 'addtime' },
       
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
      entry_time: { value: this.common.changeDateformat2(doc.end_time) },
      fuel_station: { value: doc.fuel_station },
      location: { value: doc.location },
      site_name: { value: doc.site_name },
      litres: { value: doc.litres },
      rate: { value: doc.rate },
      amount: { value: doc.amount },
      is_full: { value: doc.is_full },
      fse_id: { value: doc.fse_id },
     addtime: { value:this.common.changeDateformat2(doc.addtime)  },
      };
      columns.push(column);
    });
    return columns;
  }
  searchVehicle(event){
    this.vehid=event.id;
    console.log("event",event);
 }



  submit(){
    let params
    params = "start_time=" + this.common.dateFormatter(this.startDate) + "&end_time=" + this.common.dateFormatter(this.endDate) + "&vehicle_id=" +this.vehid;
      console.log("param",params)
      this.common.loading++;
      this.api.get("Fuel/getAllFuelStationEntryWrtVeh?"+params).subscribe(
        res => {
         this.data = res['data'];
         this.table=this.setTable();
          console.log("datA",res);
          this.common.loading--;
       },
        err => {
          console.log(err);
        }
      );
   }

}
