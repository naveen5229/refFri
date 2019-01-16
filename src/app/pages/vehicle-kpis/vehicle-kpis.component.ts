import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpisDetailsComponent } from '../../modals/kpis-details/kpis-details.component';

@Component({
  selector: 'vehicle-kpis',
  templateUrl: './vehicle-kpis.component.html',
  styleUrls: ['./vehicle-kpis.component.scss']
})
export class VehicleKpisComponent implements OnInit {


  kpis = [];
  allKpis = [];
  searchTxt = '';
  filters = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService:NgbModal) {
    this.getKPIS();
  }

  ngOnInit() {
    console.log('ionViewDidLoad DriverKpisPage');
  }

  getKPIS() {
    this.common.loading++;
    this.api.get('VehicleKpis')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.allKpis = res['data'];
        this.kpis = res['data'];
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
    // let modal = this.modalCtrl.create('KpiLocationPage', {
    //   location: {
    //     lat: kpi.x_tlat || 26.9124336,
    //     lng: kpi.x_tlong || 75.78727090000007,
    //     time: kpi.x_ttime || new Date()
    //   }
    // });
    // modal.present();
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
    this.filters= ['all'];
    this.allKpis.map(kpi => {
      if (this.filters.indexOf(kpi.showprim_status) == -1) {
        this.filters.push(kpi.showprim_status);
      }
    });


  }
  showDetails(kpi){
    this.common.params = {kpi};
    const activeModal= this.modalService.open(KpisDetailsComponent,{ size:'lg',container:'nb-layout'});
    activeModal.componentInstance.modalHeader='kpisDetails';
    
  }


}

