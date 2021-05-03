import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lr-invoice-columns',
  templateUrl: './lr-invoice-columns.component.html',
  styleUrls: ['./lr-invoice-columns.component.scss', "../pages.component.css",]
})
export class LrInvoiceColumnsComponent implements OnInit {
 
  LrInvoiceColumns = [];
  unassign = [];
  formatId= null;
  assign = {
    left: [],
    right: []
  }
 

  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    this.common.handleModalSize('class', 'modal-lg','1100','px',1);
    if(this.common.params){
    this.formatId = this.common.params.format.id;
  }
    this.getLrInvoiceColumns();

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }


  getLrInvoiceColumns() {
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      formatId: this.formatId,
    }
    this.api.post('LorryReceiptsOperation/getLrInvoiceFields', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("getLrInvoiceColumns", res['data']);
        this.LrInvoiceColumns = res['data'] || [];
        this.colinitialization();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



 
  drop(event: CdkDragDrop<string[]>) {
    console.log("drop", event);
    if (event.previousContainer === event.container) {
      if (event.container.id == "unassign")
        return;
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.previousContainer.id == "unassign") {
      if (event.container.id == "assign-left") {
        if (this.assign.left[event.currentIndex] == null) {
          this.assign.left[event.currentIndex] = this.unassign[event.previousIndex];
          this.unassign.splice(event.previousIndex, 1);
        }
      } else if (event.container.id == "assign-right") {
        if (this.assign.right[event.currentIndex] == null) {
          this.assign.right[event.currentIndex] = this.unassign[event.previousIndex];
          this.unassign.splice(event.previousIndex, 1);
        }
      }
    } else if (event.container.id == "unassign") {
      if (event.previousContainer.id == "assign-left") {
        if (this.assign.left[event.previousIndex] != null) {
          this.unassign.splice(event.previousIndex, 0, this.assign.left[event.previousIndex]);
          this.assign.left[event.previousIndex] = null;
        }
      } else if (event.previousContainer.id == "assign-right") {
        if (this.assign.right[event.previousIndex] != null) {
          this.unassign.splice(event.previousIndex, 0, this.assign.right[event.previousIndex]);
          this.assign.right[event.previousIndex] = null;
        }
      }
    } else if (event.previousContainer.id == "assign-left" && event.container.id == "assign-right") {
      let val = this.assign.right[event.currentIndex];
      this.assign.right[event.currentIndex] = this.assign.left[event.previousIndex];
      this.assign.left[event.previousIndex] = val;
    } else if (event.previousContainer.id == "assign-right" && event.container.id == "assign-left") {
      let val = this.assign.left[event.currentIndex];
      this.assign.left[event.currentIndex] = this.assign.right[event.previousIndex];
      this.assign.right[event.previousIndex] = val;
    }

  }

  colinitialization() {
    this.unassign = this.LrInvoiceColumns.filter(column => { return !column.r_selected; });
    this.assign.left = [];
    this.assign.right = [];
    let count = 1;

    for (let i = 0; i < this.LrInvoiceColumns.length; i++) {
      this.assign.left.push(this.LrInvoiceColumns.find(col1 => {
        if (col1.r_colorder == (i + count) && col1.r_selected) return true;
        return false;
      }) || null);

      this.assign.right.push(this.LrInvoiceColumns.find(col2 => {
        if (col2.r_colorder == (i + count + 1) && col2.r_selected) return true;
        return false;
      }) || null);

      count++;
    }

  }


  saveLrInvoiceColumns() {
    let params = {
      formatId: this.formatId,   
      lrInvoiceColumns: JSON.stringify(this.assignOrder()),
    }
    console.log("Params", params)
    this.common.loading++;

    this.api.post('LorryReceiptsOperation/saveLrInvoiceFields', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("saveLrInvoiceColumns", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("Successfully Added");
          this.activeModal.close();
        }
        else {
          this.common.showError(res['data'][0].rtn_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

 
  assignOrder() {
    let selected = [];
    let count = 1;

    for (let i = 0; i <= this.assign.left.length; i++) {
      if (this.assign.left[i]) {
        this.assign.left[i].r_colorder = i + count;
        this.assign.left[i].r_selected = true;
        selected.push(this.assign.left[i]);
      }

      if (this.assign.right[i]) {
        this.assign.right[i].r_colorder = i + count + 1;
        this.assign.right[i].r_selected = true;
        selected.push(this.assign.right[i]);
      }

      count++;
    }
    
    this.unassign.map(col => {
      col.r_selected = false;
      col.r_colorder = -1;
    });

    return [...selected, ...this.unassign];
  }
}

