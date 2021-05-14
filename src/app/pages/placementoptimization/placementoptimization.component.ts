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
import { PlacementConstraintsComponent } from '../../modals/placement-constraints/placement-constraints.component';
import { PlacementRequirementComponent } from '../../modals/placement-requirement/placement-requirement.component';

@Component({
  selector: 'placementoptimization',
  templateUrl: './placementoptimization.component.html',
  styleUrls: ['./placementoptimization.component.scss']
})

export class PlacementoptimizationComponent implements OnInit {

  placementProblemDTO = [];
  totalCost = null;
  totalPanelty = null;
  days = 1;

  isTblActive = false;
  isVisible = true;
  isActive = true;
  tblshowhide = '-';
  showHides = '-';
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
  placementDate = new Date();
  plcId = -1;
  dayindx = 1;
  quantityType = 0;

  items = [
    {
      siteId: 0,
      siteName: '',
      waitingTime: 0,
      minQuantity: 0,
      maxQuantity: 0,
      penaltyMin: 0,
      penaltyMax: 200000,
      quantityTillDate: 0,
      quantityOnPlant: 0,
      quantityTowards: 0,
      dayIndex: 1
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
  }

  ngOnInit(): void {
  }

  tblShowHides(data) {
    if (data) {
      this.isActive = false;
      this.tblshowhide = '+'
    } else {
      this.isActive = true;
      this.tblshowhide = '-';
    }
  }

  showHide(isvisible) {
    if (isvisible) {
      this.isVisible = false;
      this.showHides = '+';
    } else {
      this.isVisible = true;
      this.showHides = '-'
    }
  }

  getDate(event) {
    this.placementDate = event;
    // this.getPreviousData(this.days, this.placementDate);
  }

  selectDays(event) {
    let day = 0;
    day = event['target']['options']['selectedIndex'] + 1;
    console.log("daysEvent:", event['target']['options']['selectedIndex']);
    this.days = day;
    // this.getPreviousData(this.days, this.placementDate,);
  }

  showDataOnMap(event, latitude, longitude, name) {
    console.log(event, latitude, longitude, name);
    this.common.params = { data: event, latitude: latitude, longitude: longitude, regno: name }
    const activeModal = this.modalService.open(PlacementoptimizeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  placementReq() {
    const activeModal = this.modalService.open(PlacementRequirementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  constraints() {
    const activeModal = this.modalService.open(PlacementConstraintsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }


  // getPreviousData(days, date?) {
  //   if (date) {
  //     this.placementDate = date;
  //   }
  //   this.common.loading++;
  //   this.api.getJavaPortDost(8084, 'getPreviousData/' + this.common.dateFormatter1(this.placementDate) + '/' + days)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       if (res['placementProblemDetailsDTOS'] && res['placementProblemDetailsDTOS'].length > 0) {
  //         this.select = res['allocType'];
  //         this.items = res['placementProblemDetailsDTOS'];
  //         this.plcId = res['id'];
  //       } else {
  //         this.plcId = res['id'];
  //         this.placementOPT = null;
  //         this.items = [];
  //         this.items.push({
  //           siteId: 0,
  //           siteName: '',
  //           waitingTime: 0,
  //           minQuantity: 0,
  //           maxQuantity: 0,
  //           penaltyMin: 0,
  //           penaltyMax: 200000,
  //           quantityTillDate: 0,
  //           quantityOnPlant: 0,
  //           quantityTowards: 0,
  //           dayIndex: 1
  //         });

  //       }
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }

  selectplnt(plant, index, num) {
    this.items[index]['siteId'] = plant['id'];
    this.items[index]['siteName'] = plant['name'];
    this.getSiteDetails(plant['id'], plant['name'], index);
  }

  getSiteDetails(plantid, plantname, index) {
    console.log("siteDetails:", plantid);
    let quantityTillDate = null;
    let quantityOnPlant = null;
    let quantityTowards = null;
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getSiteDetails/' + plantid)
      .subscribe(res => {
        this.common.loading--;
        console.log("siteDet:", res);
        quantityTillDate = res['quantityTillDate']
        quantityOnPlant = res['quantityOnPlant'];
        quantityTowards = res['quantityTowards'];
        this.items[index].quantityTillDate = res['quantityTillDate'];
        this.items[index].quantityOnPlant = res['quantityOnPlant'];
        this.items[index].quantityTowards = res['quantityTowards'];
        this.addItems(plantid, plantname, quantityTillDate, quantityOnPlant, quantityTowards);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addItems(plantid, plantname, quantityTillDate, quantityOnPlant, quantityTowards) {
    for (let i = 1; i <= this.days - 1; i++) {
      this.items.push({
        siteId: plantid,
        siteName: plantname,
        waitingTime: 0,
        minQuantity: 0,
        maxQuantity: 0,
        penaltyMin: 0,
        penaltyMax: 200000,
        quantityTillDate: quantityTillDate,
        quantityOnPlant: quantityOnPlant,
        quantityTowards: quantityTowards,
        dayIndex: i + 1
      })
    }
  }

  addMoreItems(index) {
    this.items.push({
      siteId: 0,
      siteName: '',
      waitingTime: 0,
      minQuantity: 0,
      maxQuantity: 0,
      penaltyMin: 0,
      penaltyMax: 200000,
      quantityTillDate: 0,
      quantityOnPlant: 0,
      quantityTowards: 0,
      dayIndex: 1
    });
  }

  savePlacementOptimization() {
    let params = {
      allocType: this.select,
      placementDate: this.common.dateFormatter1(this.placementDate),
      quantityType: this.quantityType,
      placementProblemDetailsDTOS: (this.items),
      id: this.plcId
    }
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'PlacementResult', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.placementOPT = res['data'];
          this.totalCost = this.placementOPT['completeCost'];
          this.totalPanelty = this.placementOPT['completePenalty'];
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  fillingFields(id) {
    let params = {
      date: this.common.dateFormatter1(this.placementDate),
      days: this.days,
      quantityType: this.quantityType,
      select: this.select
    }
    if (id === 1) {
      this.manualFill(params);
    } else if (id === 2) {
      this.autoFill(params);
    }
  }

  manualFill(params) {
    this.common.loading++;
    this.api.getJavaPortDost(8084, `manualFill/${params.date}/${params.days}/${params.quantityType}/${params.select}`)
      .subscribe(res => {
        this.common.loading--;
        this.items = [];
        res['placementProblemDetailsDTOS'].map(item => {
          this.items.push(item);
        })
      }, err => {
        this.common.loading--;
        console.log(err);
      })
  }

  autoFill(params) {
    this.common.loading++;
    this.api.getJavaPortDost(8084, `autoFill/${params.date}/${params.days}/${params.quantityType}/${params.select}`)
      .subscribe(res => {
        this.common.loading--;
        this.items = [];
        res['placementProblemDetailsDTOS'].map(item => {
          this.items.push(item);
        });
      }, err => {
        this.common.loading--;
        console.log(err);
      })
  }

  resetFields() {
    console.log('inside resetFields');
    this.items = [];
    this.items.push({
      siteId: 0,
      siteName: '',
      waitingTime: 0,
      minQuantity: 0,
      maxQuantity: 0,
      penaltyMin: 0,
      penaltyMax: 200000,
      quantityTillDate: 0,
      quantityOnPlant: 0,
      quantityTowards: 0,
      dayIndex: 1
    });
  }
}
