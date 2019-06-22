import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'fse-entry',
  templateUrl: './fse-entry.component.html',
  styleUrls: ['./fse-entry.component.scss']
})
export class FSEEntryComponent implements OnInit {
  startDate=null;
  endDate=null;
  table=null;
  data=[];

  constructor(
    public api:ApiService,
    public common:CommonService
  ) { }

  ngOnInit() {
  }

  setTable() {
    let headings = {
      regno: { title: 'regno', placeholder: 'regno' },
      name: { title: 'name', placeholder: 'name' },
      site_id: { title: 'site id', placeholder: 'site id' },
      entry_time: { title: 'Entry Time', placeholder: 'Entry Time' },
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
      site_id: { value: doc.site_id },
      entry_time: { value: this.common.changeDateformat2(doc.entry_time) },
      addtime: { value: this.common.changeDateformat2(doc.addtime) },
      regno: { value: doc.regno },
      name: { value: doc.name },
      };
      columns.push(column);
    });
    return columns;
  }



  submit(){
    let params
   
      params = "start_time=" + this.common.dateFormatter1(this.startDate) + "&end_time=" + this.common.dateFormatter1(this.endDate);
      console.log("param",params)
      this.api.get("Fuel/getAllFuelStationEntryWrtFo?"+params).subscribe(
        res => {
         this.data = res['data'];
         this.table=this.setTable();
          console.log("datA",res);
       },
        err => {
          console.log(err);
        }
      );
  
  }

}
