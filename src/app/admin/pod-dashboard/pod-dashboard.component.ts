import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { from } from 'rxjs';
import { LrPodDashboardComponent } from '../../modals/LRModals/lr-pod-dashboard/lr-pod-dashboard.component';
import { ConsolidateFuelAverageComponent } from '../consolidate-fuel-average/consolidate-fuel-average.component';
@Component({
  selector: 'pod-dashboard',
  templateUrl: './pod-dashboard.component.html',
  styleUrls: ['./pod-dashboard.component.scss']
})
export class PodDashboardComponent implements OnInit {
  data = [];

  value = [];
  summary = [];
  stateid = null;
  stateName = [];
  stateCount = [];
  Show = [];
  chartObject2 = {
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
    backgroundColor: []
  };

  table = {
    value: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  headings = [];
  valobj = {};


  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {

    this.reset();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    this.reset();
  }
  ngAfterViewChecked() {
    // console.log('CHART DATA:', this.chartObject2.data);
  }

  reset() {
    this.value = [];
    this.table = {
      value: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };

    this.chartObject2 = {
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
    };
    this.stateName = [];
    this.stateCount = [];
    this.summary = [];
    this.headings = [];
    this.valobj = {};
    this.PodDetails();
  }

  PodDetails() {
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getPendingPods')
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];

        this.value = res['data']['result'];
        this.summary = res['data']['summary'];
        // if (this.value == null || this.summary == null) {
        //   this.value = [];
        //   this.summary = [];
        // }
        console.log("Sumaary Data", this.summary);
        console.log("Count:", this.stateCount);
        // this.stateName = [];
        //this.stateCount = [];
        this.summary.forEach(info => {
          this.stateName.push(info['State Name']);
          this.stateCount.push(info.count);
        });
        console.log('', this.stateName, '', this.stateCount);


        if (this.value == null) {
          this.value = [];
          this.table = null;
        }
        let first_rec = this.value[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.value.headings[key] = headerObj;
          }
        }
        // this.showdoughnut();
        this.table.value.columns = this.getTableColumns();
        this.showdoughnut();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];

    this.value.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {

          // this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-task', action: this.view.bind(this, doc.url) }, { class: 'fa fa-task', action: this.view.bind(this, doc.url) }] };
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-user', action: this.change.bind(this, doc) }, { class: 'fa fa-tasks', action: this.view.bind(this, doc._img_url) }, { class: 'fa fa-picture-o', action: this.lrview.bind(this, doc._img_url2) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  showdoughnut() {
    this.chartObject2.type = 'pie';
    this.chartObject2.data = {
      // labels: this.dateDay ? this.dateDay : this.kmpdDate,
      labels: this.stateName,
      datasets: [
        {
          label: 'Zones',
          data: this.stateCount,
          backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111",]
        },

      ]
    };
    this.chartObject2.options = {
      responsive: true,
      maintainAspectRatio: false
    };
    console.log('This:', this.chartObject2);
  }


  view(url) {
    // let images
    let field = url.split(',');
    // field.forEach(elements => {
    //   images = [{
    //     name: "POD",
    //     image: elements
    //   }];
    // })
    // for (let i = 0; i < field.length; i++) {
    //   images = [{
    //     name: "POD",
    //     image: field[i]
    //   }];
    // }
    let images = [{
      name: "POD",
      image: field[0]
    }, {
      name: "POD",
      image: field[1]
    }]

    this.common.params = { images, title: 'POD Image' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });



  }
  lrview(url) {
    let images = [{
      name: "Lr",
      image: url
    }];
    this.common.params = { images, title: 'Lr Image' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });


  }
  change(details) {
    console.log('details', details);
    this.common.params = { details };
    const activeModal = this.modalService.open(LrPodDashboardComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {

        this.reset();
      }
    });
  }
}
