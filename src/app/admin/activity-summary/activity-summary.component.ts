import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';

@Component({
  selector: 'activity-summary',
  templateUrl: './activity-summary.component.html',
  styleUrls: ['./activity-summary.component.scss']
})
export class ActivitySummaryComponent implements OnInit {

  startDate='';
  endDate='';
  activitySummary=[];

  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
    let today;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    this.startDate=this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)));
    console.log('dates ',this.endDate,this.startDate)
    this.getSummary();
   }

  ngOnInit() {
  }

  getSummary(){
  
    const params = "startDate="+this.startDate+
    "&endDate="+this.endDate;
    console.log('params: ', params);
    this.common.loading++;
    this.api.get('FoDetails/getFoActivitySummary?'+params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.activitySummary = res['data'];
        console.log('activitySummary',this.activitySummary);
        if (!(res['data'].length))
          this.common.showToast('record empty !!');
              
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  

}
