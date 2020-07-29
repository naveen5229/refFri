import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { LrPodDashboardComponent } from '../../modals/LRModals/lr-pod-dashboard/lr-pod-dashboard.component';
@Component({
  selector: 'pod-dashboard',
  templateUrl: './pod-dashboard.component.html',
  styleUrls: ['./pod-dashboard.component.scss']
})
export class PodDashboardComponent implements OnInit {
  chart = {
    type: '',
    data: {},
    options: {},
    elements: {},
    lables: [],
    yAxes: [],
    ticks: {},
    min: '',
    max: '',
    stepSize: '',
    startAngle: '',
    backgroundColor: [],
    legend: {}

  };

  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  allPendingPODs = [];
  pendingPODs = [];
  states = [];
  chartData = {
    labels: [],
    data: []
  };

  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getPendingPods();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.getPendingPods();
  }

  getPendingPods() {
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getPendingPods')
      .subscribe(res => {
        this.common.loading--;
        console.info('Res:', res);
        this.allPendingPODs = res['data']['result'];
        this.pendingPODs = res['data']['result'];
        this.states = res['data']['summary'];
        this.handleChart();
        this.generateTable();
      }, err => {   
        this.common.loading--;
        this.common.showError();
      });
  }

  handleChart() {
    this.chart.type = 'pie';
    this.chart.data = {
      labels: this.states.map(state => { return state['State Name'] }),
      datasets: [
        {
          label: 'Zones',
          data: this.states.map(state => { return state.count }),
          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111",]
        },
      ]
    };

    legend: {
      display: false
    }

    this.chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },


    };
    console.log('This:', this.chart);
  }

  generateTable() {
    this.table = {
      data: {
        headings: this.getHeadings(),
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    };
  }

  getHeadings() {
    let headings = {};
    for (var key in this.allPendingPODs[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        if (key === 'LR Date') {
          headings[key]['type'] = 'date';
        }
      }
    }
    headings['Action'] = { title: 'Action', hideSearch: true };
    return headings;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];

    this.pendingPODs.map(pendingPOD => {
      console.log("pendingpod",pendingPOD);
      let column = {};
      for (let key in this.getHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            action: null,
            icons: [
              { class: 'fa fa-user', action: this.changeState.bind(this, pendingPOD) },
              { class: 'fa fa-tasks', action: this.getPodImage.bind(this, pendingPOD._doc_id) },
              { class: 'fa fa-picture-o', action: this.viewLRImages.bind(this, pendingPOD._img_url2) }]
          };
        } else {
          column[key] = { value: pendingPOD[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    console.log('Columns:', columns);
    return columns;
  }

  changeState(pendingPOD) {
    console.log('pendingPOD', pendingPOD);
    this.common.params = { details: pendingPOD };
    const activeModal = this.modalService.open(LrPodDashboardComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {
        this.getPendingPods();
      }
    });
  }

  // viewPODImages(url) {
  //   let images = url.split(',').map(image => {
  //     return { name: 'POD', image }
  //   });

  //   this.common.params = { images, title: 'POD Image' };
  //   this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });
  // }

  getPodImage(receipt) {
    console.log("val===", receipt);
    let refdata = {
      refid: "",
      reftype: "",
      doctype: "",
      docid: receipt
    }
    console.log("receipts",refdata);
    this.common.params = { refdata: refdata, title: 'docImage' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', windowClass: 'imageviewcomp' });
  }

  viewLRImages(url) {
    let images = [{
      name: "Lr",
      image: url
    }];
    this.common.params = { images, title: 'Lr Image' };
    this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });
  }

  filterPODs(state) {
    if (state === 'all') {
      this.pendingPODs = this.allPendingPODs;
    } else {
      this.pendingPODs = this.allPendingPODs.filter(pod => {
        if (pod._state_id == state._state_id) {
          return true;
        }
        return false;
      });
    }
    this.generateTable();
  }
}
