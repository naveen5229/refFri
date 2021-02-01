import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpisDetailsComponent } from '../../modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';



import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-kpis',
  templateUrl: './vehicle-kpis.component.html',
  styleUrls: ['./vehicle-kpis.component.scss', '../pages.component.css']
})
export class VehicleKpisComponent implements OnInit {
  kpis = [];
  allKpis = [];
  searchTxt = '';
  filters = [];

  table = {
    data: {
      headings: {
        vehicle: { title: 'Vehicle', placeholder: 'Vehicle' },
        status: { title: 'Status', placeholder: 'Status' },
        hrs: { title: 'Hrs', placeholder: 'Hrs' },
        trip: { title: 'Trip', placeholder: 'Trip' },
        kmp: { title: 'Kmp', placeholder: 'Kmp' },
        location: { title: 'location', placeholder: 'Location' }
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };


  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getKPIS();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
    console.log('ionViewDidLoad DriverKpisPage');
  }
  refresh() {
    console.log('Refresh');
    this.getKPIS();
  }

  getKPIS() {
    this.common.loading++;
    this.api.get('VehicleKpis')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.allKpis = res['data'];
        this.kpis = res['data'];
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  showLocation(kpi) {
    if (!kpi.x_tlat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: kpi.x_tlat,
      lng: kpi.x_tlong,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  findVehicle() {
    if (!this.searchTxt) {
      this.kpis = this.allKpis;
    } else {
      this.kpis = this.allKpis.filter((kpi) => {
        return kpi.x_showveh.toUpperCase().includes(this.searchTxt.toUpperCase());
      });
    }
  }

  findFilters() {
    this.filters = ['all'];
    this.allKpis.map(kpi => {
      if (this.filters.indexOf(kpi.showprim_status) == -1) {
        this.filters.push(kpi.showprim_status);
      }
    });
  }

  showDetails(kpi) {
    this.common.params = { kpi };
    const activeModal = this.modalService.open(KpisDetailsComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'kpisDetails';
  }

  getLR(kpi) {
    this.common.loading++;
    this.api.post('FoDetails/getLorryDetails', { x_lr_id: kpi.x_lr_id })
      .subscribe(res => {
        this.common.loading--;
        this.showLR(res['data'][0]);
        console.log("data", res);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  showLR(data) {
    let images = [
      {
        name: 'Lr',
        image: data.lr_image
      },
      {
        name: 'Invoice',
        image: data.invoice_image
      },
      {
        name: 'Other_Image',
        image: data.other_image
      }
    ];
    console.log("image", images)
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }

  getTableColumns() {
    let columns = [];
    this.allKpis.map(kpi => {
      columns.push({
        vehicle: { value: kpi.x_showveh, action: this.showDetails.bind(this, kpi) },
        status: { value: kpi.showprim_status + (kpi.showsec_status ? ',' + kpi.showsec_status : ''), action: this.showDetails.bind(this, kpi) },
        hrs: { value: kpi.x_hrssince, class: (kpi.x_hrssince >= 24) ? 'red' : '', action: this.showDetails.bind(this, kpi) },
        trip: { value: this.getTripStatusHTML(kpi), action: this.showDetails.bind(this, kpi), isHTML: true },
        kmp: { value: kpi.x_kmph, class: kpi.x_kmph < 20 ? 'pink' : '', action: this.showDetails.bind(this, kpi) },
        location: { value: kpi.Address, action: this.showLocation.bind(this, kpi) },
        rowActions: {
          click: this.showDetails.bind(this, kpi)
        }
      });
    });
    return columns;
  }

  getTripStatusHTML(kpi) {
    let html = '<div>';
    if (kpi.trip_status_type == 0) {
      html += `
      <!-- Heading -->
        <i class="fa fa-arrow-circle-right complete"></i>
        <span class="circle">${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 1) {
      html += `
      <!-- Loading -->
        <span class="circle">${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 2) {
      html += `
      <!-- Onward -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
      `;
    } else if (kpi.trip_status_type == 3) {
      html += `
        <!-- Unloading -->
          <span>${kpi.x_showtripstart}</span>
          <i class="icon ion-md-arrow-round-forward"></i>
          <span class="circle">${kpi.x_showtripend}</span>
        `;
    } else if (kpi.trip_status_type == 4) {
      html += `
      <!-- Complete -->
        <span>${kpi.x_showtripstart}</span>
        <i class="icon ion-md-arrow-round-forward"></i>
        <span>${kpi.x_showtripend}</span>
        <i class="fa fa-check-circle complete"></i>
      `;
    } else {
      html += `
      <!-- Ambigous -->
        <span>${kpi.x_showtripstart}</span>
        <span class="icon ion-md-route-arrow">-</span>
        <span>${kpi.x_showtripend}</span>
      `;
    }
    return html + '</div>';
  }


}

