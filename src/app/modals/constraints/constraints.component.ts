import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'constraints',
  templateUrl: './constraints.component.html',
  styleUrls: ['./constraints.component.scss']
})
export class ConstraintsComponent implements OnInit {
  constraintsType = {
    consignees: [{ name: '', id: '' }],
    transporter: [{ name: '', id: '' }],
    vehicles: [{ regno: '', id: '' }],
    groups: [{ id: '', foid: '', description: '', aduserid: '', entrymode: '' }],
    destinations: [{ name: '', id: '', type: '', siteName: '', location: '' },],
    sources: [{ name: '', id: '', type: '', siteName: '', location: '' },],
  }
  searchString = '';
  keepGoing = true;
  // foId = null;
  issueType = null;
  id = null;
  getContraintsData = [];
  url = '';
  saveUrl = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    console.log("params:", this.common.params);

    if (this.common.params && this.common.params.constraints) {

      // this.foId = this.common.params.constraints.foId;
      this.issueType = this.common.params.constraints.issueType;
      this.id = this.common.params.constraints.id;
      this.url = this.common.params.api;
      this.saveUrl = this.common.params.saveApi;
      this.getContraintsIssueData();
    }
    this.common.handleModalSize('class', 'modal-lg', '1100', 'px', 1);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getContraintsIssueData() {
    const params = {
      // foid: this.foId,
      issue_type_id: this.issueType,
      id: this.id
    }

    console.log("params", params);
    this.common.loading++;
    this.api.post(this.url, params)
      .subscribe(res => {
        this.common.loading--;
        this.constraintsType = res['data'][0].constraints;

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  addField(type, index) {
    this.constraintsType[type].push({
      name: '',
      id: '',
      regno: '',
      type: 'site',
      siteName: '',
      location: '',
      foid: '',
      description: '',
      aduserid: '',
      entrymode: ''
    });
  }

  deleteField(type, index) {
    this.constraintsType[type].splice(index, 1);
  }

  removeObjectData(type) {

    switch (type) {
      case 'consignees':
        this.constraintsType[type] = [{ id: null, name: '' }];
        break;
      case 'transporter':
        this.constraintsType[type] = [{ id: null, name: '' }];
        break;
      case 'vehicles':
        this.constraintsType[type] = [{ id: null, regno: '' }];
        break;
      case 'groups':
        this.constraintsType[type] = [{ id: null, foid: '', description: '', aduserid: '', entrymode: '' }];
        break;
      case 'destinations':
        this.constraintsType[type] = [{ id: null, name: '', siteName: '', type: 'site' }];
        this.constraintsType[type] = [{ id: null, name: '', location: '', type: 'map' }];
        break;
      case 'sources':
        this.constraintsType[type] = [{ id: null, name: '', siteName: '', type: 'site' }];
        this.constraintsType[type] = [{ id: null, name: '', location: '', type: 'map' }];
        break;
      default:
        console.log("type", type);
        break;
    }
  }
  resetData(data, index, type) {
    this.constraintsType[type][index].id = null;
    console.log("", this.constraintsType[type].id = null);
  }
  
  selectSuggestion(details, index, type, locationType?) {
    console.log("details", details);

    switch (type) {
      case 'consignees':
        this.constraintsType[type][index] = { id: details.id, name: details.name };
        break;
      case 'transporter':
        this.constraintsType[type][index] = { id: details.id, name: details.name };
        break;
      case 'vehicles':
        this.constraintsType[type][index] = { id: details.id, regno: details.regno };
        break;
      case 'groups':
        this.constraintsType[type][index] = { id: details.id, foid: details.foid, description: details.description, aduserid: details.aduserid, entrymode: details.entrymode };
        break;
      case 'destinations':
        if (locationType == 'site') {
          this.constraintsType[type][index] = { id: details.id, name: details.name, siteName: details.sd_loc_name, type: 'site' };
        }
        else {
          this.constraintsType[type][index] = { id: details.id, name: details.name ? details.name : '', location: details.location, type: 'map' };
        }
      case 'sources':
        if (locationType == 'site') {
          this.constraintsType[type][index] = { id: details.id, name: details.name, siteName: details.sd_loc_name, type: 'site' };
        }
        else {
          this.constraintsType[type][index] = { id: details.id, name: details.name ? details.name : '', location: details.location, type: 'map' };
        }
        break;
      default:
        console.log("type", type);
        break;
    }
  }


  onChangeAuto(search, index) {
    this.searchString = search;
  }

  takeAction(res, index, type) {
    setTimeout(() => {
      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            this.keepGoing = true;
            if (res.location.lat) {
              if (type == 'destination') {
                this.constraintsType.destinations[index].location = res.location.name;
                (<HTMLInputElement>document.getElementById('mapValue')).value = this.constraintsType.destinations[index].location;
                this.constraintsType.destinations[index].id = res.id;
                this.keepGoing = true;
              }
              else if (type == 'source') {
                this.constraintsType.sources[index].location = res.location.name;
                (<HTMLInputElement>document.getElementById('mapValue')).value = this.constraintsType.sources[index].location;
                this.constraintsType.sources[index].id = res.id;
                this.keepGoing = true;
              }
            }
          }
        })
      }
    }, 1000);

  }

  constraintsSave() {
    let issues = {
      consignees: this.constraintsType.consignees.filter(consignee => { return consignee.id; }).map(consignee => { return consignee.id; }),
      transporters: this.constraintsType.transporter.filter(transport => { return transport.id }).map(transport => { return transport.id }),
      vehicles: this.constraintsType.vehicles.filter(vehicle => { return vehicle.id }).map(vehicle => { return vehicle.id }),
      groups: this.constraintsType.groups.filter(group => { return group.id }).map(group => { return group.id }),
      destinations: this.constraintsType.destinations.filter(destination => { return destination.id }).map(destination => { return destination.id }),
      sources: this.constraintsType.sources.filter(source => { return source.id }).map(source => { return source.id }),
    
    }
    const params = {
      constraints: JSON.stringify(issues),
      // foid: this.foId,
      issue_type_id: this.issueType,
      id: this.id
    }

    console.log("params", params);
    this.common.loading++;
    this.api.post(this.saveUrl, params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}
