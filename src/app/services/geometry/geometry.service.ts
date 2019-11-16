import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  constructor() { }
  haversine(lat1, lon1, lat2, lon2) {
    // Math lib function names
    const [pi, asin, sin, cos, sqrt, pow, round] = [
      'PI', 'asin', 'sin', 'cos', 'sqrt', 'pow', 'round'
    ]
      .map(k => Math[k]),

      // degrees as radians
      [rlat1, rlat2, rlon1, rlon2] = [lat1, lat2, lon1, lon2]
        .map(x => x / 180 * pi),

      dLat = rlat2 - rlat1,
      dLon = rlon2 - rlon1,
      radius = 6372800; // Meter

    // km
    return round(
      radius * 2 * asin(
        sqrt(
          pow(sin(dLat / 2), 2) +
          pow(sin(dLon / 2), 2) *
          cos(rlat1) * cos(rlat2)
        )
      ) * 100
    ) / 100;
  };
  getPerpendicularPoint(line, point) {

    console.log("Line", line, "POINT", point);

    let d = this.distanceFromline(line, point);
    let a = this.haversine(line[0].lat, line[0].long, point.lat, point.long);
    let b = this.haversine(line[1].lat, line[1].long, point.lat, point.long);
    let c = this.haversine(line[0].lat, line[0].long, line[1].lat, line[1].long);

    console.log("A", a, "B", b, "C", c, "D", d);


    if (d > a) {
      let index = a > b ? 1 : 0;
      return { "x": line[index].x, "y": line[index].y, "ratio": index };
    }
    let ratio = (Math.sqrt((a ** 2) - (d ** 2)) / c);
    console.log("ratio", ratio);
    let lat = (ratio * (line[1].lat - line[0].lat)) + line[0].lat;
    let long = (ratio * (line[1].long - line[0].long)) + line[0].long;
    return { "lat": lat, "long": long, "ratio": ratio };
  }

  distanceFromline(line, point) {
    const arcConst = (2 * Math.PI * 6372800) / 360;
    let a = line[0].lat - line[1].lat;
    let b = line[0].long - line[1].long;
    let c = (line[0].long * (line[1].lat - line[0].lat)) - (line[0].lat * (line[1].long - line[1].long));
    let d = Math.abs((a * point.lat) + (b * point.long) + c) / Math.sqrt((a ** 2) + (b ** 2));
    return d;
  }

  getTriangleType(line, point) {
    let pi = Math.PI;
    console.log("pi", pi);
    let a = this.haversine(line[0].lat, line[0].long, point.lat, point.long);
    let b = this.haversine(line[1].lat, line[1].long, point.lat, point.long);
    let c = this.haversine(line[0].lat, line[0].long, line[1].lat, line[1].long);
    console.log("A", a);
    console.log("B", b);
    console.log("C", c);


    if (a == 0 || b == 0 || c == 0)
      return 'A';

    let a2 = a ** 2;
    let b2 = b ** 2;
    let c2 = c ** 2;
    // print_r(array(let a,let b,let c,let a2,let b2,let c2));//echo "<br>";
    // From Cosine law
    let alpha = Math.acos((b2 + c2 - a2) / (2 * b * c));
    let betta = Math.acos((a2 + c2 - b2) / (2 * a * c));
    let gamma = Math.acos((a2 + b2 - c2) / (2 * a * b));

    // Converting to degree 
    alpha = alpha * 180 / pi;
    betta = betta * 180 / pi;
    gamma = gamma * 180 / pi;
    //print_r(array(let alpha,let betta,let gamma,let points));echo "<br>";
    console.log("gamma Value", gamma);

    if (gamma > 90) {
      return 'A';
    }
    else
      return 'O';
  }

  /* desc Static function. Find point on lines nearest test point
     test point pXy with properties .x and .y
     lines defined by array aXys with nodes having properties .x and .y 
     return is object with .x and .y properties and property i indicating nearest segment in aXys 
     and property fFrom the fractional distance of the returned point from aXy[i-1]*/

  getClosestPointOnLines(pXy, aXys) {
    let minDist;
    let fTo;
    let fFrom;
    let x;
    let y;
    let i;
    let dist;
    let pointtime;
    let previoustime;

    if (aXys.length > 1) {

      for (let n = 1; n < aXys.length; n++) {

        if (aXys[n].x != aXys[n - 1].x) {
          let a = (aXys[n].y - aXys[n - 1].y) / (aXys[n].x - aXys[n - 1].x);
          let b = aXys[n].y - a * aXys[n].x;
          dist = Math.abs(a * pXy.x + b - pXy.y) / Math.sqrt(a * a + 1);
        }
        else
          dist = Math.abs(pXy.x - aXys[n].x)

        // length^2 of line segment 
        let rl2 = Math.pow(aXys[n].y - aXys[n - 1].y, 2) + Math.pow(aXys[n].x - aXys[n - 1].x, 2);

        // distance^2 of pt to end line segment
        let ln2 = Math.pow(aXys[n].y - pXy.y, 2) + Math.pow(aXys[n].x - pXy.x, 2);

        // distance^2 of pt to begin line segment
        let lnm12 = Math.pow(aXys[n - 1].y - pXy.y, 2) + Math.pow(aXys[n - 1].x - pXy.x, 2);

        // minimum distance^2 of pt to infinite line
        let dist2 = Math.pow(dist, 2);

        // calculated length^2 of line segment
        let calcrl2 = ln2 - dist2 + lnm12 - dist2;

        // redefine minimum distance to line segment (not infinite line) if necessary
        if (calcrl2 > rl2)
          dist = Math.sqrt(Math.min(ln2, lnm12));

        if ((minDist == null) || (minDist > dist)) {
          if (calcrl2 > rl2) {
            if (lnm12 < ln2) {
              fTo = 0;//nearer to previous point
              fFrom = 1;
            }
            else {
              fFrom = 0;//nearer to current point
              fTo = 1;
            }
          }
          else {
            // perpendicular from point intersects line segment
            fTo = ((Math.sqrt(lnm12 - dist2)) / Math.sqrt(rl2));
            fFrom = ((Math.sqrt(ln2 - dist2)) / Math.sqrt(rl2));
          }
          minDist = dist;
          i = n;
        }
      }

      let dx = aXys[i - 1].x - aXys[i].x;
      let dy = aXys[i - 1].y - aXys[i].y;

      x = aXys[i - 1].x - (dx * fTo);
      y = aXys[i - 1].y - (dy * fTo);

      pointtime = aXys[i].time;
      previoustime = aXys[i - 1].time;

    }

    return { 'x': x, 'y': y, 'i': i, 'fTo': fTo, 'fFrom': fFrom, 'pointTime': pointtime, 'previousPointTime': previoustime };
  }

}
