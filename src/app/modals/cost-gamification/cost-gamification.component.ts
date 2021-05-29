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

  items = [
    {
      siteId: 0,
      siteName: '',
      dayIndex: 1,
      vehicleId: 0,
      truckRegno: ''
    }
  ]

  constructor(
    private common: CommonService,
    private activeModal: NgbActiveModal,
    private api: ApiService
    ) { 
   this.placementData =  this.common.params.data;
   this.getData();
  }

  getData(){
    let vehicleCostPacketData = [];
      this.placementData['siteVehicleCostPackets'].forEach(element => {
        this.siteData.push({
          siteId: element.siteId,
          siteName: element.siteName,
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
      console.log('vehicle data is: ', this.vehicleData)
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
      placementData: this.placementData
    }
    console.log('params is: ', params);
    

    this.common.loading ++;
    this.api.postJavaPortDost(8084, 'costGamification', params)
      .subscribe(res => {
        this.common.loading --;
        console.log('response is: ', res);
      }, err => {
        this.common.loading --;
        console.log(err);
      })
  }

}
