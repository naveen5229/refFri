import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tyre-history',
  templateUrl: './tyre-history.component.html',
  styleUrls: ['./tyre-history.component.scss']
})
export class TyreHistoryComponent implements OnInit {
 tyreHistory=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor( public activeModal: NgbActiveModal,
    public api:ApiService,
    public common:CommonService) {
      this.gettyreHistory();
     }

  ngOnDestroy(){}
ngOnInit() {
  }

  gettyreHistory() {
    let params = `tyreId=${this.common.params.tyreId}`;
    this.common.loading++;
    this.api.get('Tyres/getSingleTyreHistory?' + params)
      .subscribe(res => {
        console.log('Res:', res);
        this.tyreHistory=res['data'];
        this.common.loading--;
        if (!res['data']){
          return;
        } 
        this.clearAllTableData();
        console.log("History",this.tyreHistory);
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });
  
}

setTable() {
  this.table.data = {
    headings: this.generateHeadings(this.tyreHistory[0]),
    columns: this.getColumns(this.tyreHistory,this.tyreHistory[0])
  };
}

generateHeadings(tyreHeadings) {
  let headings = {};
  for (var key in tyreHeadings) {
    if (key.charAt(0) != "_") {
      headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
    }
  }
  console.log('Headings',headings);
  return headings;
}


formatTitle(title) {
  return title.charAt(0).toUpperCase() + title.slice(1)
}

getColumns(tyreList, tyreHeadings) {
  let columns = [];
  tyreList.map(tyre => {
    let column = {};
    for (let key in this.generateHeadings(tyreHeadings)) {
        column[key] = { value: tyre[key], class: 'black', action: '' };
    }
    columns.push(column);
  });
  return columns;
}

clearAllTableData(){
  this.table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
}
  closeModal() {
    this.activeModal.close();
  }

}
