import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';

@Component({
  selector: 'add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  title = '';
  orderId = null;
  loadingNo = 1;
  unLoadingNo = 1;
  bidType = '1';

  endTime = null;//new Date(new Date().setDate(new Date().getDate() + 1));
  startTime = new Date(new Date().setHours(new Date().getHours() + 1)) //new Date();

  pickLocationType = 'city';
  startName = null;
  startLat = null;
  startLng = null;
  startLocId = null;

  dropLocationType = 'city';
  endName = null;
  endLat = null;
  endLng = null;
  endLocId = null;

  AdvaceWSetting = 'More (+)';
  isAdvance = false;

  bodies = [];
  bodyId = null;

  weightUnits = [];
  weightUnitId = null;
  weight = null;

  material = {
    name: null,
    id: null
  }

  keepGoing = true;
  searchString = '';
  document = null;
  orderTypeId = 1;
  minWeight = null;
  orderTypes = [{
    id: 1,
    name: 'FTL'
  },
  {
    id: 0,
    name: 'LTL'
  },
  {
    id: 2,
    name: 'Bulk'
  }
  ];
  payTypes = [{
    id: 1,
    name: 'Cash'
  },
  {
    id: 2,
    name: 'Advance'
  }
  ];

  rateCategory = [{
    name : 'No Rate',
    value : '1'
  },
  {
    name : 'Fix Rate',
    value : '2'
  },
  {
    name : 'Flexible Rate',
    value : '3'
  }
]

  paymentId = null;
  remarks = null;
  loadById = null;
  loadByType = null;
  rate = null;
  rateType = '1'
  contactNo = null;
  flexibleTime = 12;


  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) {
    console.log('date',this.startTime)
    this.orderId = this.common.params && this.common.params.order && this.common.params.order.id ? this.common.params.order.id : null;
    this.title = this.common.params && this.common.params.order && this.common.params.order.title ? this.common.params.order.title : null;
    this.AdvaceWSetting = this.title == 'Order Details' ? 'Less (-)' : 'More (+)';
    this.isAdvance = this.title == 'Order Details' ?true:false;
    this.getVehicleBodyTypes();
    this.getWeightUnits();
    if (this.orderId) {
      this.getOrders();
    }
  }

  ngOnInit() {
  }

  getOrders() {
    this.common.loading++;
    let params = {
      x_id: this.orderId,
      loadby_id: null,
      loadby_type: null,
      status: null
    }
    this.api.post('Bidding/GetOrder', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        console.log("test");
        this.setData(res['data'][0]);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getVehicleBodyTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleBodyTypes?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.bodies = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getWeightUnits() {
    this.common.loading++;
    let params = {
      search: 'test'
    }
    this.api.post('suggestion/GetUnit', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.weightUnits = res['data'];
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  selectLocation(event, type) {
    console.log("event", event, "type", type);
    if (type == 'start') {
      this.startLat = event.lat;
      this.startLng = event.long;
      this.startLocId = event.id;
    } else if (type == 'end') {
      this.endLat = event.lat;
      this.endLng = event.long;
      this.endLocId = event.id;
    }

  }

  selectSite(site,type) {
    if (type == 'start') {
      this.startLocId = site.id;
    } else if (type == 'end') {
      this.endLocId = site.id;
    }
  }

  selectMaterial(event) {
    console.log("event", event);
    this.material.id = event.id;
    this.material.name = event.name

  }

  onChangeAuto(search, type) {
    console.log("search", search, "type", type);
    if (type == 'start') {
      this.startLat = null;
      this.startLng = null;
      this.startLocId = null;
      this.startName = null;
    } else if (type == 'end') {
      this.endLat = null;
      this.endLng = null;
      this.endLocId = null;
      this.endName = null;
    }
    this.searchString = search;
    console.log('..........', search);
  }

  takeAction(res, type) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.searchString.length, this.searchString);

      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            console.log('response----', res, res.location, res.id);
            this.keepGoing = true;
            if (res.location.lat) {
              if (type == 'end') {
                this.endName = res.location.name;

                (<HTMLInputElement>document.getElementById('endname')).value = this.endName;
                this.endLat = res.location.lat;
                this.endLng = res.location.lng;
                this.endLocId = res.id;
                this.keepGoing = true;
              }
              if (type == 'start') {
                this.startName = res.location.name;

                (<HTMLInputElement>document.getElementById('endname')).value = this.endName;
                this.startLat = res.location.lat;
                this.startLng = res.location.lng;
                this.startLocId = res.id;
                this.keepGoing = true;
              }
            }
          }
        })

      }
    }, 1000);

  }

  closeModal(status) {
    this.activeModal.close({ response: status });
  }

  advSetting() {
    this.AdvaceWSetting = this.isAdvance ? 'More (+)' : 'Less (-)';
    this.isAdvance = !this.isAdvance;

  }

  // image convert into base 64

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then((res: any) => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type, res);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png") {
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg");
          return false;
        }
        this.document = res;

        // this.newFastag[type] = res.split('base64,')[1];
        console.log("this.document", this.document)
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  setData(data) {
    this.pickLocationType = data.pickup_id > 0 ? 'site':'city'
    this.startLocId = data.pickup_id;
    this.startName = data.pickup_name;
    this.startTime = data.pickup_time?new Date(data.pickup_time) : new Date();
    this.dropLocationType = data.endLocId > 0 ? 'site':'city'
    this.endName = data.drop_name;
    this.endLocId = data.drop_id;
    this.endTime = data.drop_time?new Date(data.drop_time) : new Date();
    this.bodyId = data.body_type;
    this.weight = data.weight;
    this.weightUnitId = data.weight_unit;
    this.rate = data.rate;
    this.material.id = data.material_id;
    this.material.name = data.material_name;
    this.loadByType = data.loadby_type;
    this.loadById = data.loadby_id;
    this.paymentId = data.paytype;
    this.remarks = data.remarks;
    this.bidType = ''+data.bid_type;
    this.contactNo = data.mobileno;
    this.loadingNo = data.nol;
    this.unLoadingNo = data.noul;
    this.rateType = data.rate_type;
    this.flexibleTime= data.pickup_flex_hrs;
    this.orderTypeId = data.order_type;
    this.minWeight = data.min_weight
    console.log("this.material.name",this.material.name,"endTime",this.endTime)

  }

  saveData() {
    this.common.loading++;
    let params = {
      x_id: this.orderId,
      remarks: this.remarks,
      paytype: this.paymentId,
      docimage: this.document,
      loadby_id: this.loadById,
      loadby_type: this.loadByType,
      rate: this.rate,
      weight_unit: this.weightUnitId,
      weight: this.weight,
      body_type: this.bodyId,
      material_id: this.material.id,
      drop_time: this.endTime ? this.common.dateFormatter(this.endTime) : null,
      drop_id: this.endLocId,
      pickup_time: this.common.dateFormatter(this.startTime),
      pickup_id: this.startLocId,
      bidType: this.bidType,
      mobileNo : this.contactNo,
      noLoding :this.loadingNo,
      noUnloding : this.unLoadingNo,
      rateType : this.rateType,
      pickupFlexHrs : this.flexibleTime,
      orderTypeId :this.orderTypeId,
      minWeight : this.minWeight
    }
    this.api.post('Bidding/SaveOrder', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.closeModal({ response: true });
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
}
