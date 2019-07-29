import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'finance-recovery',
  templateUrl: './finance-recovery.component.html',
  styleUrls: ['./finance-recovery.component.scss']
})
export class FinanceRecoveryComponent implements OnInit {
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
  financeData=[];
  constructor(public api:ApiService,
    public activeModal:NgbActiveModal,
    ) {
this.getFinanceData(); 
   }

  ngOnInit() {
  }

  getTableColumns(){
    let columns=[];
    this.financeData.map(financeDocs =>{
      this.valobj={};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: financeDocs[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }
    
      

    
  getFinanceData(){
    console.log("ap")
    this.api.get("wareHouse/getAllStatesWrtItem?").subscribe(
      res => {
        this.financeData = [];
        this.financeData = res['data'];
        console.log("result", res);
        let first_rec = this.financeData[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
  getFoUser(){
    
  }

}
