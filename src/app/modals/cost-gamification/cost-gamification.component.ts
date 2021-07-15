import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
// import { AutoCompleteModule } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'cost-gamification',
  templateUrl: './cost-gamification.component.html',
  styleUrls: ['./cost-gamification.component.scss']
})
export class CostGamificationComponent implements OnInit {

  placementData = [];
  siteData = [];
  vehicleData = [];
  placementDate;

  items = [
    {
      siteId: 0,
      siteName: '',
      dayIndex: 1,
      vehicleId: 0,
      truckRegno: ''
    }
  ]

  previousCost;
  previousPenalty;
  newPenalty;
  newCost;
  showNewCostData: boolean = false;

  constructor(
    private common: CommonService,
    private activeModal: NgbActiveModal,
    private api: ApiService
    ) { 
   this.placementData =  this.common.params.data;
   this.placementDate = this.common.params.placementDate;
   this.getData();
  }

  getData(){
    let vehicleCostPacketData = [];
      this.placementData['siteVehicleCostPackets'].forEach(element => {
        this.siteData.push({
          siteId: element.siteId,
          siteName: this.newSiteName(element),
          dayIndex: element.dayIndex        
        });

        vehicleCostPacketData.push(element.vehicleCostPacket)
      });
      vehicleCostPacketData.push(this.placementData['unallocatedVehicles']);
      console.log('vehicleCostPacketData :', vehicleCostPacketData);
      vehicleCostPacketData.forEach(item => {
        item.forEach(element => {
          this.vehicleData.push({
            vehicleId: element.vehicleId,
            truckRegno: element.truckRegno
          })
        });
      })

      this.previousCost = this.placementData['completeCost'];
      this.previousPenalty = this.placementData['completePenalty'];
  }

  newSiteName(element){
    let newSiteName;
    let newDayIndex;

    if(element.dayIndex === 1){
      newDayIndex = 'Today'
    }else if(element.dayIndex === 2){
      newDayIndex = 'Today + 1'
    } else if(element.dayIndex === 3){
      newDayIndex = 'Today + 2'
    } else if( element.dayIndex === 4){
      newDayIndex = 'Today + 3'
    }
    
    newSiteName = element.siteName + ' - ' + newDayIndex;

    return newSiteName;
  }

  ngOnInit(): void {
  }

  addMoreItems(index) {
    this.items.push({
      siteId: 0,
      siteName: '',
      dayIndex: 1,
      vehicleId: 0,
      truckRegno: ''
    });
  }


  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  siteDetails(site, index){
    this.items[index]['siteId'] = site['siteId'];
    this.items[index]['siteName'] = site['siteName'];
    this.items[index]['dayIndex'] = site['dayIndex'];
  }

  vehicleDetails(vehicle, index){
    this.items[index]['vehicleId'] = vehicle['vehicleId'];
    this.items[index]['truckRegno'] = vehicle['truckRegno'];
  }

  saveCostGamificationData(){
    console.log('this.items: ', this.items, this.placementData)
    let params = {
      costGamification: this.items,
      placementData: this.placementData,
      placementDate: this.common.dateFormatter1(this.placementDate)
    }
    console.log('params is: ', params);
    

    this.common.loading ++;
    this.api.postJavaPortDost(8084, 'costGamification', params)
      .subscribe(res => {
        this.common.loading --;
        console.log('response is: ', res);
        this.newCost = res['data'].completeCost;
        this.newPenalty = res['data'].completePenalty;
        this.showNewCostData = true;
      }, err => {
        this.common.loading --;
        console.log(err);
      })
  }

}
