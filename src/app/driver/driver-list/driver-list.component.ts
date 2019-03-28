import { Component, OnInit } from '@angular/core';
import { Driver } from 'selenium-webdriver/edge';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { updateBinding } from '@angular/core/src/render3/instructions';
import {EditDriverComponent } from '../../modals/edit-driver/edit-driver.component';
import { AddDriverCompleteComponent } from '../../modals/DriverModals/add-driver-complete/add-driver-complete.component';
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
    public common: CommonService  ) {
    this.getdriverLists();

  }

  ngOnInit() {
  }

  addDriver() {
    // this.router.navigate(['/driver/add-driver']);
    // const activeModal =
     const activeModal = this.modalService.open(AddDriverCompleteComponent, { size: 'lg', container: 'nb-layout' });
     activeModal.result.then(data=>{
       if (data.response){
         this.getdriverLists();
       }
     })
    // activeModal.result.then(data => {
      // if (data.response) {
        // this.getdriverLists();
      // }
    // });

  }

  updateDriverInfo(driver) {
    this.common.params = { driver };
   // const activeModal =
     const activeModal= this.modalService.open(EditDriverComponent, { size: 'lg', container: 'nb-layout' });
     activeModal.result.then(data => {
       if (data.response) {
      // closeModal(true);
        this.getdriverLists();
      }
    });
  }


  getdriverLists() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/index')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverLists = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
}
