import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateService } from '../../services/date.service';
import { MapService } from '../../services/map.service';
import { AccountService } from '../../services/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlacementoptimizeComponent } from '../../modals/placementoptimize/placementoptimize.component';
import { PlacementOptimisationOnMapComponent } from '../../modals/placement-optimisation-on-map/placement-optimisation-on-map.component';

@Component({
  selector: 'placementoptimization',
  templateUrl: './placementoptimization.component.html',
  styleUrls: ['./placementoptimization.component.scss']
})
export class PlacementoptimizationComponent implements OnInit {

  placementProblemDTO=[];
  totalCost=null;
  totalPanelty=null;
 
  isTblActive=false;
  isVisible=true;
  isActive=true;
  tblshowhide='-';
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
  plcId=-1;

  items = [
    {
      siteId: 0,
      siteName:'',
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null,
      onward24Hrs:null,
      atPlant:null,
      towards:null
    }
  ];





  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public accountService: AccountService,
    public modalService: NgbModal,
    public user: UserService,
    public map: MapService) {
      // this.getPreviousData(null);
     }

  ngOnInit(): void {
  }

  tblShowHides(data){
    if(data){
      this.isActive=false;
      this.tblshowhide='+'
    }else{
      this.isActive=true;
      this.tblshowhide='-';
    }
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

  getDate(event) {
    this.placementDate=event;
    this.getPreviousData(this.placementDate);
 }

 showDataOnMap(event,latitude,longitude,name){
   console.log(event,latitude,longitude,name);
   this.common.params = { data: event,latitude:latitude,longitude:longitude,regno:name }
    const activeModal = this.modalService.open(PlacementoptimizeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
 }

 showAllData(data){
   console.log("All Data:",data);
   this.common.params = { data:data }
    const activeModal = this.modalService.open(PlacementOptimisationOnMapComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
 }


  getPreviousData(date?){
    if(date){
      this.placementDate=date;
    }
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getPreviousData/'+ this.common.dateFormatter1(this.placementDate))
      .subscribe(res => {
        this.common.loading--;
        // console.log("getPreviousData:",res['placementProblemDetailsDTO']);
        if(res['placementProblemDetailsDTO'] && res['placementProblemDetailsDTO'].length>0){
          this.name=res['name'];
          this.select=res['allocType'];
          this.items=res['placementProblemDetailsDTO'];
          this.plcId=res['id'];
        }else{
          console.log("Test");
          this.plcId=res['id'];
          this.placementOPT=null;
          this.items=[];
          this.items.push({
            siteId: 0,
            siteName:'',
            waitingTime: null,
            minQuantity: null,
            maxQuantity: null,
            penaltyMin: null,
            penaltyMax: null,
            onward24Hrs:null,
            atPlant:null,
            towards:null
          });
          
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  selectplnt(plant, index) {
    this.items[index]['siteId'] = plant['id'];
    this.items[index]['siteName']=plant['name'];

    this.getSiteDetails(plant['id'],index);
    
    console.log("----------", this.items[index]['siteId'])
  }


  addMoreItems(index) {
    // console.log("addmore items on ", index);
    this.items.push({
      siteId: 0,
      siteName:'',
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null,
      onward24Hrs:null,
      atPlant:null,
      towards:null
    }
    );
  }

  getSiteDetails(event,index){
    console.log("siteDetails:",event);

    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getSiteDetails/'+ event)
      .subscribe(res => {
        this.common.loading--;
        console.log("siteDet:",res);
        this.items[index].onward24Hrs=res['onward24Hrs'];
        this.items[index].atPlant=res['atPlant'];
        this.items[index].towards=res['towards'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  savePlacementOptimization() {
    console.log("jsonData:", JSON.stringify(this.items))
    let params = {
      name: this.name,
      allocType: this.select,
      placementDate: this.common.dateFormatter1(this.placementDate),
      placementProblemDetailsDTO: (this.items),
      id:this.plcId
    }
    console.log("param:", params);


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
          this.totalCost=this.placementOPT['completeCost'];
          this.totalPanelty=this.placementOPT['completePenalty'];
          

          console.log("siteData:", this.placementOPT);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
