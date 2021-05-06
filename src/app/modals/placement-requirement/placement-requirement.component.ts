import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PlacementProblemGenerationComponent } from '../placement-problem-generation/placement-problem-generation.component';

@Component({
  selector: 'placement-requirement',
  templateUrl: './placement-requirement.component.html',
  styleUrls: ['./placement-requirement.component.scss']
})
export class PlacementRequirementComponent implements OnInit {

  data: any;
  table = null;
  partyId = 0;
  partyName = "";
  quantityType = 0;
  startTime = new Date();
  endTime = new Date();
  repName = '';
  id = -1;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService:NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1300', 'px');
    this.getPreviousPlacementRequirement();
  }

  ngOnInit(): void {
  }

  offDate = [{
    offDates: null
  }]

  items = [
    {
      siteId: 0,
      siteName: '',
      minQuantity: 0,
      maxQuantity: 0,
      penaltyMin: 0,
      penaltyMax: 0,
    }
  ];

  selectCompany(event?) {
    console.log("event", event)
    this.partyId = event.id
    console.log("event1", event.id)
    this.partyName = event.name
  }


  selectplnt(plant, index, num) {
    this.items[index]['siteId'] = plant['id'];
    this.items[index]['siteName'] = plant['name'];
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  addMoreItems() {
    this.items.push({
      siteId: 0,
      siteName: '',
      minQuantity: 0,
      maxQuantity: 0,
      penaltyMin: 0,
      penaltyMax: 0,
    });
  }

  addDates() {
    this.offDate.push({
      offDates: new Date()
    });
  }

  getPreviousPlacementRequirement() {
    this.common.loading++;
    this.api.getJavaPortDost(8084, 'getPreviousPlacementRequirement/')
      .subscribe(res => {
        this.common.loading--;
        this.data = res;
        this.table = this.setTable();
        console.log("previousPlacementRequirement:", this.data);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setTable() {
    let headings = {
      partyName: { title: 'party Name', placeholder: 'Party Name' },
      startDate: { title: 'Start Date', placeholder: 'Start Date' },
      endDate: { title: 'End Date', placeholder: 'End Date' },
      reportName: { title: 'Report Name', placeholder: 'Report Name' },
      quantityType: { title: 'Quantity Type', placeholder: 'Quantity Type' },
      action: { title: 'Action', placeholder: 'Action' }
    };
    return {
      data: {
        headings: headings,

        columns: this.getTableColumns(),
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      let column = {
        partyName: { value: doc.partyName },
        startDate: { value: doc.startDate },
        endDate: { value: doc.endDate },
        reportName: { value: doc.reportName },
        quantityType: { value: doc.quantityType == 0 ? 'Capacity' : 'Vehicle' },
        action:{value: "",isHTML: false,action: null,icons: this.actionIcons(doc)}
      };
      columns.push(column);
    });
    return columns;
  }

  actionIcons(doc){
    let icons = [
      // {
      //   class: "far fa-eye",
      //   action: this.placementProblemGenereation.bind(this, doc)
      // },
      {
        class: "fas fa-user",
        action: this.setData.bind(this, doc)
      },
    ];
    return icons;
  }

  placementProblemGenereation(){
    console.log("test");
    const activeModal = this.modalService.open(PlacementProblemGenerationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  
  setData(doc) {
    console.log("docL",doc)
    this.partyId = doc['partyId'];
    this.partyName = doc['partyName'];
    this.startTime = new Date(doc['startDate']);
    this.endTime = new Date(doc['endDate']);
    this.repName = doc['reportName'];
    this.quantityType = doc['quantityType'];
    this.id = doc['id'];
    console.log("date:", doc['offDates']);

    this.offDate = doc['offDates'].map(e => {
      console.log("e", e);
      return { offDates: new Date(e) };
    })
    console.log("Dates:", this.offDate);
    let itemsDetails = null;
    itemsDetails = doc['placementRequirementDetailsDTOS'] ? doc['placementRequirementDetailsDTOS'] : this.items;
    this.items = itemsDetails;
    console.log("items:", this.items, this.partyId, this.partyName);
  }

  savePlacementRequirement() {
    let param = null
    let data = this.offDate.map(e => {
      return this.common.dateFormatter1(e.offDates)
    })
    console.log("offDates:", data);
    param = {
      partyId: this.partyId,
      partyName: this.partyName,
      startDate: this.common.dateFormatter1(this.startTime),
      endDate: this.common.dateFormatter1(this.endTime),
      reportName: this.repName,
      quantityType: this.quantityType,
      id: this.id,
      offDates: data,
      placementRequirementDetailsDTOS: this.items
    }
    console.log("data:", param);
    this.common.loading++;
    this.api.postJavaPortDost(8084, 'savePlacementRequirement', param)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
