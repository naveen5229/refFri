import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { FreightInputWithoutLocationComponent } from '../freight-input-without-location/freight-input-without-location.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'freight-input-location',
  templateUrl: './freight-input-location.component.html',
  styleUrls: ['./freight-input-location.component.scss']
})
export class FreightInputLocationComponent implements OnInit {
  keepGoing = true;
  sourceString = '';
  destinationString = '';

  frieghtDatas = [{
    fixed: null,
    distance: null,
    weight: null,
    weightDistance: null,
    origin: null,
    org_lat: null,
    org_long: null,
    destination: null,
    dest_lat: null,
    dest_long: null,
    routeName: null,
    routeId: null,
    onBasis: 'route'
  },
  ];
  frpId = null;


  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  routes = [];
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
  ) {
    this.frpId = this.common.params.id ? this.common.params.id : null;
    this.common.handleModalSize('class', 'modal-lg', '1300', 'px', 0);
    this.getRoutes()
    this.getFrieghtRateDetails();
    this.addMore();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }


  onChangeAuto(search, type, index) {
    if (type == 'Source') {

      this.sourceString = search;
      console.log('..........', search);
    }
    else {
      this.destinationString = search;
    }
  }

  addCompany() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  addMore() {
    this.frieghtDatas.push({
      fixed: null,
      distance: null,
      weight: null,
      weightDistance: null,
      origin: null,
      org_lat: null,
      org_long: null,
      destination: null,
      dest_lat: null,
      dest_long: null,
      routeName: null,
      routeId: null,
      onBasis: 'route'
    });

  }

  selectLocation(place, type, index) {
    if (type == 'Source') {
      console.log("palce", place);
      this.frieghtDatas[index].org_lat = place.lat;
      this.frieghtDatas[index].org_long = place.long;
      this.frieghtDatas[index].origin = place.location || place.name;
      this.frieghtDatas[index].origin = this.frieghtDatas[index].origin.split(",")[0];
      (<HTMLInputElement>document.getElementById('origin-' + index)).value = this.frieghtDatas[index].origin;
    }
    else {
      console.log("palce", place);
      this.frieghtDatas[index].dest_lat = place.lat;
      this.frieghtDatas[index].dest_long = place.long;
      this.frieghtDatas[index].destination = place.location || place.name;
      this.frieghtDatas[index].destination = this.frieghtDatas[index].destination.split(",")[0];
      (<HTMLInputElement>document.getElementById('destination-' + index)).value = this.frieghtDatas[index].destination;
    }
  }

  takeActionSource(res, index) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.sourceString.length, this.sourceString);

      if (this.keepGoing && this.sourceString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.frieghtDatas[index].origin = res.location.name.split(",")[0];

            (<HTMLInputElement>document.getElementById('origin-' + index)).value = this.frieghtDatas[index].origin;
            this.frieghtDatas[index].org_lat = res.location.lat;
            this.frieghtDatas[index].org_long = res.location.lng;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);

  }


  takeActionDestination(res, index) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.destinationString.length, this.destinationString);

      if (this.keepGoing && this.destinationString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.frieghtDatas[index].destination = res.location.name.split(",")[0];

            (<HTMLInputElement>document.getElementById('destination-' + index)).value = this.frieghtDatas[index].destination;
            this.frieghtDatas[index].dest_lat = res.location.lat;
            this.frieghtDatas[index].dest_long = res.location.lng;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);

  }

  getRouteDetail(type, index) {
    console.log("Type Id", type);
    this.frieghtDatas[index].routeId = this.routes.find((element) => {
      return element.name == type;
    }).id;
    this.frieghtDatas[index].routeName = type;
  }


  saveFrightInput() {
    let params = {
      frpId: this.frpId,
      type: 'location',
      frieghtRateData: JSON.stringify(this.frieghtDatas),
      // filterParams: JSON.stringify(this.filters)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/saveFrieghtRateDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        this.common.showToast(res['data'][0].result);
        this.getFrieghtRateDetails();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getRoutes() {
    this.api.get('ViaRoutes/getRoutes')
      .subscribe(res => {
        this.routes = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



  getFrieghtRateDetails() {
    let params = {
      frpId: this.frpId,
      type: 'location',
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/getFrieghtRateDetails', params)
      .subscribe(res => {
        --this.common.loading;

        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};

        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        this.table.data.headings['action'] = action;


        this.table.data.columns = this.getTableColumns();
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }


  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black' };

      }
      this.valobj['action'] = { class: '', icons: this.freightDelete(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  freightDelete(row) {

    let icons = [];
    icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      },
      {
        class: "fa fa-eye",
        action: this.openWithoutLocationModal.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    console.log("row:", row);
    let params = {
      id: row._id,
      type: 'location',
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FrieghtRate/deleteFrieghtRateDetails', params)
            .subscribe(res => {
              this.common.loading--;
              console.log("Result:", res['data'][0].y_msg);

              this.common.showToast(res['data'][0].y_msg);
              if (res['data'][0].y_id > 0)
                this.getFrieghtRateDetails();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  resetRouteDetail(index) {
    if (this.frieghtDatas[index].onBasis == "source-dest") {
      this.frieghtDatas[index].routeId = null;
      this.frieghtDatas[index].routeName = null;
    } else if (this.frieghtDatas[index].onBasis == "route") {
      this.frieghtDatas[index].origin = null;
      this.frieghtDatas[index].org_lat = null;
      this.frieghtDatas[index].org_long = null;
      this.frieghtDatas[index].destination = null;
      this.frieghtDatas[index].dest_lat = null;
      this.frieghtDatas[index].dest_long = null;
    }
  }

  openWithoutLocationModal(row) {
    this.common.handleModalSize('class', 'modal-lg', '1500', 'px', 1);

    console.log("without location", row);
    let data = {
      frpId: row._frp_id,
      locId: row._id
    }
    this.common.params = { data: data };
    const activeModal = this.modalService.open(FreightInputWithoutLocationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data && data.response) {
        console.log("data", data);
      }
    });
  }
}