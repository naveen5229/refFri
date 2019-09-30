import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'un-merge-state',
  templateUrl: './un-merge-state.component.html',
  styleUrls: ['./un-merge-state.component.scss']
})
export class UnMergeStateComponent implements OnInit {
  unMergeState=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor( public common:CommonService,
    public api:ApiService,
    public activeModal:NgbActiveModal) {
      console.log("-------------",this.common.params);

      
     }

  ngOnInit() {
  }


closeModal() {
  this.activeModal.close();
}
}
