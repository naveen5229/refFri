import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'fo-user-state',
  templateUrl: './fo-user-state.component.html',
  styleUrls: ['./fo-user-state.component.scss']
})
export class FoUserStateComponent implements OnInit {

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
  foData=[];
  constructor( public activeModal:NgbActiveModal,
    public api:ApiService) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getTableColumns(){
    let columns=[];
    this.foData.map(foDocs =>{
      this.valobj={};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: foDocs[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }
    
      

    
  getFinanceData(){
    console.log("ap")
    this.api.get("wareHouse/getAllStatesWrtItem?").subscribe(
      res => {
        this.foData = [];
        this.foData = res['data'];
        console.log("result", res);
        let first_rec = this.foData[0];
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

}
