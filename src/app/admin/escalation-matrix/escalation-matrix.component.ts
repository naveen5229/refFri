import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEscalationIssueComponent } from '../../modals/add-escalation-issue/add-escalation-issue.component';

@Component({
  selector: 'escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss','../../pages/pages.component.css']
})
export class EscalationMatrixComponent implements OnInit {

  escalationMatrix = null;
  matrixList= [];
  issue_t
  foid='';
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

  constructor(public api: ApiService, public common: CommonService,
              public user: UserService,
               public modalService: NgbModal) {
                this.common.refresh = this.refresh.bind(this);
                }

  ngOnInit() {
  }

  refresh(){
    this.Matrixdata();
  }

  getMatrix(user)
  {
    this.foid=user.id,
    this.Matrixdata();
  }

  Matrixdata() {
    //this.escalationMatrix = user;
    let params = {
      foid: this.foid
    };
    this.common.loading++;
    this.api.post('FoTicketEscalation/getEscalationMatrix',params)
            .subscribe(res =>{
              this.common.loading--;
              console.log('res: '+res['msg']);
              this.matrixList= res['msg'];
              let first_rec = this.matrixList[0];
        let headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
          }
        }
        this.table.data = {
          headings: headings,
          columns: this.getTableColumns()
        };
            }, err => {
              this.common.loading--;
              this.common.showError();
            });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.matrixList);
    this.matrixList.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];
    icons.push(
      {
        class: "fa fa-edit",
        action: this.openAddIssueModel.bind(this, details)

      }
    )
    console.log("details-------:", details)
    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }



  openAddIssueModel(matrix?){
    let foid=this.foid;
    let issueType=matrix._issue_type_id;
    console.log("foid is:",foid);
    console.log("foid is:",matrix);
    if(matrix) this.common.params= {foid,issueType};
    const activeModal= this.modalService.open(AddEscalationIssueComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'});
     activeModal.result.then(data =>{

      this.Matrixdata();
       if(!data.status){
        
       }
     });
  }
}
