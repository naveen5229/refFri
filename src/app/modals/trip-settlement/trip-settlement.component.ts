import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFuelIndentComponent } from '../add-fuel-indent/add-fuel-indent.component';
import { SaveAdvicesComponent } from '../save-advices/save-advices.component';
import { TransferReceiptsComponent } from '../FreightRate/transfer-receipts/transfer-receipts.component';

@Component({
  selector: 'trip-settlement',
  templateUrl: './trip-settlement.component.html',
  styleUrls: ['./trip-settlement.component.scss']
})
export class TripSettlementComponent implements OnInit {
  invoiceId = null;
  tripDetails = null;
  particulars = null;
  type = 1;
  label = [];
  data = [[]];
  headings = [[]];
  valobj = [{}];
  columnsValue = [[]];

  vehicleId = null;
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,

    public renderer: Renderer
  ) {
    console.log("data:row", this.common.params.row);
    this.vehicleId = this.common.params.row._vid;
    this.common.handleModalSize('class', 'modal-lg', '1500');
    this.printInvoice();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.setElementClass(document.body, 'test', false);
  }

  printInvoice() {
    ++this.common.loading;

    this.api.get('TripsData/getTripSettlement?vId=' + this.vehicleId)
      .subscribe(res => {
        --this.common.loading;
        for (let index = 0; index < 6; index++) {
          let dataKey = this.getIndexName(index);
          this.data[index] = [];
          this.columnsValue[index] = [];
          this.data[index] = res['data'][dataKey];
          if (this.data[index]) {
            console.log("data", this.data[index]);
            this.getTableColumnName(index);
          }
        }
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  getIndexName(index) {
    this.label = ["Trip Details",
      "Transfers",
      "Fuel Indent",
      "Trip Advice",
      "Route Advance",
      "Route Expense"];
    switch (index) {
      case 0: return 'tripdata';
      case 1: return 'transfers';
      case 2: return 'fuelindent';
      case 3: return 'advices';
      case 4: return 'routeadvance';
      case 5: return 'routeexpense';
    }

  }

  getTableColumnName(index) {

    this.headings[index] = [];
    this.valobj[index] = {};
    let first_rec = this.data[index][0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings[index].push(key);
      }
    }
    console.log("headings", this.headings[index]);
    this.getTableColumns(index);
  }

  getTableColumns(index) {
    this.data[index].map(doc => {
      this.valobj[index] = {};
      for (let i = 0; i < this.headings[index].length; i++) {
        this.valobj[index][this.headings[index][i]] = doc[this.headings[index][i]];
      }
      this.columnsValue[index].push(this.valobj[index]);
    });

    console.log("this.columnsValue", this.columnsValue[index]);
  }


  onPrint() {
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);
  }

  findCustomFields(customFields) {
    console.log("customFields", customFields)
    if (!customFields) return [];
    //customFields = JSON.parse(customFields);
    let formattedFields = [];
    let keys = Object.keys(customFields);
    keys.map(key => {
      formattedFields.push({ name: key, value: customFields[key] });
    });

    console.log('Formatted :', formattedFields);
    return formattedFields;
  }

  openTransferModal() {
    console.log("openTransferModal");
    this.common.handleModalSize('class', 'modal-lg', '1100');
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });
  }
  openFuelIndentModal() {
    console.log("openFuelIndentModal");

    this.common.params = {
      title: 'Add Fuel Indent',
      flag: 'Add'
    };

    const activeModal = this.modalService.open(AddFuelIndentComponent, {
      size: "lg",
      container: "nb-layout"
    })


  }
  openAdviceModal() {
    console.log("openAdviceModal");

    this.common.handleModalSize('class', 'modal-lg', '1100');
    const activeModal = this.modalService.open(SaveAdvicesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });
  }
}
