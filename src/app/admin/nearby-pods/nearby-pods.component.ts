import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { LrNearbyPodComponent } from '../../modals/LRModals/lr-nearby-pod/lr-nearby-pod.component';
@Component({
  selector: 'nearby-pods',
  templateUrl: './nearby-pods.component.html',
  styleUrls: ['./nearby-pods.component.scss']
})
export class NearbyPodsComponent implements OnInit {
  data = [];
  branch = [];
  // startDate = this.common.dateFormatter1(new Date().setDate(new Date().getDate() - 60));

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 60));
  range = [{
    name: '50KM',
    id: '50'
  },
  {
    name: '100KM',
    id: '100'
  },
  {
    name: '200KM',
    id: '200'
  },
  {
    name: '300KM',
    id: '300'
  }]
  RangeId = null;
  BranchID = null;
  branchId = null;
  radius = null;
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

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getBranchList();
    let today = new Date();
    // this.startDate = 
    // this.endDate = this.common.dateFormatter1(new Date());
    console.log('branchId', this.BranchID);
    console.log('rangeId:', this.RangeId);
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  
  refresh() {
    console.log('Refresh');
    this.getBranchList();
  }
  getBranch() {
    this.branchId = this.BranchID;
  }
  getRange() {

  }
  nearByPods() {
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
    let params = {
      startDate: this.startDate,
      endDate: this.common.dateFormatter1(this.endDate),
      branchId: this.BranchID,
      radius: this.RangeId

    }
    console.log('params', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getNearByPods', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        // this.showdoughnut();
        this.table.data.columns = this.getTableColumns();

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

    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {

          // this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-task', action: this.view.bind(this, doc.url) }, { class: 'fa fa-task', action: this.view.bind(this, doc.url) }] };
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-user', action: this.change.bind(this, doc) }, { class: 'fa fa-map-marker', action: this.view.bind(this, doc) }, { class: 'fa fa-picture-o', action: this.LRimage.bind(this, doc._img_url2) }, { class: 'fa fa-image', action: this.getPodImage.bind(this, doc._doc_id) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  
  getBranchList() {
    let params = {

    }
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        this.branch = res['data'];


      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  change(details) {
    this.common.params = { details };
    const activeModal = this.modalService.open(LrNearbyPodComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.nearByPods();
      }
    });
  }
  view(doc) {
    let location = {
      lng: doc._long,
      lat: doc._lat
    }
    console.log('location:', location);
    let title = 'Location'
    this.common.params = { location, title };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })

  }
  LRimage(url) {
    let images = [{
      name: "Lr",
      image: url
    }];
    this.common.params = { images, title: 'Lr Image' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });


  }

  // podimage(url) {
  //   let images = [{
  //     name: "Lr",
  //     image: url
  //   }];
  //   this.common.params = { images, title: 'Lr Image' };
  //   const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });

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
}
