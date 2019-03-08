import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router'
import { AddDriverComponent } from '../../modals/DriverModals/add-driver/add-driver.component';
import { updateBinding } from '@angular/core/src/render3/instructions';
@Component({
  selector: 'driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss', '../../pages/pages.component.css']
})
export class DriverListComponent implements OnInit {
  driverLists = [];

  constructor(public api: ApiService,
    public router: Router,
    private modalService: NgbModal,
    public common: CommonService, ) {
    this.getdriverLists();

  }

  ngOnInit() {
  }

  addDriver() {
    // this.router.navigate(['/driver/add-driver']);
    this.modalService.open(AddDriverComponent, { size: 'lg', container: 'nb-layout' });
  }

  updateDriverInfo(driver) {
    this.common.params = { driver };
    this.modalService.open(AddDriverComponent, { size: 'lg', container: 'nb-layout' });
  }


  getdriverLists() {
    this.common.loading++;
    let response;
    this.api.get('/booster/getDriversAccordingFo')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverLists = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  };
}
