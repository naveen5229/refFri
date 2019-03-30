import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'lrview',
  templateUrl: './lrview.component.html',
  styleUrls: ['./lrview.component.scss']
})
export class LRViewComponent implements OnInit {
  lrId = null;
  constructor(
    public common: CommonService
  ) { 
    this.lrId = this.common.params.lrId;
    console.log("LR ID", this.lrId);
  }

  ngOnInit() {
  }

}
