import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnMergeStateComponent } from '../../modals/un-merge-state/un-merge-state.component';

@Component({
  selector: 'unmerge-lrstate',
  templateUrl: './unmerge-lrstate.component.html',
  styleUrls: ['./unmerge-lrstate.component.scss']
})
export class UnmergeLRStateComponent implements OnInit {
  unMerge=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  vId=null
  constructor(public common:CommonService,
    public api:ApiService,
    public modalService:NgbModal) { 
    this.getUnmergeStateList();
  }

  ngOnInit() {
  }

  refresh() {
    this.getUnmergeStateList();
  }

  getUnmergeStateList(){
    this.common.loading++;
    this.api.get("HaltOperations/getUnmergedLrVehicles?")
    .subscribe(res => {
      this.common.loading--;
      console.log("Res:", res);
      this.unMerge = res['data'] || [];
      this.vId=this.unMerge[0].vehicle_id;
      console.log("vvvvvvvvvvvvvvvvvvvvvvvvv",this.vId);
      
      this.setTable();
    }, err => {
      this.common.loading--;
      this.common.showError();
      console.log('Error:', err);
    });
}

setTable() {
  this.table.data = {
    headings: this.generateHeadings(),
    columns: this.genearateColumns()
  }
}

generateHeadings() {
  let headings = {};
  for (let key in this.unMerge[0]) {
    if (key.charAt(0) != "_") {
      headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
    }
  }
  return headings;
}

genearateColumns() {
  let columns = [];
  this.unMerge.map(unMergeState=> {
    let column = {};
    for (let key in this.generateHeadings()) {
      if (key == 'Action') {
        column['Action'] = { class: "fas fa-eye", action:this.lrState.bind(this,unMergeState.vehicle_id)}
      
      } else {
        column[key] = { value: unMergeState[key], class:"black"};
      }
    }
    columns.push(column);
  });
  return columns;
}

formatTitle(title) {
  return title.charAt(0).toUpperCase() + title.slice(1)
}


lrState(vid){
  this.common.params=vid
  const activeModal = this.modalService.open(UnMergeStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

}
  }



