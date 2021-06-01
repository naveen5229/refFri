import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'placement-cost',
  templateUrl: './placement-cost.component.html',
  styleUrls: ['./placement-cost.component.scss']
})
export class PlacementCostComponent implements OnInit {

  days = 1;

  items = [{
    vehicleId: 0,
    regno: '',
    costPerLoadKm: 0,
    costPerUnloadKm: 0,
    kmPerDayLoad: 0,
    kmPerDayUnload: 0,
    costPerHour: 0,
  }]

  constructor(
    private activeModal: NgbActiveModal,
    private api: ApiService,
    private common: CommonService,
  ) { 
  }

  ngOnInit(): void {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectVehicle(vehicle, i) {
    this.items[i]['vehicleId'] = vehicle['id'];
    this.items[i]['regno'] = vehicle['regno'];
    this.getVehicleDetails(vehicle['id'], vehicle['regno'], i);
  }

  getVehicleDetails(vehicleId, regno, index) {
    this.common.loading++;
    this.api.getJavaPortDost(8084, `getVehiclePlacementCost/${vehicleId}`)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let costPerLoadKm = res['costPerLoadKm'];
        let costPerUnloadKm = res['costPerUnloadKm']
        let kmPerDayLoad = res['kmPerDayLoad']
        let kmPerDayUnload = res['kmPerDayUnload']
        let costPerHour = res['costPerHour']

        this.items[index]['costPerLoadKm'] = res['costPerLoadKm']
        this.items[index]['costPerUnloadKm'] = res['costPerUnloadKm']
        this.items[index]['kmPerDayLoad'] = res['kmPerDayLoad']
        this.items[index]['kmPerDayUnload'] = res['kmPerDayUnload']
        this.items[index]['costPerHour'] = res['costPerHour']

        this.addItems(vehicleId, regno, costPerLoadKm, costPerUnloadKm, kmPerDayLoad, kmPerDayUnload, costPerHour);
      }, err => {
        this.common.loading--;
        console.log(err);

      })
  }

  addItems(vehicleId, regno, costPerLoadKm, costPerUnloadKm, kmPerDayLoad, kmPerDayUnload, costPerHour) {
    for (let i = 1; i <= this.days - 1; i++) {
      this.items.push({
        vehicleId: vehicleId,
        regno: regno,
        costPerLoadKm: costPerLoadKm,
        costPerUnloadKm: costPerUnloadKm,
        kmPerDayLoad: kmPerDayLoad,
        kmPerDayUnload: kmPerDayUnload,
        costPerHour: costPerHour,
      })
    }
  }

  addMoreItems(index) {
    this.items.push({
      vehicleId: 0,
      regno: '',
      costPerLoadKm: 0,
      costPerUnloadKm: 0,
      kmPerDayLoad: 0,
      kmPerDayUnload: 0,
      costPerHour: 0,
    });
  }

  savePlacementCost(){
    let params = {
      vehiclePlacementCosts: this.items
    }

    this.common.loading ++;
    this.api.postJavaPortDost(8084, 'saveVehiclePlacementCost', params)
      .subscribe(res => {
        this.common.loading --;
        console.log('res: ', res);
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading --;
        console.log(err);
      })
  }

}
