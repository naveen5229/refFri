import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateService } from '../../services/date.service';
import { MapService } from '../../services/map.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'placementoptimization',
  templateUrl: './placementoptimization.component.html',
  styleUrls: ['./placementoptimization.component.scss']
})
export class PlacementoptimizationComponent implements OnInit {
  planid= 0;
  weighttime:any;
  maxqty:any;
  minqty:any;
  minpanalty:any;
  maxpanalty:any;
  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public accountService: AccountService,
    public user: UserService,
    public map : MapService) { }

  ngOnInit(): void {
  }
  selectplnt(value){
    this.planid = value.id;
  }
}
