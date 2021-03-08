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

  isVisible=true;
  showHides='-';
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: "68vh",
    }
  };

  headings = [];
  valobj = {};

  placementId = null;
  placementOPT = null;
  optimizeArray = [];
  select = 0;
  name = '';
  placementDate = new Date();

  items = [
    {
      siteId: 0,
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null
    }
  ];





  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public accountService: AccountService,
    public user: UserService,
    public map: MapService) { }

  ngOnInit(): void {
  }

  showHide(isvisible){
    if(isvisible){
      this.isVisible=false;
      this.showHides='+';
    }else{
      this.isVisible=true;
      this.showHides='-'
    }
  }

  selectplnt(plant, index) {
    this.items[index]['siteId'] = plant['id'];
    console.log("----------", this.items[index]['siteId'])
  }


  addMoreItems(index) {
    // console.log("addmore items on ", index);
    this.items.push({
      siteId: 0,
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null
    }
    );
  }

  savePlacementOptimization() {
    console.log("jsonData:", JSON.stringify(this.items))
    let params = {
      name: this.name,
      allocType: this.select,
      placementDate: this.placementDate,
      placementProblemDetailsDTO: (this.items)
    }
    console.log("param:", params);
    // console.log("siteData:",this.siteData);


    this.common.loading++;
    this.api.postJavaPortDost(8084, 'addPlacement', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.showData(res['data']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  showData(placementId) {
    console.log("param:", placementId);
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'placementOP/' + placementId)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.placementOPT = res['data'];
          // this.optimizeArray=this.placementOPT.map(o => {return { name: o.name, courseid: o.courseid };
          // });

          console.log("siteData:", this.placementOPT);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
