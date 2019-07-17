import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'freight-rate-calculation',
  templateUrl: './freight-rate-calculation.component.html',
  styleUrls: ['./freight-rate-calculation.component.scss']
})
export class FreightRateCalculationComponent implements OnInit {
  
  isFormSubmit = false;
  Form: FormGroup;
  companyId=null;
  origin=null;
  siteId=null;
  materialId=null;
  destination=null;
  weight=null;
  qty=null;
  distance=null;
  detention=null;
  delay=null;
  shortage=null;
  shortagePer=null;
  radioValue=1;
  value=null;

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
  constructor(public api:ApiService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    public common:CommonService) { 
      this.common.handleModalSize('class', 'modal-lg', '1000');
    }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      company: ['', Validators.required],
      origin: ['', Validators.required],
      material: ['', Validators.required],
      destination:['', Validators.required],

  
    });
  }

  get f() {
    return this.Form.controls;
  }


  submit(){
      this.shortage=null;
      this.shortagePer=this.value;
    if(this.radioValue==0){
      this.shortage=this.value;
      this.shortagePer=null;
    }
    else{
      this.shortage=null;
      this.shortagePer=this.value;
    }
    const params = {
      companyId: this.companyId,
      siteId: this.siteId,
      materialId: this.materialId,
      origin:this.origin,
      destination:this.destination,
      weight:this.weight,
      qty:this.qty,
      detention:this.detention,
      delay:this.delay,
      shortage:this.shortage,
      shortagePer:this.shortagePer,
      distance:this.distance,
    };
     ++this.common.loading;
    console.log("params",params);
    this.api.post('FrieghtRate/getFrieghtRate',params)
      .subscribe(res => 
        {
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

}
