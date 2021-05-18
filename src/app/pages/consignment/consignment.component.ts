import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'consignment',
  templateUrl: './consignment.component.html',
  styleUrls: ['./consignment.component.scss']
})
export class ConsignmentComponent implements OnInit {
  Reports:any;
  reporttype='DB';
  amountDetails: [{
    col_id:null,
    col_order:null,
    col_title:'',
    is_default:false,
  }]
  firstreport = [];
  secondreport = [];

  constructor(private api: ApiService, private modalService: NgbModal, private common: CommonService) { }

  ngOnInit(): void {
  }

  getDynamicReports() {
    this.Reports = this.firstreport = this.secondreport = [];
    this.common.loading++;
    this.api.get('tmgreport/getConsignmentCols?typename='+this.reporttype)
      .subscribe(res => {
        this.common.loading--;
        console.log('getConsignmentCols:', res);
        this.Reports = res['data'];
        this.Reports.map((pt,index)=>{
          if(pt.col_title == null){
          this.Reports[index].col_title = pt.col_title_actual;
          }
        });
        let len = (this.Reports.length)/2;
        let index = 0 ;
        this.Reports.map((data,secin)=>{
          if(index % 2 == 0){
        console.log('first len',len,index);
            this.firstreport.push(this.Reports[secin]);
            } else{
        console.log('second len',len,index);
              this.secondreport.push(this.Reports[secin]);
            }
            index = index + 1;
        });
        console.log('data report',this.firstreport,this.secondreport);

      }, err => {
        console.log(err);
        this.common.loading--;
      })
  }
  
  savereport() {
    console.log('amountDetails',this.Reports)
    let demodata =[];
    this.Reports.map((data)=>{
      if(data.is_default){
      let dee = {
        colid:data.col_id ,
        coltitle:data.col_title ,
        colorder:data.col_order ,
      };
      demodata.push(dee);
    }
    });
    console.log('demodata',demodata)
    let params = {
      typename: this.reporttype,
      jsondata: demodata
    };
    this.common.loading++;
    this.api.post('tmgreport/saveConsignmentCols',params)
      .subscribe(res => {
        this.common.loading--;
        let re=  res['data']
       if(re[0]['mm_save_consign_fo_cols'] == 'Successfully Save.'){
         this.common.showToast(re[0]['mm_save_consign_fo_cols']);
       }
        


      }, err => {
        console.log(err);
        this.common.loading--;
      })
  }
}
