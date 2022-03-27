function onClick() {
  document.getElementById("modalGraph").style.display = "block";
  var chart = new google.visualization.LineChart(document.getElementById('modalChart'));
  switch (this.id) {
    case "noDrag": chart.draw(warpspeed.noDragData, warpspeed.noDragOptions); break;
    case "gWarp": chart.draw(warpspeed.gWarpData, warpspeed.gWarpOptions); break;
    case "eWarp": chart.draw(warpspeed.eWarpData, warpspeed.eWarpOptions); break;
    case "wType": chart.draw(warpspeed.wTypeData, warpspeed.wTypeOptions); break;
    case "subLt": chart.draw(warpspeed.subLtData, warpspeed.subLtOptions); break;
    case "wZero": chart.draw(warpspeed.wZeroData, warpspeed.wZeroOptions); break;
  }
}

function initCharts() {
  // Build all the chart data
  warpspeed.noDragData = new google.visualization.DataTable();
  warpspeed.noDragData.addColumn('number', 'W');
  warpspeed.noDragData.addColumn('number', 'Speed');
  for (val of warpspeed.noDrag) warpspeed.noDragData.addRow([val[0], val[1]]);
  warpspeed.gWarpData = new google.visualization.DataTable();
  warpspeed.gWarpData.addColumn('number', 'W');
  warpspeed.gWarpData.addColumn('number', 'Speed');
  for (val of warpspeed.genWarp) if (isFinite(val[0])) warpspeed.gWarpData.addRow([val[0], val[2]]);
  warpspeed.eWarpData = new google.visualization.DataTable();
  warpspeed.eWarpData.addColumn('number', 'W');
  warpspeed.eWarpData.addColumn('number', 'Speed');
  for (val of warpspeed.effWarp) if (isFinite(val[1])) warpspeed.eWarpData.addRow([val[0], val[2]]);
  warpspeed.wTypeData = new google.visualization.DataTable();
  warpspeed.wTypeData.addColumn('number', 'W');
  warpspeed.wTypeData.addColumn('number', '\u0174\u00B3');
  warpspeed.wTypeData.addColumn('number', '\u0174\u00B2');
  warpspeed.wTypeData.addColumn('number', '\u0174');
  for (val of warpspeed.wTypes) if (isFinite(val[0])) warpspeed.wTypeData.addRow([val[1], val[2], val[3], val[4]]);
  warpspeed.subLtData = new google.visualization.DataTable();
  warpspeed.subLtData.addColumn('number', 'W');
  warpspeed.subLtData.addColumn('number', 'W\u00B3');
  warpspeed.subLtData.addColumn('number', 'W\u00B2');
  warpspeed.subLtData.addColumn('number', 'W');
  for (val of warpspeed.subLight) warpspeed.subLtData.addRow([val[0], val[1], val[2], val[3]]);
  warpspeed.wZeroData = new google.visualization.DataTable();
  warpspeed.wZeroData.addColumn('number', 'W');
  warpspeed.wZeroData.addColumn('number', '\u00C6');
  for (val of warpspeed.wZero) if (isFinite(val[0])) warpspeed.wZeroData.addRow([val[0], val[1]]);
  // This sets up the onClick and cursor on each of the tables
  for (t of [ "noDrag", "gWarp", "eWarp", "wType", "subLt", "wZero" ]) {
    var e = document.getElementById(t);
    e.style.cursor = "zoom-in";
    e.onclick = onClick;
  }
}

const warpspeed = {
  // conversion functions
  aether: function(w) {
    return isFinite(w) ? Math.E**(6*Math.tanh((w-1)/3)) : (w < 0 ? Math.E**(-6) : Math.E**(6));
  },
  genW2effW: function(w) {
    return isFinite(w) ? 10*Math.tanh(w*Math.atanh(1/10)) : 10;
  },
  effW2genW: function(w) {
    return Math.atanh(w/10)/Math.atanh(1/10);
  },
  w2spd: function(genW, effW, type) {
    return effW**type*this.aether(genW);
  },
  genW2delW: function(w) {
    var a = Math.tan(3*Math.PI/8);
    var s = 1 - (Math.sqrt(2)-1) * 9 / 2 + (Math.sqrt(2)+1) * 40 / 9;
    return 10-(a/((w-s)+Math.sqrt(a**2+(w-s)**2-1)));
  },
  delW2spd: function(w) {
    return 6*(Math.E**w-(w**2/2+w+1));
  },
  distToTime: function(v, d, u) {
    var time = d/v * (u == "pc" ? 3.26156: 1);
    if (time > 1) { return time.toFixed(2) + " y"; }
    else time *= 365.2422;
    if (time > 1) { return time.toFixed(2) + " d"; }
    else time *= 24;
    if (time > 1) { return time.toFixed(2) + " h"; }
    else time *= 60;
    return time.toFixed(2) + " m";
  },
  checkInfin: function(x, fix) {
    return (isFinite(x) ? ((fix != null) ? x.toFixed(fix) : x) : ((x < 0) ? "-&infin;" : "&infin;"))
  },
  // cached data
  data: {
    noDrag: [],
    gWarp: [],
    fWarp: [],
    wTypes: [],
    subLt: [],
    wZero: [],
    distW: [],
    distSp: []
  },
  // data accessors
  get noDrag() {
    if (this.data.noDrag.length == 0) {
      for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]) this.data.noDrag.push([w, w**3*this.aether(w)]);
    }
    return this.data.noDrag;
  },
  get genWarp() {
    if (this.data.gWarp.length == 0) {
      for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
        var ew = this.genW2effW(w);
        this.data.gWarp.push([w, ew, this.w2spd(w, ew, 3)]);
      }
    }
    return this.data.gWarp;
  },
  get effWarp() {
    if (this.data.fWarp.length == 0) {
      for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5, 9.9, 9.99, 9.999, 10]) {
        var gw = this.effW2genW(w);
        this.data.fWarp.push([w, gw, this.w2spd(gw, w, 3)]);
      }
    }
    return this.data.fWarp;
  },
  get wTypes() {
    if (this.data.wTypes.length == 0) {
      for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
        var ew = this.genW2effW(w);
        this.data.wTypes.push([w, ew, this.w2spd(w, ew, 3), this.w2spd(w, ew, 2), this.w2spd(w, ew, 1)]);
      }
    }
    return this.data.wTypes;
  },
  get subLight() {
    if (this.data.subLt.length == 0) {
      for (w of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 0.999, 1, 1.001, 1.01, 1.1]) {
        var ew = this.genW2effW(w);
        this.data.subLt.push([w, this.w2spd(w, ew, 3), this.w2spd(w, ew, 2), this.w2spd(w, ew, 1)]);
      }
    }
    return this.data.subLt;
  },
  get wZero() {
    if (this.data.wZero.length == 0) {
      for (w of [-Infinity, -5, -1, -0.5, 0, 0.5, 1, 2, 4, 7, 10, 20, Infinity])
          this.data.wZero.push([w, this.aether(w)]);
    }
    return this.data.wZero;
  },
  // Graph data
  noDragData: null,
  gWarpData: null,
  eWarpData: null,
  wTypeData: null,
  subLtData: null,
  wZeroData: null,
  noDragOptions: {
    title: 'Generated Warp vs Apparent Speed',
    hAxis: {title: 'Generated Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },
  gWarpOptions: {
    title: 'Generated Warp vs Apparent Speed',
    hAxis: {title: 'Generated Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },
  eWarpOptions: {
    title: 'Effective Warp vs Apparent Speed',
    hAxis: {title: 'Effective Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },
  wTypeOptions: {
    title: 'Effective Warp vs Apparent Speed',
    hAxis: {title: 'Delivered Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}, scaleType: 'log'},
    curveType: 'function',
    legend: { position: 'right' }
  },
  subLtOptions: {
    title: 'Warp vs Apparent Speed',
    hAxis: {title: 'Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: { position: 'right' }
  },
  wZeroOptions: {
    title: 'Warp vs Apparent Speed',
    hAxis: {title: 'Warp', viewWindow: {min: -5, max: 20}},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },
  // table getters
  get noDragTable() {
    var tableContent = '';
    for (val of this.noDrag) tableContent += "<TR><TD>" + val[0] + "</TD><TD>"
        + Math.round(val[1]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },
  get gWarpTable() {
    var tableContent = '';
    for (val of this.genWarp) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
        + val[1].toFixed(2) + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },
  get eWarpTable() {
    var tableContent = '';
    for (val of this.effWarp) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + this.checkInfin(val[1], 2)
        + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },
  get wTypesTable() {
    var tableContent = "";
    for (val of this.wTypes) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
          + val[1].toFixed(2) + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD><TD>"
          + Math.round(val[3]).toLocaleString() + "</TD><TD>" + Math.round(val[4]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },
  get subLightTable() {
    var tableContent = "";
    for (val of this.subLight) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + val[1].toFixed(3) + "</TD><TD>"
        + val[2].toFixed(3) + "</TD><TD>" + val[3].toFixed(3) + "</TD></TR>";
    return tableContent;
  },
  get wZeroTable() {
    var tableContent = "";
    for (val of this.wZero) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
        + val[1].toFixed(3) + "</TD></TR>";
    return tableContent;
  },
  maxCruise: 6,
  maxEmer: 8,
  get distThead1() {
    if (this.data.distW.length == 0) this.data.distW = [ this.genW2effW(this.maxCruise),
        this.genW2effW(this.maxEmer), this.genW2delW(this.maxCruise), this.genW2delW(this.maxEmer) ];
    return "<TH></TH><TH></TH><TH>&Wcirc;</TH><TH>" + this.data.distW[0].toFixed(2) + "</TH><TH>"
        + this.data.distW[1].toFixed(2) + "</TH><TH>W Del.</TH><TH>" + this.data.distW[2].toFixed(2)
        + "</TH><TH>" + this.data.distW[3].toFixed(2) + "</TH>";
  },
  get distThead2() {
    if (this.data.distSp.length == 0) this.data.distSp = [
        this.w2spd(this.data.distW[0], this.maxCruise, 3), this.w2spd(this.data.distW[1], this.maxEmer, 3),
        this.delW2spd(this.data.distW[2]), this.delW2spd(this.data.distW[3]) ];
    return "<TH></TH><TH></TH><TH>&Wcirc;&sup3;&AElig;<i>c</i></TH><TH>"
        + Math.round(this.data.distSp[0]).toLocaleString() + "</TH><TH>"
        + Math.round(this.data.distSp[1]).toLocaleString() + "</TH><TH>&Sum;&int;W&sup3;<i>c</i></TH><TH>"
        + Math.round(this.data.distSp[2]).toLocaleString() + "</TH><TH>"
        + Math.round(this.data.distSp[3]).toLocaleString() + "</TH>";
  },
  distances: [
    ["&alpha; Centauri", 4.37, "ly"],
    ["UFP Core", 7, "pc"],
    ["Rigel", 860, "ly"],
    ["Deneb", 2615, "ly"],
    ["Neut. Zones", 4750, "pc"],
    ["LMC", 163000, "ly"],
    ["Andromeda", 2500000, "ly"]
  ],
  get wTravTable() {
    var tableContent = "";
    for (val of this.distances) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + val[1].toLocaleString()
          + " " + val[2] + "</TD><TD></TD><TD>" + this.distToTime(this.data.distSp[0], val[1], val[2])
          + "</TD><TD>" + warpspeed.distToTime(this.data.distSp[1], val[1], val[2])
          + "</TD><TD></TD><TD>" + warpspeed.distToTime(this.data.distSp[2], val[1], val[2])
          + "</TD><TD>" + warpspeed.distToTime(this.data.distSp[3], val[1], val[2]) + "</TD></TR>";
    return tableContent;
  },
};

