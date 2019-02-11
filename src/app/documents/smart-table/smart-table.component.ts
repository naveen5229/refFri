import { Component, OnInit } from '@angular/core';
import { Ng2SmartTableModule  } from 'ng2-smart-table';
import { CommonService } from './../../services/common.service';
import { ApiService } from './../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'smart-table',
  // templateUrl: './smart-table.component.html',
 template: `
    <input #search class="search" type="text" placeholder="Search..." (keydown.enter)="onSearch(search.value)">
    <ng2-smart-table [settings]="settings" [source]="source"></ng2-smart-table>  `,

  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  settings = {
    columns: {
      id: {
        title: 'SrNo'
      },
      vehicleNo: {
        title: 'Vehicle Number'
      },
      documentType: {
        title: 'Document Type'
      },
      email: {
        title: 'Agent Name'
      },
      issueDate :{
        title : 'Issue Date'
      },
      WefDate :{
        title : 'Wef Date'
      },
      expiryDate :{
        title : 'Expiry  Date'
      },
      documentNumber : {
        title : 'Document Number'
      },
      image :{
        title : 'Image'
      },
      remark :{
        title:'Remark'
      }
    }
  };
  data = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz"
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv"
    },
    
    // ... list of items
    
    {
      id: 11,
      name: "Nicholas DuBuque",
      username: "Nicholas.Stanton",
      email: "Rey.Padberg@rosamond.biz"
    }
  ];
 constructor(){
  // this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
  // .subscribe(res => {
  //   this.common.loading--;
  //   console.log("data", res);
  //   this.data = res['data'];

 }
  ngOnInit() {
  }

  


}
