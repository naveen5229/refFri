import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWiseFuelAverageComponent } from '../../modals/modal-wise-fuel-average/modal-wise-fuel-average.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-fuel-average',
  templateUrl: './fo-fuel-average.component.html',
  styleUrls: ['./fo-fuel-average.component.scss']
})
export class FoFuelAverageComponent implements OnInit {
  fuelData= []
  fuelAvg = [];
  vehicleId =null
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




  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getFuelAvg();

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getFuelAvg();
  }

  addFuelAvg() {
    this.common.params={row:null,
    load:null,
  unload:null,
vehicle:null};

    const activeModal = this.modalService.open(ModalWiseFuelAverageComponent, {  container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
        this.getFuelAvg();
      
    });
  }

  getFuelAvg() {
    this.fuelAvg = [];
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
    this.common.loading++;
    this.api.get('Fuel/getModelWiseFuelAvgWrtFo')
      .subscribe(res => {
        this.common.loading--;
          this.fuelAvg = [];
          this.fuelAvg = res['data'] || [];
          console.log("result", res);
          console.log("idd",this.fuelAvg[0]._id);
          
          let first_rec = this.fuelAvg[0];
          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }
          }
          this.table.data.columns = this.getTableColumns();
        }
      );
    }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.fuelAvg);
    this.fuelAvg.map(fuelAvgDoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", fuelAvgDoc[this.headings[i]]);
        if(this.headings[i] == 'Action')
        {
          this.valobj['Action'] = { value: "", action: null, icons: [{ class: 'far fa-edit', action: this.updateFuel.bind(this,fuelAvgDoc._id,fuelAvgDoc.LoadMileage,fuelAvgDoc.UnloadMileage,fuelAvgDoc._vm_id,fuelAvgDoc.VehicleModel,fuelAvgDoc.Brand )}, {  class: "fas fa-trash-alt", action: this.deleteFuel.bind(this,fuelAvgDoc._id) }] }

        }
        else
        this.valobj[this.headings[i]] = { value: fuelAvgDoc[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }

    

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }


  updateFuel(row,load,unLoad,vehicle,name,brand) {
    this.common.params={row,load,unLoad,vehicle,name,brand};
    
    const activeModal = this.modalService.open(ModalWiseFuelAverageComponent, {  container: 'nb-layout' });
    activeModal.result.then(data => {
        this.getFuelAvg();


      
    });

  }

  
  deleteFuel(row) {
    console.log("id",row)
    const params = {
      rowId: row,
    }
    console.log("id2",params)

    if (row) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are you Sure You Want  To Delete This Record?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          console.log("par", params);
          this.api.post('Fuel/deleteModelWiseFuelAvgWrtFo', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getFuelAvg();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }

}
