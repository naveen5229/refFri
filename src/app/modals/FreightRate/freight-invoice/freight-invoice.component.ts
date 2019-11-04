import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { AccountService } from '../../../services/account.service';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { LrAssignComponent } from '../../LRModals/lr-assign/lr-assign.component';

@Component({
  selector: 'freight-invoice',
  templateUrl: './freight-invoice.component.html',
  styleUrls: ['./freight-invoice.component.scss', '../../../pages/pages.component.css']
})
export class FreightInvoiceComponent implements OnInit {
  showhide = {
    show: true
  }

  state = false;
  freightInvoice = {
    branchId: null,
    branchName: null,
    company: null,
    invoiceNo: null,
    date: new Date(),
    companyAddress: null,
    companyName: null,
    companyId: null,
    remark: null,
    id: null,
    gst: '5',
    type:null,
    parentId:null,
    partyAddress:null,
    title:null
  };
  material = {
    name: null,
    id: null
  }

  btnTxt = "Save & Select LR";
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public accountService: AccountService) {
    if (this.accountService.selected.branch.id) {
      this.getBranchDetails();
    }
    this.common.handleModalSize('class', 'modal-lg', '800');
    console.log("Branches", this.accountService.branches);

    if(this.common.params.invoiceDetail && this.common.params.invoiceDetail.id)
    {
      this.freightInvoice.id=this.common.params.invoiceDetail.id;
      this.api.get('FrieghtRate/getFrieghtInvoiceDataforEdit?invoiceId=' + this.freightInvoice.id)
      .subscribe(res => {
        console.log("InvoiceDetails:", res['data']);
        if(res['data'])
        {
          this.showhide.show = false;
          this.freightInvoice.branchId = res['data'][0].branch_id;
          this.freightInvoice.branchName = res['data'][0].branch_name;
          this.freightInvoice.companyId = res['data'][0].party_id;
          this.freightInvoice.companyName = res['data'][0].party_name;
          this.freightInvoice.invoiceNo = res['data'][0].inv_no;
          this.freightInvoice.date = new Date(res['data'][0].inv_date);
          this.freightInvoice.remark = res['data'][0].remarks;
          this.freightInvoice.id = res['data'][0].id;
          this.freightInvoice.gst = res['data'][0].tax;
          this.state = res['data'][0].is_samestate;
          this.freightInvoice.parentId = res['data'][0].parent_id;
          this.freightInvoice.type = res['data'][0].inv_type;
          this.freightInvoice.partyAddress=res['data'][0].party_address;
          this.freightInvoice.title = res['data'][0].inv_title;
          this.material.id = res['data'][0].material_id;;
          this.material.name = res['data'][0].material_name;
          this.btnTxt="Update Invoice";
        }
      }, err => {
        this.common.loading--;
        console.log(err);
        
      });
    }
    // if (this.common.params.title == 'Edit') {
    //   this.showhide.show = false;

    
    // }
    // else if(this.common.params.type && this.common.params.type>1&&  this.common.params.title == 'add'){
    //   this.freightInvoice.branchId = this.common.params.freightInvoice._branch_id;
    //   this.freightInvoice.branchName = this.common.params.freightInvoice['Branch Name'];
    //   this.freightInvoice.companyId = this.common.params.freightInvoice._party_id;
    //   this.freightInvoice.companyName = this.common.params.freightInvoice['Party Name'];
    //   this.freightInvoice.date = new Date(this.common.params.freightInvoice._inv_date);
    //   this.freightInvoice.remark = this.common.params.freightInvoice._remarks;
    //   this.freightInvoice.gst = this.common.params.freightInvoice._gst;
    //   this.state = this.common.params.freightInvoice._is_samestate == "same" ? true : false;
    //   this.freightInvoice.parentId = this.common.params.freightInvoice['_id'];
    //   this.freightInvoice.type = this.common.params.type;
    // }
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  getBranchDetails() {
    this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
      .subscribe(res => {
        console.log("branchdetails", res['data'][0]);
        this.setBranchDetails(res['data'][0]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setBranchDetails(lrDetails) {

  }
  getConsignorDetail(consignor) {
    console.log("consignor", consignor);
    this.freightInvoice.companyAddress = consignor.address;
    this.freightInvoice.companyName = consignor.name;
    this.freightInvoice.companyId = consignor.id;
    if(this.freightInvoice.companyAddress)
    {
      this.freightInvoice.partyAddress=consignor.address;
      
    }
    console.log("---------------",consignor.address);
  }
  // Edit Invoice  Author by Hemant Singh Sisodia 
  saveInvoice() {

    let params = {
      branchId: this.freightInvoice.branchId,
      partyId: this.freightInvoice.companyId,
      invoiceNo: this.freightInvoice.invoiceNo,
      invoiceDate: this.common.dateFormatter(this.freightInvoice.date).split(' ')[0],
      remarks: this.freightInvoice.remark,
      id: this.freightInvoice.id ? this.freightInvoice.id : null,
      isSameState: this.state ? "same" : "notsame",
      gst: this.freightInvoice.gst,
      type:this.freightInvoice.type,
      parentId:this.freightInvoice.parentId,
      partyAddress:this.freightInvoice.partyAddress,
      title:this.freightInvoice.title,
      materialId:this.material.id
    };
    ++this.common.loading;
    this.api.post("FrieghtRate/saveInvoices", params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          if (this.btnTxt != 'Update Invoice') {
            this.lrAssign(res['data'][0].y_id);
          }
          this.activeModal.close({ data: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });

  }

  lrAssign(id) {
    let row = {
      _branch_id: this.freightInvoice.branchId,
      _party_id: this.freightInvoice.companyId,
      _id: id
    }
    console.log('Date:', row);

    this.common.handleModalSize('class', 'modal-lg', '800');
    this.common.params = { row: row };
    const activeModal = this.modalService.open(LrAssignComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }
  check(type) {
    console.log("type", type);
    if (type == true) {
      this.state = true;
      return;
    }
    else {
      this.state = false;

    }
  }

  getMaterialDetail(material) {
    console.log("material==",material);
    this.material.name = material.name;
    this.material.id = material.id;
  }

  resetMaterail(material) {
    this.material.id = null;
  }
}
