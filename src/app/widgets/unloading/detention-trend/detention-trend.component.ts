import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModelComponent } from '../../../modals/generic-modals/generic-model/generic-model.component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'detention-trend',
  templateUrl: './detention-trend.component.html',
  styleUrls: ['./detention-trend.component.scss']
})
export class DetentionTrendComponent implements OnInit {
  unloadingWorstDestination = [];
  xAxisData = [];
  xAxisData1 = [];
  yaxisObj1 = null;
  yaxisObj2 = null;
  chart1 = {
    data: {
      line: [],
      bar: []
    },
    type: '',
    dataSet: {
      labels: [],
      datasets: []
    },
    yaxisname: "Month",
    options: null
  };
  constructor(private common: CommonService, private modalService: NgbModal, private api: ApiService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getUnloadingWorstDestination();

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
    getUnloadingWorstDestination() {
      this.unloadingWorstDestination = [];
      //this.showLoader(index);
      let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      let endDate = new Date();
      let params = {
        fromdate: this.common.dateFormatter(startDate),
        todate: this.common.dateFormatter(endDate),
        totalrecord: 5
      };
      this.api.post('Tmgreport/GetUnLoadingWorstDestination', params)
        .subscribe(res => {
          console.log('UnloadingWorstDestination:', res['data']);
          this.unloadingWorstDestination = res['data'];
          this.getlabelValue1();
         // this.hideLoader(index);
        }, err => {
         // this.hideLoader(index);
          console.log('Err:', err);
        });
    }
    getlabelValue1() {
      this.xAxisData1 = [];
      if (this.unloadingWorstDestination) {
        this.unloadingWorstDestination.forEach((cmg) => {
          this.chart1.data.line.push(cmg['Detention Days']);
          this.chart1.data.bar.push(cmg['tripcount']);
          this.xAxisData1.push(cmg['destination']);
        });
  
        this.handleChart1();
      }
    }
  
    handleChart1() {
      if (!this.chart1.data.bar.length || !this.chart1.data.line.length) return;
      this.yaxisObj1 = this.common.chartScaleLabelAndGrid(this.chart1.data.bar);
      this.yaxisObj2 = this.common.chartScaleLabelAndGrid(this.chart1.data.line);
      console.log("this.yaxisObj1", this.yaxisObj1, "this.yaxisObj2", this.yaxisObj2);
      let data = {
        labels: this.xAxisData1,
        datasets: []
      };
  
      data.datasets.push({
        type: 'line',
        label: 'Detention Days',
        borderColor: '#ed7d31',
        backgroundColor: '#ed7d31',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFEB3B',
        fill: false,
        data: this.yaxisObj2.scaleData,
        yAxisID: 'y-axis-2'
      });
  
      data.datasets.push({
        type: 'bar',
        label: 'Count',
        borderColor: '#386ac4',
        backgroundColor: '#386ac4',
        fill: false,
        data: this.yaxisObj1.scaleData.map(value => { return value.toFixed(2) }),
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FFEB3B',
        yAxisID: 'y-axis-1',
        yAxisName: 'Trips',
      });
  
      this.chart1 = {
        data: {
          line: [],
          bar: []
        },
        type: 'bar',
        dataSet: data,
        yaxisname: "Count",
        options: this.setChartOptions1()
      };
  
    }
    setChartOptions1() {
      let ids = [];
    this.unloadingWorstDestination.map(tlt => {
      ids.push(tlt['destination']);
    });
      let options = {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        legend: {
          position: 'bottom',
          display: true
        },
        tooltips: {
          mode: 'index',
          intersect: 'true'
        },
        onClick: (e, item) => {
          console.log('ids',ids);
           let idx = item[0]['_index'];
           let startDate = new Date(new Date().setDate(new Date().getDate() - 30));
           let endDate = new Date();
           let params = {
             fromdate: this.common.dateFormatter(startDate),
             todate: this.common.dateFormatter(endDate),
             totalrecord: 5,
             stepno: 1,
             jsonparam: ids[idx],
           };
           this.getDetials('Tmgreport/GetUnLoadingWorstDestination', params)
   
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
          yAxes: [],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Location',
              fontSize: 17
            },
          }],
        }
      }
  
      options.scales.yAxes.push({
        scaleLabel: {
          display: true,
          labelString: 'Count' + this.yaxisObj1.yaxisLabel,
          fontSize: 16
        },
        ticks: { stepSize: this.yaxisObj1.gridSize },
        suggestedMin: this.yaxisObj1.minValue,
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
  
      });
      options.scales.yAxes.push({
        scaleLabel: {
          display: true,
          labelString: 'Detention Days ' + this.yaxisObj2.yaxisLabel,
          fontSize: 16,
        },
        ticks: { stepSize: this.yaxisObj2.gridSize },
        suggestedMin: this.yaxisObj2.minValue,
        // max : 100
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          drawOnChartArea: false,
        },
      });
      return options;
    }
}
