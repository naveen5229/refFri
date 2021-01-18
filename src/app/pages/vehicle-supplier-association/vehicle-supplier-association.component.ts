// Author By Lalit

import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { AddSupplierAssociationComponent } from '../../modals/add-supplier-association/add-supplier-association.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-supplier-association',
  templateUrl: './vehicle-supplier-association.component.html',
  styleUrls: ['./vehicle-supplier-association.component.scss', '../pages.component.css']
})
export class VehicleSupplierAssociationComponent implements OnInit {
  supplierAssociationData = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getvehicleSupplierData();

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getvehicleSupplierData();
  }

  getvehicleSupplierData() {
    this.common.loading++;
    this.api.get('ManageParty/getVehicleSupplierAssoc?')
      .subscribe(res => {
        this.common.loading--;
        console.log('res:', res);
        this.supplierAssociationData = res['data'] || [];
        this.supplierAssociationData.length ? this.setTable() : this.resetTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.supplierAssociationData[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  getTableColumns() {
    let columns = [];
    this.supplierAssociationData.map(supplier => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(supplier)
          };
        } else {
          column[key] = { value: supplier[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(supplier) {
    let icons = [];
    this.user.permission.edit && icons.push({ class: 'fa fa-edit mr-3', action: this.editSupplier.bind(this, supplier) });
    this.user.permission.delete && icons.push({ class: "fa fa-trash", action: this.deleteSupplier.bind(this, supplier) });
    return icons;
  }




  addSupplierAssociation() {
    const activeModal = this.modalService.open(AddSupplierAssociationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getvehicleSupplierData();
      }
    });
  }

  editSupplier(supplier) {
    let vehicleSupplier = {
      id: supplier._rowid,
    };
    this.common.params = { vehicleSupplier: vehicleSupplier };
    const activeModal = this.modalService.open(AddSupplierAssociationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getvehicleSupplierData();
      }
    });
  }

  deleteSupplier(supplier) {
    console.log("delete", supplier);

    let params = {
      rowId: supplier._rowid,
    }
    if (supplier._rowid) {
      this.common.params = {
        title: 'Delete Vehicle Supplier ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('ManageParty/deleteVehicleSupplierAssoc', params)
            .subscribe(res => {
              this.common.loading--;
              console.log("res", res);
              this.common.showToast(res['msg']);
              this.getvehicleSupplierData();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

}
