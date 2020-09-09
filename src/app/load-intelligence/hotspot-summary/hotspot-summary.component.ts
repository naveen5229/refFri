import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../services/common.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Geo from "d3-geo";
import * as d3Fetch from "d3-fetch";
import * as topojson from "topojson-client";
import { by } from 'protractor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'hotspot-summary',
  templateUrl: './hotspot-summary.component.html',
  styleUrls: ['./hotspot-summary.component.scss']
})
export class HotspotSummaryComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;

  public name: string = 'd3';
  data = [];
  title = 'Map Chart';
  condition = false;
  nameData = 'india';
  state_name = null;
  stateId = null;

  typeId = null;
  admTypeId = null;
  categoryType = null;
  identityType = null;

  categorName = '';
  loader = 0;
  markers = [];
  stateNames = [];
  plantSummary = [];
  plantList = [];
  marker: any;
  svg: any;
  projection: any;

  constructor(public api: ApiService, 
    public common: CommonService) {

  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.getIndiaData();
    }, 1000);
  }

  getPlantSummary(typeId, admTypeId, catType?) {
    this.loader++;
    let params = 'typeId=' + typeId + '&admType=' + admTypeId
    this.api.get('LoadIntelligence/getPlantsSummary.json?' + params).subscribe(res => {
      this.loader--;
      console.log(res);
      this.plantSummary = res['data'];
      if (catType) {
        this.showMarker(admTypeId, catType);

      }
    });
  }

  getPlantList(catId, identityType) {
    this.loader++;
    let params = 'typeId=' + this.typeId + '&admType=' + this.admTypeId + '&identityType=' + identityType + '&categoryType=' + catId;
    if (catId == 1) {
      this.categorName = 'Plants'
    } else if (catId == 2) {
      this.categorName = 'Warehouses'

    } else if (catId == 3) {
      this.categorName = 'Delivery Points'
    }
    this.api.get('LoadIntelligence/getPlantsList.json?' + params).subscribe(res => {
      this.loader--;
      // console.log(res);
      this.plantList = res['data'];
      console.log(this.plantList);

    });
  }

  getIndiaData() {
    this.loader++;
    this.api.get('LoadIntelligence/getStates').subscribe(res => {
      this.loader--;
      console.log(res);
      this.state_name = res['data'][0]['name'];
      this.typeId = res['data'][0]['type'] ? 1 : null;
      this.admTypeId = res['data'][0]['id'];
      this.stateNames = res['data'][0]['topojson']['objects']['testy']['geometries'].map(prop => {
        return prop['properties']['name'];
      });
      this.stateNames.sort();
      console.log(this.stateNames);
      this.map2(res['data'][0]['topojson']);
      this.getPlantSummary(this.typeId, this.admTypeId);
    });
  }

  getStateData(stateId, stateName, catType) {
    console.log(stateId);
    this.loader++;
    let params = 'stateId=' + stateId
    this.api.get('LoadIntelligence/getDistricts.json?' + params).subscribe(res => {
      this.loader--;
      console.log(res);
      this.state_name = stateName;

      this.typeId == 11 ? (this.typeId = 2) : (this.typeId = this.typeId);
      this.map2(res['data'][0]['topojson'], stateId)
      this.getPlantSummary(this.typeId, this.admTypeId, catType);
    });
  }


  getDistrictData(distId, distName) {
    console.log(this.admTypeId);
    console.log(this.typeId);
    console.log(distId);
    this.typeId = 3;
    this.state_name = distName;
    this.getPlantSummary(this.typeId, this.admTypeId);



    // this.loader++;
    // let params = 'distId=' + distId
    // this.api.get('LoadIntelligence/getDistricts.json?' + params, null, null, 'B').subscribe(res => {
    //   this.loader--;
    //   console.log(res);
    //   this.state_name = distName;

    //   this.typeId == 11 ? (this.typeId = 2) : (this.typeId =null);
    //   this.map2(res['data'][0]['topojson'], distId)
    //   // this.getPlantSummary(this.typeId, this.admTypeId);
    // });
  }

  createLineChart() {
    this.data = [4, 5, 6, 7, 8, 7, 6, 5, 4];

    d3.select('h1')
      .data(this.data)
      .enter()
      .append('h1')
      .classed('bar', true)
      .style('height', function (d) {
        console.log(d);
        return d * 50 + "px";
      })
      .style('width', "32px")
      .style('display', 'inline-block')
      .style('background-color', '#7ED26D')
      .style('margin-left', '5px');
  }


  map2(byName, id?) {
    console.log(byName, id);
    d3.selectAll("svg").remove();
    var width = 600, height = 600;
    this.svg = d3.select('#map').append('svg')
      .attr("width", width)
      .attr("height", height);
    // var g = svg.append("g");
    var g = this.svg.append("g");
    this.projection = d3Geo.geoMercator();
    var path = d3Geo.geoPath()
      .projection(this.projection)
      .pointRadius(2);
    let data = byName
    var boundary = this.centerZoom(data, byName, this.projection, path, width, height, id);
    console.log(boundary);
    var subunits = this.drawSubUnits(data, byName, g, path, id, this.projection, this.svg);
    console.log(subunits, data);
    this.colorSubunits(subunits);
    // this.drawSubUnitLabels(data, g, path, id);
    // drawPlaces(data);
    this.drawOuterBoundary(data, boundary, g, path);
    // });



  }

  drawSubUnitLabels(data, g, path, id) {
    let dist = data.objects['testy'] || data.objects['test' + id]
    console.log(topojson.feature(data, dist).features);
    g.selectAll(".subunit-label")
      .data(topojson.feature(data, dist).features)
      .enter().append("text")
      .attr("class", "subunit-label")
      .attr("transform", function (d: any) {
        // console.log(path.centroid(d));
        return "translate(" + path.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("color", "blue")
      .style("text-shadow", "0px 0px 2px #fff")
      .style("text-transform", "uppercase")
      .text(function (d: any) { return d.properties.name; })

  }

  getMyCentroid(element) {
    var bbox = element.getBBox();
    return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
  }

  centerZoom(data, name, projection, path, width, height, id) {
    console.log(Object.keys(data.objects)[0]);
    console.log(data.objects);

    let dist;
    // name != 'india' ?  dist  = data.objects[ name + '_district'] : dist  = data.objects[ name];
    dist = data.objects['testy'] || data.objects['test' + id]
    var o = topojson.mesh(data, dist, function (a, b) {
      return a === b;
    });
    projection
      .scale(1)
      .translate([0, 0]);

    var b = path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0] [0]) / width, (b[1][1] - b[0][1]) / height),
      t: any = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
      console.log();
    var p = projection
      .scale(s)
      .translate(t);

    return o;
  }
  tooltip
  drawSubUnits(data, name, g, path, id, projection, svg) {
    let dist;
    dist = data.objects['testy'] || data.objects['test' + id]

    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0 );

    // console.log(topojson.feature(data, dist)common);
    var subunits = g.selectAll(".subunit")
      .data(topojson.feature(data, dist).features)
      .enter().append("path")
      .attr("class", "subunit")
      .attr("d", path)
      .style("stroke", "#3a403d")
      .style("stroke-width", "1px")
      .style("cursor", "pointer")
      .on("mouseover",  d => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.properties.name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");

          setTimeout(e => {
            tooltip.transition()
            .duration(500)
              .style("opacity", 0);
          }, 2000)
      })
      .on("mouseout",  d => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", d => {
        
        console.log('Click:', d);
        this.plantList = [];
        this.nameData = d['properties']['st_nm'];
        let stateName = d['properties']['name'];
        this.stateId = d['properties']['id'];
        this.typeId = d['properties']['type'];
        this.admTypeId = d['properties']['id'];
        if (this.typeId == 11) {
          this.categoryType = 1;
          this.getStateData(this.admTypeId, stateName, this.categoryType);

          // setTimeout(() => {
          //   this.showMarker(this.admTypeId, stateName, projection, svg, this.categoryType);
          // }, 15000);

          this.condition = true;
        } else if (this.typeId == 10) {
          this.categoryType = 2;
          this.getDistrictData(this.admTypeId, stateName);
          this.showMarker(this.admTypeId,  this.categoryType);

          // this.showDist(d);
        }

        console.log(this.state_name);
      })

    return subunits;

  }

  drawOuterBoundary(data, boundary, g, path) {
    g.append("path")
      .datum(boundary)
      .attr("d", path)
      .attr("class", "subunit-boundary")
      .attr("fill", "none")
      .attr("stroke", "#3a403d")


  }

  colorSubunits(subunits) {
    // console.log(d3ScaleChromatic.schemeCategory10);
    var c = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);
    subunits

      .style("fill", function (d) {
        return d['properties'].color;
        console.log(d);
        // if(d['properties'].id === 780){
        //   return 'blue';
        // }else {
        //   return 'gray'
        // }
      })
      .style("opacity", ".6");

  }

  onBack() {
    // this.state_name = 'India';
    this.plantList = [];
    this.getIndiaData();
  }


  // showStateMarker(id, catType) {
  //   console.log(id, catType);
  //   this.markers = [];
  //   this.typeId == 11 ? (this.typeId = 2) : (this.typeId = this.typeId);
  //   this.loader++;
  //   let params = 'typeId=' + this.typeId + '&admType=' + id + '&categoryType=' + catType;
  //   this.api.get('LoadIntelligence/getWarehouses.json?' + params, null, null, 'B').subscribe(res => {
  //     console.log(res['data']);
  //     this.markers = res['data'][0]['res'];
  //     this.loader--;
  //     console.log(this.markers);
  //     this.createMarkers3(this.svg, this.projection, this.markers);


  //   });
  // }

  showMarker(id, catType) {
    console.log(id, catType);
    this.markers = [];
    this.typeId == 11 ? (this.typeId = 2) : (this.typeId = this.typeId);
    this.loader++;
    let params = 'typeId=' + this.typeId + '&admType=' + id + '&categoryType=' + catType;
    this.api.get('LoadIntelligence/getWarehouses.json?' + params).subscribe(res => {
      console.log(res['data']);
      this.markers = res['data'][0]['res'];
      this.loader--;
      console.log(this.markers);
      catType == 2 ? this.createMarkers2(this.svg, this.projection, this.markers) : this.createMarkers3(this.svg, this.projection, this.markers)
      // this.createMarkers2(this.svg, this.projection, this.markers);


    });


  }

  createMarkers3(svg, projection, data) {
    console.log(data);
    let features = data;


    for (let j = 0; j < features.length; j++) {
      let x = projection([features[j].long, features[j].lat])[0];
      let y = projection([features[j].long, features[j].lat])[1];

      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("color", "blue")
        .style("font-size", '18px');

      this.marker = svg
        .append("image")
        .attr('class', 'mark')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", 'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png')
        .style("cursor", "pointer")

        .on('click', d => {
          console.log(d);
          tooltip.transition()
            .duration(500)
            .style("opacity", .9);
          tooltip.html(features[j].cityCode)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

          setTimeout(e => {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          }, 500)
        })


        .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
        .attr("transform", "translate(" + x + "," + y + ") scale(0)")
        .transition()
        .delay(200)
        .attr("cy", 100)
        .duration(800)
        .attr("transform", "translate(" + x + "," + y + ") scale(.9)");

      // console.log(this.marker);
      //   this.marker.on('click', d => {
      //     console.log(d);
      //   })
      console.log(this.markers);
    }
  }

  createMarkers2(svg, projection, data) {
    let features = data;
    for (let j = 0; j < features.length; j++) {
      let x = projection([features[j].long, features[j].lat])[0];
      let y = projection([features[j].long, features[j].lat])[1];
      this.marker = svg.append("svg:path")
        .attr("class", "marker")
        .style("fill", "purple")
        .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
        .attr("transform", "translate(" + x + "," + y + ") scale(0)")
        .transition()
        .delay(200)
        .attr("cy", 100)
        .duration(800)
        .attr("transform", "translate(" + x + "," + y + ") scale(.4)")


      console.log(this.marker);



    }
  }

downloadCsv(catList) {
  this.common.getCSVFromTableIdLatest(catList);

}

}















