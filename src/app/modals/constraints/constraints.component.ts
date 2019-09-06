import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

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
    destinations: [{ name: '', id: '', type: '', siteName: '', location: '' },],
  }
  searchString = '';
  keepGoing = true;
  foId = null;
  issueType = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.foId = this.common.params.foId;
    this.issueType = this.common.params.issueType;
    this.common.handleModalSize('class', 'modal-lg', '1300', 'px', 1);
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  addField(type, index) {
    this.constraintsType[type].push({
      name: '',
      id: '',
      regno: '',
      type: 'site',
      siteName: '',
      location: ''
    });
  }

  deleteField(type, index) {
    this.constraintsType[type].splice(index, 1);
  }

  resetData(data, index, type) {
    this.constraintsType[type][index] = null;
    console.log(data);
  }
  selectSuggestion(details, index, type, locationType?) {
    console.log('Details:', details);
    console.log('Index:', index);
    console.log('Type:', type);
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
      case 'destinations':
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

  takeAction(res, index) {
    setTimeout(() => {
      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            this.keepGoing = true;
            if (res.location.lat) {
              this.constraintsType.destinations[index].location = res.location.name;
              (<HTMLInputElement>document.getElementById('mapValue')).value = this.constraintsType.destinations[index].location;
              this.constraintsType.destinations[index].id = res.id;
              this.keepGoing = true;
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
      destinations: this.constraintsType.destinations.filter(destination => { return destination.id }).map(destination => { return destination.id }),
    }
    const params = {
      constraints: JSON.stringify(issues),
      foid: this.foId,
      issue_type_id: this.issueType,
      id: 11
    }

    console.log("params", params);
    return;
    this.common.loading++;
    this.api.post('FoTicketEscalation/insertTicketEscalation', params)
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
