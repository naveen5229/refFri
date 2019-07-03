import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { AddFuelIndentComponent } from '../../modals/add-fuel-indent/add-fuel-indent.component';

@Component({
  selector: 'fuel-indent',
  templateUrl: './fuel-indent.component.html',
  styleUrls: ['./fuel-indent.component.scss']
})
export class FuelIndentComponent implements OnInit {

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
  
  endDate=new Date();
  startDate=new Date(new Date().setDate(new Date(this.endDate).getDate()-7));
  constructor(public api: ApiService,
    private modalService: NgbModal,
    public common: CommonService) {
      this.getFuelIndent();
   
  }

  ngOnInit() {
  }

 getFuelIndent() {
    const params="startdate="+this.common.dateFormatter1(this.startDate)+"&enddate="+this.common.dateFormatter1(this.endDate);
    //   console.log("params", params);
    console.log("params", params);
    ++this.common.loading;
    this.api.get('Fuel/getPendingFuelIndentWrtFo?' + params)
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
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
         if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.editFuelIndent.bind(this,doc,'Update') }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  editFuelIndent(doc,update) {
   this.common.params={
        title:'Edit Fuel Indent',
        doc:doc,
        flag:update
    };
    
    const activeModal = this.modalService.open(AddFuelIndentComponent, {
      size: "lg",
      container: "nb-layout"
    })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }

  addFuelIndent(add) {
       this.common.params={
        title:'Add Fuel Indent',
        flag:add
    };
   
    const activeModal = this.modalService.open(AddFuelIndentComponent, {
      size: "lg",
      container: "nb-layout"
    })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }

}
