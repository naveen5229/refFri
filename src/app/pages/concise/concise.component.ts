import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpisDetailsComponent } from '../../modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { from } from 'rxjs';
import { NbThemeService } from '@nebular/theme';

import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { log } from 'util';


@Component({
  selector: 'concise',
  templateUrl: './concise.component.html',
  styleUrls: ['./concise.component.scss']
})
export class ConciseComponent implements OnInit {

  kpis = [];
  allKpis = [];
  searchTxt = '';
  filters = [];
  viewType = 'showprim_status';
  data: any;
  options: any;
  themeSubscription: any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private theme: NbThemeService,
    private modalService: NgbModal) {
    this.getKPIS();
  }

  ngOnInit() {
  }

  getKPIS() {
    this.common.loading++;
    this.api.get('VehicleKpis')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.allKpis = res['data'];
        this.kpis = res['data'];
        this.grouping(this.viewType);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getViewType(){
    this.grouping(this.viewType);
  }

  grouping(viewType) {
    let groups = _.groupBy(this.kpis, viewType);
    let groupList = Object.keys(groups);
    let label = [];
    let data = [];
    let color = [];
    let clr;    
    for (var k in groups){
      if (typeof groups[k] !== 'function') {
         let k1= k+" : "+groups[k].length
        label.push (k1);
        data.push (groups[k].length );
        clr = `rgba(
                    ${Math.floor((Math.random() * 255) + 1)},
                    ${Math.floor((Math.random() * 255) + 1)},
                    ${Math.floor((Math.random() * 255) + 1)},1)`
        color.push(clr);
      }
  }

    this.pieChart(label,data,color);
  }


  showLocation(kpi) {
    if (!kpi.x_tlat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    this.common.params = { kpi };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'location-marker';

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

  pieChart(label,data,color) {  
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.data = {
        labels: label,
        datasets: [{
          data: data,
          backgroundColor: color
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              display: false,
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}



