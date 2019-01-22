import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpisDetailsComponent } from '../../modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { from } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';

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
  viewName = "Primary Status";
  data: any;
  options: any;
  themeSubscription: any;

  statusGroup = null;
  groupList = [];
  color = [];
  textColor = [];
  viewIndex = 0;
  viewOtions = [
    {
      name : "Primary Status" ,
      key : "showprim_status"
    },
    {
      name : "Secondry Status" ,
      key : "showsec_status"
    },
    {
      name : "Trip Start" ,
      key : "x_showtripstart"
    },
    {
      name : "Trip End" ,
      key : "x_showtripend"
    },
  ]

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

  getViewType() {
    this.grouping(this.viewType);
  }

  grouping(viewType) {
    console.log('All ', this.allKpis);
    this.kpis = this.allKpis;
    this.statusGroup = _.groupBy(this.allKpis, viewType);
    this.groupList = Object.keys(this.statusGroup);
    let label = [];
    let data = [];
    let clr;
    let tclr;

    console.log(this.statusGroup);
    for (var k in this.statusGroup) {
      if (typeof this.statusGroup[k] !== 'function') {
        let k1 = k + " : " + this.statusGroup[k].length
        label.push(k1);
        data.push(this.statusGroup[k].length);
        let hue = Math.floor((Math.random() * 359) + 1);
        let saturation = '100%';
        let textLightness = '25%';
        let lightness = '75%';
        clr = `hsl(${hue}, ${saturation}, ${lightness})`
        this.color.push(clr);
        tclr = `hsl(${hue}, ${saturation}, ${textLightness})`
        this.textColor.push(tclr);
      }
    }

    this.pieChart(label, data, this.color);
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

  pieChart(label, data, color) {
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
        legend: false,
       };
    });

    setTimeout(() => {
    console.log(document.getElementsByTagName('canvas')[0]);

      document.getElementsByTagName('canvas')[0].style.width = "100px";
      document.getElementsByTagName('canvas')[0].style.height = "220px";
//document.getElementsByTagName('canvas')[0].style = "40px";

    }, 10);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  filterData(filterKey) {
    console.log(filterKey, this.viewType);
    this.kpis = this.allKpis.filter(kpi => {
      if (kpi[this.viewType] == filterKey) return true;
      return false;
    });
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

  changeOptions(type){
    console.log("type",type);
    console.log("viewindex",this.viewIndex);
    if(type==="forward"){
      ++this.viewIndex;
      if(this.viewIndex>this.viewOtions.length-1){
        this.viewIndex = 0;
      }
    }else{
      --this.viewIndex;
      if(this.viewIndex<0){
        this.viewIndex = this.viewOtions.length-1;
      }
    }
    this.viewType = this.viewOtions[this.viewIndex].key;
    this.viewName = this.viewOtions[this.viewIndex].name;
    this.grouping(this.viewType);
  }
  
}



