import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { CsvErrorReportComponent } from '../../modals/csv-error-report/csv-error-report.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'zone-details',
  templateUrl: './zone-details.component.html',
  styleUrls: ['./zone-details.component.scss']
})
export class ZoneDetailsComponent implements OnInit {

 
  selectedStateData = [{
    categoryId: 11,
    stateId: null,
    zoneId: 0
  }];

  csv: any;

  selectedStatecat = null;
  selectedDistcat = null;
  selectedTehcat = null;
  catId = 11;
  locationName = 'State'
  selectCategory = 11;
  selectZone= 0;
  specialAreaList = [];
  stateData = [];
  districtData = [];
  tehsilData = [];
  // selectedStateData =  {}

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService) {
      this.getSpecialArea();
  }
  ngOnDestroy(){}
ngOnInit() {
  }

  getSpecialArea() {
    this.common.loading++;
    this.api.get('LoadIntelligence/getAllSpecialAreas')
      .subscribe(res => {
        this.common.loading--;
        this.specialAreaList = res['data'];
        this.stateData = this.specialAreaList['state']
        this.districtData = this.specialAreaList['district']
        this.tehsilData = this.specialAreaList['tehsil']
        console.log("Model Type", this.specialAreaList);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

addMore() {
  this.selectedStateData.push({
    categoryId: 11,
    stateId: null,
    zoneId: 0
  });
}

selectedCategory(catId) {
  console.log(catId);
    if(catId == 11) {
        this.locationName = 'State';
       
    } else if(catId == 10) {
      this.locationName = 'District';
  
    } else if(catId == 12) {
      this.locationName = 'Tehsil';
        }
}


handleFileSelection(event) {
  this.common.loading++;
  this.common.getBase64(event.target.files[0])
    .then(res => {
      this.common.loading--;
      let file = event.target.files[0];
      if (file.type == "text/csv") {
      }
      else {
        alert("valid Format Are : csv");
        return false;
      }

      // res = res.toString().replace('vnd.ms-excel', 'csv');
      this.csv = res;
    }, err => {
      this.common.loading--;
      console.error('Base Err: ', err);
    })
}

uploadCsv() {
  const params = {
    csv: this.csv,
  };
  if (!params.csv) {
    return this.common.showError("Select  Option");
  }
  this.common.loading++;
  this.api.post('LoadIntelligence/ImportZoneDetailsCsv', params)
    .subscribe(res => {
      this.common.loading--;
      let successData =  res['data']['success'];
      let errorData =res['data']['fail'];
      alert(res["msg"]);
      this.common.params = { apiData: params,successData, errorData, title: 'Bulk Vehicle csv Verification',isUpdate:false };
      const activeModal = this.modalService.open(CsvErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

    }, err => {
      this.common.loading--;
      console.log(err);
    });
}

DownloadCsv()  {
  var data
  this.common.loading++;
  this.api.get('LoadIntelligence/getAllSpecialAreasCSV')
    .subscribe(res => {
      this.common.loading--;
       data =  res['data'];
       const linkSource = data;
       const downloadLink = document.createElement("a");
       const fileName = "vct_illustration.csv";
       downloadLink.setAttribute('target', '_blank');
       downloadLink.href = linkSource;
       downloadLink.download = fileName;
       downloadLink.click();
    }, err => {
      this.common.loading--;
      console.log(err);
    });
 
}

uploadData() {
  console.log(this.selectedStateData);
  const params = {data: this.selectedStateData.slice(0, -1)}
  this.common.loading++;
  this.api.post('LoadIntelligence/UpdateSpecialAreasType', params)
    .subscribe(res => {
      console.log(res);
      this.common.loading--;
    }, err => {
      this.common.loading--;
      console.log(err);
    });
}

}
