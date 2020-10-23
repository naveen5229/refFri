import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';

@Component({
  selector: 'on-side-images',
  templateUrl: './on-side-images.component.html',
  styleUrls: ['./on-side-images.component.scss']
})
export class OnSideImagesComponent implements OnInit {
  date = this.common.getDate();
  filterdata = []
  status = 0;
  onsideimage = [];
  onside = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }

  };

  constructor(
    public modalService: NgbModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService
  ) {
  }

  ngOnInit() {
  }

  showData() {
    const subURL = `Drivers/getOnSideImages?date=${this.common.dateFormatter(this.date)}`;
    this.common.loading++;
    this.api.get(subURL)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.onsideimage = res['data'] || [];
        this.setTable();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      })
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    console.log('Table:', this.table.data);
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.onsideimage[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.common.formatTitle(key) };
      }
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.onsideimage.map(request => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action' || key == 'action') {
          column[key] = {
            value: "",
            isHTML: true,
            action: null,
            icons: this.actionIcons(request)
          };
        }
        else {
          column[key] = { value: request[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    console.log(columns);
    return columns;
  }

  actionIcons(request) {
    let icons=[
    { class: (request._lat && request._long) ? 'fa fa-map-marker' : 'fa fa-map-marker disbale', action: this.location.bind(this, request) },
    { class: request._url ? 'fa fa-image' : 'fa fa-image disbale', action: this.accept.bind(this, request) },
  ];
    return icons;
  }

  accept(request) {
    console.log(request);
    if(request._url){
    let images = [{
      name: "Lr",
      image: request._url,
    }];
    this.common.params = { images, title: request.empname };
    const activeModal =  this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });
    }
    // else{
    //   this.common.showError('No Image Available')
    // }
  }

  location(request) {
    let location = {
      lng: request._long,
      lat: request._lat
    }
    // console.log('allData',allData,data);
    let title = 'Location';
    this.common.params = { location, title };
    console.log(this.common.params);
    if(location.lng && location.lat){
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'xl', container: 'nb-layout', backdrop: 'static' });
    }
  }

}
