import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateService } from '../../services/date.service';
import { MapService } from '../../services/map.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'placementoptimization',
  templateUrl: './placementoptimization.component.html',
  styleUrls: ['./placementoptimization.component.scss']
})
export class PlacementoptimizationComponent implements OnInit {

  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: "68vh",
    }
  };

  headings = [];
  valobj = {};

  placementId=null;
  placementOPT=[];
  select = 0;
  name = '';
  placementDate = new Date();

  items = [
    {
      siteId: 0,
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null
    }
  ];

  
  siteData={"siteVehicleCostPackets": [
        {
            "siteId": 51561,
            "siteName": "Dynamic Cables Limited",
            "vehicleCostPacket": [
                {
                    "vehicleId": 32731,
                    "truckRegno": "RJ14GE1590",
                    "cost": null
                },
                {
                    "vehicleId": 10403,
                    "truckRegno": "RJ14GH8554",
                    "cost": null
                },
                {
                    "vehicleId": 10407,
                    "truckRegno": "RJ14GH8556",
                    "cost": null
                },
              ]
            },
            {
                "siteId": 18831,
                "siteName": "Ajmera Marble Industries",
                "vehicleCostPacket": [
                    {
                        "vehicleId": 11186,
                        "truckRegno": "RJ14GG8045",
                        "cost": null
                    },
                    {
                        "vehicleId": 32674,
                        "truckRegno": "RJ14GD7540",
                        "cost": null
                    },
                    {
                        "vehicleId": 10349,
                        "truckRegno": "RJ14GH5821",
                        "cost": null
                    },
                  ]
                }
  ]

  ,
    "siteAllocationDetails": [
        {
            "siteId": 51561,
            "name": "Dynamic Cables Limited",
            "minQuantity": 44,
            "maxQuantity": 66,
            "allocatedVehicles": 66
        },
        {
            "siteId": 51484,
            "name": "balaji poly pet",
            "minQuantity": 46,
            "maxQuantity": 50,
            "allocatedVehicles": 13
        }
    ]
  }


  constructor(
    private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public dateService: DateService,
    public accountService: AccountService,
    public user: UserService,
    public map: MapService) { }

  ngOnInit(): void {
  }

  selectplnt(plant, index) {
    this.items[index]['siteId'] = plant['id'];
    console.log("----------",this.items[index]['siteId'])
  }


  addMoreItems(index) {
    console.log("addmore items on ", index);
    this.items.push({
      siteId: 0,
      waitingTime: null,
      minQuantity: null,
      maxQuantity: null,
      penaltyMin: null,
      penaltyMax: null
    }
    );
  }

  savePlacementOptimization() {
    console.log("jsonData:", JSON.stringify(this.items))
    let params={
      name:this.name,
      allocType:this.select,
      placementDate:this.placementDate,
      placementProblemDetailsDTO:(this.items)
    }
    console.log("param:",params);
    // console.log("siteData:",this.siteData);


    this.common.loading++;
    this.api.postJavaPortDost(8084,'addPlacement', params)
      .subscribe(res => {
        this.common.loading--;
        if(res['success']){
          this.common.showToast(res['msg']);
          this.showData(res['data']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  showData(placementId){
    
      
    console.log("param:",placementId);
    this.common.loading++;
    this.api.getJavaPortDost(8084,'placementOP/'+placementId)
      .subscribe(res => {
        this.common.loading--;
        if(res['success']){
          this.placementOPT=res['data'];
          console.log("siteData:",this.placementOPT);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
