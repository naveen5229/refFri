import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss', '../../pages/pages.component.css']
})
export class CompanyDetailsComponent implements OnInit {
data=[{
  id:1,
  name:'Lalit',
  mobile:'9521108867',

},
{
  id:2,
  name:'Amit',
  mobile:'9881108867',
  
}]

  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) { }

  ngOnInit() {
  }

}
