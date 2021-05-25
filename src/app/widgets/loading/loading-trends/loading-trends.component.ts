import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import * as _ from "lodash";

@Component({
  selector: 'loading-trends',
  templateUrl: './loading-trends.component.html',
  styleUrls: ['./loading-trends.component.scss']
})
export class LoadingTrendsComponent implements OnInit {
  loadingAged = [];
  chart2 = {
    type: '',
    data: {},
    options: {},
  };

  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getLoadingAged();
    }
    getDetials(url, params, value = 0, type = 'days') {
      let dataparams = {
        view: {
          api: url,
          param: params,
          type: 'post'
        },
  
        title: 'Details'
      }
      if (value) {
        let startDate = type == 'months' ? new Date(new Date().setMonth(new Date().getMonth() - value)) : new Date(new Date().setDate(new Date().getDate() - value));
        let endDate = new Date();
        dataparams.view.param['fromdate'] = this.common.dateFormatter(startDate);
        dataparams.view.param['todate'] = this.common.dateFormatter(endDate);
      }
      console.log("dataparams=", dataparams);
      this.common.handleModalSize('class', 'modal-lg', '1100');
      this.common.params = { data: dataparams };
      const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    }
    getLoadingAged() {
      this.loadingAged = [];
     //  this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord: 3,
        groupdays: 7
      };
      this.api.post('Tmgreport/GetLoadingAged', params)
        .subscribe(res => {
          console.log('loadingAged:', res['data']);
          if (res['data']) {
            this.loadingAged = res['data'].filter(aged => aged.Location);
          }
          if (this.loadingAged.length > 0) this.handleChart2(params.fromdate, params.todate);
        //  this.hideLoader(index);
        }, err => {
         //  this.hideLoader(index);
          console.log('Err:', err);
        });
    }

    handleChart2(fromdate, todate) {
      let xaxis = [];
      let Periods = _.groupBy(this.loadingAged, 'Period');
      console.log('Periods ', Periods);
      let site_names = _.groupBy(this.loadingAged, 'Location');
      let yaxis = [];
      let datasets = Object.keys(site_names)
        .map(site_name => {
          let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          yaxis.push(...site_names[site_name].map(item => item['Loading Count']))
          return {
            label: site_name,
            backgroundColor: color,
            borderColor: color,
            fill: false,
            pointHoverRadius: 8,
            borderWidth: 3,
            data: this.common.chartScaleLabelAndGrid(site_names[site_name].map(item => item['Loading Count'])).scaleData
          }
        });
      // let datasets = Object.keys(sites)
      // .map(site => {
      //   let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      //   yaxis.push(...sites[site].map(item => item['loadcount']))
      //   return {
      //     label: site,
      //     backgroundColor: color,
      //     borderColor: color,
      //     borderWidth: 1,
      //     data: sites[site].map(item => item['loadcount'])
      //   }
      // });
      console.log('DataSets:', datasets);
      console.log("handleChart2", xaxis, yaxis);
      this.chart2.type = 'line';
      this.chart2.data = {
        labels: Object.keys(Periods),
        datasets
      };
      this.chart2.options = {
        responsive: true,
        legend: {
          position: 'bottom',
          display: true
        },
        scaleLabel: {
          display: true,
          fontSize: 17,
        },
  
        maintainAspectRatio: false,
        title: {
          display: true,
        },
        display: true,
        elements: {
          line: {
            tension: 0
          }
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Trip Counts',
              fontSize: 16,
            },
  
          }
  
  
          ]
        },
        onClick: (e, item) => {
          console.log('datasss',item[0]);
          
          let idx = item[0]['_chart']['tooltip'];
          let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
          let endDate = new Date();
          console.log('idx',idx);
          let params = {
            stepno: 1,
            jsonparam: idx['_data']['datasets'][0]['label'],
            fromdate: this.common.dateFormatter(startDate),
            todate: this.common.dateFormatter(endDate),
            totalrecord: 3,
            groupdays: 7
          }
          this.getDetials('Tmgreport/GetLoadingAged', params)
  
        }
  
      };
      console.log("chart2----", this.chart2);
    }
}
