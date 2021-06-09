import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";

@Component({
  selector: 'placement-constraints',
  templateUrl: './placement-constraints.component.html',
  styleUrls: ['./placement-constraints.component.scss']
})
export class PlacementConstraintsComponent implements OnInit {

  plantStatus = false;
  vehicleStatus = false;
  select = 0;
  sltVehicle = 0;
  activeTab = 'plant';
  plantIdForSave = null;
  plantNameForSave = '';
  vehicleIdForSave = null;
  isPlantInclusive: boolean = false;
  isVehicleInclusive: boolean = false;
  plantSiteId;
  plantSiteName;

  vehVehicleId;
  vehVehicleName;

  tabData = {
    plant: true,
    vehicle: false
  }

  vehicleIdRegnoPairs = [
    {
      vehicleId: 0,
      regno: null,
    }
  ];

  siteIdNamePairs = [
    {
      siteId: 0,
      siteName: null,
    }
  ];

  constructor(public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  refreshPlant() {
    this.plantStatus = false;
    this.vehicleIdRegnoPairs = [
      {
        vehicleId: 0,
        regno: null,
      }
    ];
  }

  refreshVehicle() {
    this.vehicleStatus = false;
    this.siteIdNamePairs = [
      {
        siteId: 0,
        siteName: null,
      }
    ];
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectplnt(event, index) {
    this.plantIdForSave = event['id'];
    this.plantStatus = true;
    this.getPreviousDataUsingPlant(event['id'], event['name']);
    console.log("Plant:", event);
  }

  getPreviousDataUsingPlant(pltId, pltName) {
    this.plantSiteId = pltId;
    this.plantSiteName = pltName;
    let constraintType;
    if (this.select === 0) {
      constraintType = true;
      this.isPlantInclusive = true;
    } else {
      constraintType = false;
      this.isPlantInclusive = false;
    }

    this.refreshGetPreviousDataUsingPlant(constraintType);
  }

  refreshGetPreviousDataUsingPlant(type){
    console.log('type is: ', type)
    this.common.loading++;
    this.api.getJavaPortDost(8084, `getVehicleSiteConstraints/${this.plantSiteId}/${type}/true`)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleIdRegnoPairs = [];
        if (res['data']['vehicleSiteConstraints'] && res['data']['vehicleSiteConstraints'].length) {
          res['data']['vehicleSiteConstraints'].forEach(element => {
            if (element.vehicleId) {
              this.vehicleIdRegnoPairs.push({
                vehicleId: element.vehicleId,
                regno: element.regno
              })
            }
          });
        } else {
          this.vehicleIdRegnoPairs.push(
            {
              vehicleId: 0,
              regno: null,
            }
          )
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getVehicleForPlant(event, index) {
    this.vehicleIdRegnoPairs[index]['vehicleId'] = event['id'];
    this.vehicleIdRegnoPairs[index]['regno'] = event['regno'];
  }

  addMoreItems(i) {
    this.vehicleIdRegnoPairs.push({
      vehicleId: 0,
      regno: null
    });
    console.log("items:", this.vehicleIdRegnoPairs)
  }

  savePlantData() {
    console.log("jsonData:", JSON.stringify(this.vehicleIdRegnoPairs))
    let newVehicleIdRegnoPairs = [];
    this.vehicleIdRegnoPairs.forEach(item => {
      newVehicleIdRegnoPairs.push({
        vehicleId: item.vehicleId,
        siteId: this.plantSiteId,
        isInclusive: this.isPlantInclusive,
        isRefPlant: true,
        regno: item.regno,
        siteName: this.plantSiteName
      })
    })
    let params = {
      isInclusive: this.isPlantInclusive,
      isRefPlant: true,
      vehicleSiteConstraints: newVehicleIdRegnoPairs
    }
    console.log("savePlantParam:", params);
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'saveVehicleSiteConstraints', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
        }
        this.refreshPlant();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  // Vehicle placement Constraints

  selectVehicle(event) {
    this.vehicleIdForSave = event['id'];
    this.vehicleStatus = true;
    console.log('vehicle event: ', event)
    this.getPreviousDataUsingVehicle(event['id'], event['regno']);
  }

  getPreviousDataUsingVehicle(id, regno) {
    this.vehVehicleId = id;
    this.vehVehicleName = regno
    let vehConstraints;
    if (this.sltVehicle === 0) {
      vehConstraints = true;
      this.isVehicleInclusive = true;
    } else {
      vehConstraints = false;
      this.isVehicleInclusive = false;
    }
    this.refeshVehicleData(vehConstraints)
    
  }

  refeshVehicleData(type){
    this.common.loading++;
    this.api.getJavaPortDost(8084, `getVehicleSiteConstraints/${this.vehVehicleId}/${type}/false`)
      .subscribe(res => {
        this.common.loading--;
        this.siteIdNamePairs = [];
        if (res['data']['vehicleSiteConstraints'] && res['data']['vehicleSiteConstraints'].length) {
          res['data']['vehicleSiteConstraints'].forEach(element => {
            if (element.siteId) {
              this.siteIdNamePairs.push({
                siteId: element.siteId,
                siteName: element.siteName
              })
            }
          });
        } else {
          this.siteIdNamePairs.push(
            {
              siteId: 0,
              siteName: null,
            }
          )
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  selectPlantForVehicle(event, index) {
    console.log("plantEvent:", event);
    this.siteIdNamePairs[index]['siteId'] = event['id'];
    this.siteIdNamePairs[index]['siteName'] = event['name'];
  }

  addItemsForVehicle() {
    this.siteIdNamePairs.push({
      siteId: 0,
      siteName: null
    });
  }

  saveVehicleData() {
    console.log("jsonData:", JSON.stringify(this.vehicleIdRegnoPairs))
    let newSiteIdNamePair = [];
    this.siteIdNamePairs.forEach(item => {
      newSiteIdNamePair.push({
        vehicleId: this.vehVehicleId,
        siteId: item.siteId,
        isInclusive: this.isVehicleInclusive,
        isRefPlant: false,
        regno: this.vehVehicleName,
        siteName: item.siteName,
      })
    })
    let params = {
      isInclusive: this.isVehicleInclusive,
      isRefPlant: false,
      vehicleSiteConstraints: newSiteIdNamePair
    }
    console.log("saveVehicleParams:", params);
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'saveVehicleSiteConstraints', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
