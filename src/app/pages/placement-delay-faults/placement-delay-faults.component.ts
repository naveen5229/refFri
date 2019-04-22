import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'placement-delay-faults',
  templateUrl: './placement-delay-faults.component.html',
  styleUrls: ['./placement-delay-faults.component.scss']
})
export class PlacementDelayFaultsComponent implements OnInit {

  delayFaults=[];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
   public modalService: NgbModal) { 
     this.getDelayFaults();
   }

  ngOnInit() {
  }

  getDelayFaults(){

    this.delayFaults = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //  console.log('params: ', params);
    this.common.loading++;
    this.api.get('Placement/placementDelayFaults?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.delayFaults =JSON.parse(res['data'][0].fn_placements_getfaults);
        console.log('delayFaults',this.delayFaults);
        let first_rec = this.delayFaults[0];
        console.log("first_Rec", first_rec);
        
        for (var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }

        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);

              
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns() {
    let columns = [];
    for(var i= 0; i<this.delayFaults.length; i++) {
      this.valobj = {};
      for(let j=0; j<this.headings.length; j++) {j 
          this.valobj[this.headings[j]] = {value: this.delayFaults[i][this.headings[j]], class: 'black', action:  ''};
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

}
