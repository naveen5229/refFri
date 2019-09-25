import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isArray } from 'util';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

@Component({
  selector: 'freight-rate-calculation',
  templateUrl: './freight-rate-calculation.component.html',
  styleUrls: ['./freight-rate-calculation.component.scss']
})
export class FreightRateCalculationComponent implements OnInit {

  keepGoing = true;
  searchString = '';
  destinationString = '';
  companyId = null;
  origin = null;
  siteId = null;
  destination = null;
  weight = null;
  distance = null;
  detention = null;
  delay = null;
  shortage = null;
  qty = null;
  shortagePer = null;
  radioValue = 1;
  value = null;

  data = [];
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
  fofields = [];

  materialDetails = [{
    articles: null,
    weight: null,
    material_value: null,
    weight_unit: null,
    materialId: null,
    material: null,
    customjsonfields: [
      {
        field1: null,
        value1: null,
        field2: null,
        value2: null,
        field3: null,
        value3: null,
        field4: null,
        value4: null,
      }
    ],
  }]

  constructor(public api: ApiService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public common: CommonService) {
    this.getAllFieldName();
    this.common.handleModalSize('class', 'modal-lg', '1000');
  }

  ngOnInit() {
  }

  getAllFieldName() {
    this.api.get('Suggestion/lrFoFields?sugId=2')
      .subscribe(res => {
        this.fofields = res['data'];
        console.log("fo", this.fofields);
      }, err => {
        console.log(err);
      });
  }

  selectLocation(location, suggestionId) {
    this.origin = location.split(',')[0];
    setTimeout(() => document.getElementById(suggestionId)['value'] = this.origin, 0);
    console.log(document.getElementById(suggestionId));
    console.log("origin", this.origin);
  }

  selectDestination(location, suggestionId) {
    this.destination = location.split(',')[0];
    setTimeout(() => document.getElementById(suggestionId)['value'] = this.destination, 0);
    console.log(document.getElementById(suggestionId));

  }

  addMore() {
    this.materialDetails.push({
      articles: null,
      weight: null,
      material_value: null,
      weight_unit: null,
      materialId: null,
      material: null,
      customjsonfields: [
        {
          field1: null,
          value1: null,
          field2: null,
          value2: null,
          field3: null,
          value3: null,
          field4: null,
          value4: null,
        }
      ],
    });
  }

  addField(index) {
    this.materialDetails[index].customjsonfields.push(
      {
        field1: null,
        value1: null,
        field2: null,
        value2: null,
        field3: null,
        value3: null,
        field4: null,
        value4: null,
      }
    )
  }

  getFrieghtRate() {
    this.shortage = null;
    this.shortagePer = this.value;
    if (this.radioValue == 0) {
      this.shortage = this.value;
      this.shortagePer = null;
    } else {
      this.shortage = null;
      this.shortagePer = this.value;
    }

    let particulars = JSON.parse(JSON.stringify(this.materialDetails));
    console.log('particulars', particulars);

    if (particulars) {
      particulars.map(particular => {
        let keys = [];
        particular.customfields = [];
        if (typeof particular.customjsonfields == 'string') {
          particular.customjsonfields = JSON.parse(particular.customjsonfields);
          keys = Object.keys(particular.customjsonfields);
          console.log("keys---", keys);
          particular.customfields[0] = {};
          for (let i = 0; i < keys.length; i++) {
            particular.customfields[0][keys[i]] = particular.customjsonfields[keys[i]]
          }
        } else if (isArray(particular.customjsonfields)) {
          particular.customjsonfields.forEach((customjsonfield, index) => {
            keys = Object.keys(customjsonfield);
            console.log("keys:", keys);
            particular.customfields[index] = {};
            for (let i = 0; i < keys.length - 1; i = i + 2) {
              particular.customfields[index][customjsonfield[keys[i]]] = customjsonfield[keys[i + 1]]
            }
          });

        }
        delete particular.customjsonfield;
        console.log("customfields", particular.customfields);
      });
    }
    console.log("param123", particulars);
    const params = {
      companyId: this.companyId,
      siteId: this.siteId,
      origin: this.origin,
      destination: this.destination,
      weight: this.weight,
      detention: this.detention,
      delay: this.delay,
      qty: this.qty,
      shortage: this.shortage,
      shortagePer: this.shortagePer,
      distance: this.distance,
      materialDetails: JSON.stringify(particulars)
    };
    ++this.common.loading;
    console.log("params", params);
    this.api.post('FrieghtRate/getFrieghtRate', params)
      .subscribe(res => {
        --this.common.loading;
        this.data = [];
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
        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log('Api Response:', res)
      },
        err => console.error(' Api Error:', err));
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);

        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  dismiss() {
    this.activeModal.close();
  }

  onChangeAuto(search, type) {
    if (type == 'source') {
      this.searchString = search;
      console.log('..........', search);
    }
    else {
      this.destinationString = search;
    }

  }



  takeAction(res) {
    setTimeout(() => {
      console.log('here reaches');
      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.origin = res.location.name.split(',')[0];
            (<HTMLInputElement>document.getElementById('endname')).value = this.origin;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);
  }

  takeAction1(res) {
    setTimeout(() => {
      console.log('here reaches');
      if (this.keepGoing && this.destinationString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          console.log('response----', res.location);
          this.keepGoing = true;
          if (res.location.lat) {
            this.destination = res.location.name.split(',')[0];
            (<HTMLInputElement>document.getElementById('destination')).value = this.destination;
            this.keepGoing = true;
          }
        })
      }
    }, 1000);
  }
}
