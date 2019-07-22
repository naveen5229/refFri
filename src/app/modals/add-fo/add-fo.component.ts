import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDocumentComponent } from '../../documents/documentation-modals/add-document/add-document.component';
import { DOCUMENT } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'add-fo',
  templateUrl: './add-fo.component.html',
  styleUrls: ['./add-fo.component.scss']
})
export class AddFoComponent implements OnInit {
  isFormSubmit = false;
  show_dialog: boolean = false;
  code = 0;
  companyId = null
  public button_name: any = 'Show Login Form!';

  document = {
    image1: null,
    image2: null,
    image3: null,
    base64Image: null,
  }
  showTable = false;
  company = {
    mobileNo: '',
    pan: '',
    name: '',
    address: '',
    pincode: '',
    password: '',
    partner: '',
    searchMN: '',
  }
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
  foDetaildata = [];
  foid = null;
  is_showCompany = null;
  is_company = null;
  getCompanies = null;
  companyName = ''

  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbActiveModal

  ) {
    // this.company.pan = this.common.params.company.pan;

  }

  ngOnInit() {
  }

  toggle() {
    this.show_dialog = !this.show_dialog;

    // CHANGE THE TEXT OF THE BUTTON.
    if (this.show_dialog)
      this.button_name = "Hide Login Form!";
    else
      this.button_name = "Show Login Form!";
  }


  handleFileSelection(event, index) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        //this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

        console.log('Base 64: ', res);
        this.document['image' + index] = res;
        //this.compressImage(res, index);
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }
  addfo() {
    //console.log("hiiiiiiiiii", form);

    let params = {
      name: this.company.name,
      mobileNo: this.company.mobileNo,
      address: this.company.address,
      pinCode: this.company.pincode,
      passWord: this.company.password,
      idProof: this.document.image1,
      addProofFront: this.document.image2,
      addProofBack: this.document.image3,
      panCard: this.company.pan,
      partner: this.company.partner,
      search: this.company.searchMN,
    };
    console.log('Params:', params);
    // if (params) return;
    this.common.loading++;

    this.api.post('Gisdb/addFo', params)
      .subscribe(res => {
        this.common.loading--;

        console.log('Res:', res['data']);
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }




  checkFormat() {
    this.company.pan = (this.company.pan).toUpperCase();

  }

  selectPartner(e) {
    // console.log('', e)
    this.company.partner = e.id;

  }

  closeModal() {
    this.activeModal.close();
  }

  addFo() {

  }
  searchUser() {

  }

  test() {
    this.code = null;
    if (this.company.mobileNo.length == 10) {
      console.log("test");
      let params = 'mobileno=' + this.company.mobileNo
      this.api.get('gisdb/FoExists?' + params)
        .subscribe(res => {
          console.log(res)

          this.code = res['code']
          console.log("pa", this.code)
        }, err => {
          console.error(err);
          this.common.showError();
          this.common.loading--;
        });
    }
  }
  selectFoUser(event) {
    this.foid = event.id;
    console.log("id", this.foid);
    this.getSmartTableData();


  }

  // formatTitle(title) {
  //   return title.charAt(0).toUpperCase() + title.slice(1)
  // }


  // getTableColumns() {

  //   let columns = [];
  //   console.log("Data=", this.data);
  //   this.data.map(doc => {
  //     this.valobj = {};
  //     for (let i = 0; i < this.headings.length; i++) {
  //       console.log("doc index value:", doc[this.headings[i]]);
  //       console.log("ico1n")

  //       if (this.headings[i] == 'company_id')
  //        {
  //         //  if(this.headings[i]== null){
  //         this.valobj['company_id'] = { class: "fa fa-edit", action: this.showFoDetails.bind(this, doc._item_id, doc.State, doc._state_id, doc.RemQauantity) }
  //         //  }
  //       }
  //       else {
  //         this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: '' };
  //       }
  //     }
  //     columns.push(this.valobj);
  //   });
  //   return columns;
  // }

  getSmartTableData() {

    let params = 'foid=' + this.foid
    console.log("params", params)
    this.common.loading++;

    this.api.get("Gisdb/getFoDetails?" + params).subscribe(
      res => {
        this.common.loading--;
        this.foDetaildata = res['data'];
        this.showTable = true;

        this.is_showCompany = this.foDetaildata[0].show_allcompany,
          this.is_company = this.foDetaildata[0].company_id,
          this.companyName = this.foDetaildata[0].Company;
        if (this.is_company == null) {
          this.selectCompany(event)


        }

        console.log("result", this.is_showCompany);
        console.log("result1s", this.companyName);

        // let first_rec = this.data[0];
        //     for (var key in first_rec) {
        //       if (key.charAt(0) != "_") {
        //         this.headings.push(key);
        //         let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        //         this.table.data.headings[key] = headerObj;
        //       }
        //     }
        //     this.table.data.columns = this.getTableColumns();
        //   }
      });
  }

  selectCompany(event) {
    console.log("event", event)
    this.companyId = event.id
    console.log("event1", event.id)
    this.companyName = event.name

    this.changeCompanyDetail()

  }

  changeCompanyDetail() {
    const params = {
      foid: this.foid,
      companyId: this.companyId
    }
    this.common.loading++;

    this.api.post('Gisdb/updateFoDetails', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['msg'] == "Success") {
          this.common.showToast("Successfully Update")
          this.activeModal.close();
        }
        console.log('Res:', res['data']);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

showCompany(){
  if(this.is_showCompany == false){
    this.is_showCompany=0
  }
  else
  {
    this.is_showCompany=1

  }
  const params = {
    foid: this.foid,
    show_allcompany: this.is_showCompany
  }
  this.common.loading++;

  this.api.post('Gisdb/changeFoCompanyFlag', params)
    .subscribe(res => {
      this.common.loading--;
      if (res['msg'] == "Success") {
        this.common.showToast("Successfully Update")
        this.activeModal.close();
      }
      console.log('Res:', res['data']);
    }, err => {
      this.common.loading--;
      console.log(err);
    });
}
 
  }




