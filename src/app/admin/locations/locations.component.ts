import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { FoSiteAliasComponent } from '../../modals/fo-site-alias/fo-site-alias.component';
@Component({
  selector: 'locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  location = null;
  data = [];
  table = null;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    console.log("refresh");
  }
  saveLocation() {
    this.data = [];
    this.table = null;

    let params = "search=" + this.location;
    this.common.loading++;
    this.api.get('Suggestion/getLocations?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
        }

        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  setTable() {
    let headings = {
      name: { title: 'name', placeholder: 'name' },
      district: { title: 'district', placeholder: 'district' },
      state: { title: 'state', placeholder: 'state' },
      latitude: { title: 'latitude', placeholder: 'latitude' },
      longitude: { title: 'longitude', placeholder: 'longitude' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },


    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        name: { value: req.name, action: this.Maplocation.bind(this, req) },
        district: { value: req.district },
        state: { value: req.state },

        latitude: { value: req.latitude == null ? "-" : req.latitude },
        longitude: { value: req.longitude == null ? "-" : req.longitude },
        action: {
          value: '', isHTML: false, action: null, icons: [

            { class: 'fa fa-trash', action: this.deleteLocation.bind(this, req) }

          ]
        },
        rowActions: {
          click: 'selectRow'
        }
      };
      columns.push(column);
    });
    return columns;
  }


  ADD() {
    this.common.params = { title: 'Location Selection' };
    const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // if (data.response) {
      this.saveLocation();
      // }
    })
  }
  OpenFoAlias(){
    const activeModal = this.modalService.open(FoSiteAliasComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // if (data.response) {
      this.saveLocation();
      // }
    })
  }

  Maplocation(latlng) {
    let location = {
      lng: latlng.longitude,
      lat: latlng.latitude
    }
    console.log('location:', location);
    let title = 'Location'
    this.common.params = { location, title };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
  }

  deleteLocation(LocDetails) {
    let params = {
      locationId: LocDetails._id
    }
    if (LocDetails._id) {
      this.common.params = {
        title: 'Delete Location ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('sitesOperation/deleteLocationDetails', params)
            .subscribe(res => {
              console.log("data", res);
              this.common.loading--;
              if (res['data'][0].r_id > 0) {
                this.common.showToast('Success');
                this.saveLocation();
              }
              else {
                this.common.showToast(res['data'].r_msg);
              }


            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
    
  }





















  //   let params = {
  //     locationId: LocDetails._id
  //   }
  //   this.common.loading++;
  //   this.api.post('sitesOperation/deleteLocationDetails', params)
  //     .subscribe(res => {
  //       this.common.loading--;

  //       if (res['code'] == 1) {
  //         this.openConrirmationAlert(res);
  //       }

  //     }, err => {
  //       this.common.loading--;
  //       this.common.showError();
  //     });
  // }
  // openConrirmationAlert(data) {

  //   if (data.code == 1) {
  //     this.common.params = {
  //       title: data.msg,
  //       description: " Do you want to continue ?"
  //     }
  //     const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //     activeModal.result.then(data => {
  //       if (data.response) {
  //         this.saveLocation();
  //       }
  //     });
  //   }
  // }
}