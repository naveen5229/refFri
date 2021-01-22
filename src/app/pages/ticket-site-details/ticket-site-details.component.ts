import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { VehicleHaltComponent } from '../../modals/vehicle-halt/vehicle-halt.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ticket-site-details',
  templateUrl: './ticket-site-details.component.html',
  styleUrls: ['./ticket-site-details.component.scss', '../pages.component.css']
})
export class TicketSiteDetailsComponent implements OnInit {

  haltInfo = null;
  ticketInfo = null;
  notification = null;
  title = '';
  secType1 = '';
  secType2 = '';

  constructor(
    public api: ApiService,
    public router: Router,
    private modalService: NgbModal,
    public common: CommonService) {
    if (this.common.params) {
      localStorage.setItem('Params', JSON.stringify(this.common.params));
      // this.router.navigate(['pages/tickets']);
      // return;
    }
    this.common.params = JSON.parse(localStorage.getItem('Params'));
    this.notification = this.common.params['data'];
    this.title = this.common.params['title'];
    this.secType1 = this.common.params['secType1'];
    this.secType2 = this.common.params['secType2'];
    console.log(this.title, this.secType1, this.secType2);

    this.getNotificationDetails();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getNotificationDetails();
  }

  getNotificationDetails() {
    this.common.loading++;
    let params = 'ticket_id=' + this.notification.ticket_id +
      "&pri_type=" + this.notification.pri_type;

    this.api.get('FoTickets/getSingleTicketInfo?' + params, {})
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.haltInfo = res['data']['issue_info'][0];
        this.ticketInfo = res['data']['tkt_info'][0];
      }, err => {
        this.common.loading--;
        console.error(err);
      });
  }

  showLocation() {
    if (!this.haltInfo.lat) {
      this.common.showToast('Location not available!');
      return;
    }

    const location = {
      lat: this.haltInfo.lat,
      lng: this.haltInfo.long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  getHaltOptions() {
    this.common.loading++;
    let params = 'type_id=' + this.haltInfo.type_id +
      "&rowid=" + this.haltInfo.id +
      "&regno=" + this.haltInfo.regno +
      "&halt_type_id=" + this.haltInfo.halt_type_id;

    console.log(params);
    this.api.get('FoTickets/getHaltDetails?' + params, {})
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.changeHalt(res['data'][0].title, res['data'][0].description, res['data'][0].option);
      }, err => {
        this.common.loading--;
        console.error(err);
      });
  }

  changeHalt(title, description, options) {
    let data = {
      title: title,
      description: description,
      options: options
    };
    this.common.params = data;
    const activeModal = this.modalService.open(VehicleHaltComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data: ', data);
      if (data.response) {
        this.updateHalt(data.option);
      }
    });
  }

  updateHalt(option) {
    let params = {
      'type_id': this.haltInfo.type_id,
      'rowid': this.haltInfo.id,
      'regno': this.haltInfo.regno,
      'halt_type_id': option.id,
      'remark': option.name
    };
    console.log(params);

    this.common.loading++;
    this.api.post('FoTickets/updateHaltTypes', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);
        console.log(res);
        this.getNotificationDetails();
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  findRemainingTime(time) {
    let minutes = time % 60;
    let hours = Math.floor((time / 60));
    if (hours) {
      return hours + ' hours ' + minutes + ' minutes';
    }
    return minutes + ' minutes ';
  }

  handleAction(secType) {
    if (secType == 201) {
      this.getHaltOptions();
    } else if (secType == 202) {
      this.changeDriver();
    }
  }

  changeDriver() {
    // let modal = this.modalCtrl.create('ChangeDriverPage', {});

    // modal.onDidDismiss(data => {
    //   if (data.response) {
    //     console.log(data);
    //   }
    // });

    // modal.present();
  }
}
