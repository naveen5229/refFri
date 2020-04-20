import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import xml2js from 'xml2js';  


@Component({
  selector: 'upload-routes',
  templateUrl: './upload-routes.component.html',
  styleUrls: ['./upload-routes.component.scss']
})
export class UploadRoutesComponent implements OnInit {

  latLngs = [];
  name   = '';
  constructor(public common: CommonService,
    public api: ApiService) { }

  ngOnInit() {
  }

  UploadRoutes() {
    let params = {routeDetails: {name: this.name, latLngs: this.latLngs}}; 
    this.common.loading++;
    this.api.post('LoadIntelligence/saveKMLRoutes', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        if(res['success']){
          this.common.showToast('Data Uploaded');
        }
      
      });

  }

  handleFileSelection(event) {
    this.latLngs = [];
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            var text = reader.result as string;
            let parser = new DOMParser();
            let xmlDocs = parser.parseFromString(text, "text/xml") 
            let xmlData = xmlDocs.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue;
            this.name = xmlDocs.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            let restructedXml = xmlData.split('\n');
            restructedXml.forEach( e => {
              let x = e.trim().split(',')
              this.latLngs.push({lat: x[1], long: x[0]});
            })
            this.latLngs = this.latLngs.slice(1, this.latLngs.length-1);
        }
        reader.readAsText(input.files[index]);
    };
          
    
  }
}
