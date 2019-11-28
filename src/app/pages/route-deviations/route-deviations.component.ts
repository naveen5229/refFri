import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'route-deviations',
  templateUrl: './route-deviations.component.html',
  styleUrls: ['./route-deviations.component.scss']
})
export class RouteDeviationsComponent implements OnInit {

  endTime = new Date();
  startTime = new Date(new Date().setDate(new Date(this.endTime).getDate() - 7));

  deviationData = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  data=[];

  headings = [];
  valobj = {};
  apiUrl='ViaRoutes/routeDeviation ';
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
      this.getrouteDeviations();
     }

  ngOnInit() {
  }

  getrouteDeviations() {

    let startDate = this.common.dateFormatter1(this.startTime);
    let endDate = this.common.dateFormatter1(this.endTime);
    if (startDate > endDate) {
      this.common.showError("Start Date should less then End Date");
      return;
    }

    const params = {startTime : this.common.dateFormatter1(this.startTime),
      endTime: this.common.dateFormatter1(this.endTime)
    };
    ++this.common.loading;
    this.api.post(this.apiUrl,params)
      .subscribe(res => {
        --this.common.loading;
        console.log('API Res:', res);
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
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getTableColumns() {
    let columns = [];
    // console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(fuel) {
    // let icons = [
    //   { class: "fa fa-print", action: this.printReceipt.bind(this, fuel) }
    // ];
    // this.user.permission.edit && icons.push({ class: 'fa fa-edit', action: this.editFuelIndent.bind(this, fuel) });
    // this.user.permission.delete && icons.push({ class: 'fa fa-trash', action: this.deleteFuelIndent.bind(this, fuel) });

    // return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  // editFuelIndent(editFuelData) {
  //   console.log("Edit fuel Data", editFuelData);
  //   let refData = {
  //     refType: editFuelData._ref_type,
  //     refId: editFuelData._ref_id,
  //   };
  //   this.common.params = {
  //     title: 'Edit Fuel Indent',
  //     editFuelData: editFuelData,
  //     button: 'update',
  //     index: 0,
  //     refData: refData
  //   };
  //   const activeModal = this.modalService.open(AddFuelIndentComponent, { size: "lg", container: "nb-layout", backdrop: 'static' })
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.getFuelIndent();
  //     }
  //   });
  // }

}
