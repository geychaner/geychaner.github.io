function onClick(element) {
  document.getElementById("modalGraph").style.display = "block";
  var chart = new google.visualization.LineChart(document.getElementById('modalChart'));
  switch (element) {
    case "noDragGraph": chart.draw(warpspeed.noDragData, warpspeed.noDragOptions); break;
    case "gWarpGraph": chart.draw(warpspeed.gWarpData, warpspeed.gWarpOptions); break;
    case "dWarpGraph": chart.draw(warpspeed.dWarpData, warpspeed.dWarpOptions); break;
    case "wGenGraph": chart.draw(warpspeed.wGenData, warpspeed.wGenOptions); break;
    case "subCGraph": chart.draw(warpspeed.subCData, warpspeed.subCOptions); break;
    case "aEthGraph": chart.draw(warpspeed.aEthData, warpspeed.aEthOptions); break;
  }
}

function initCharts() {
  warpspeed.noDragData = new google.visualization.DataTable();
  warpspeed.noDragData.addColumn('number', 'W');
  warpspeed.noDragData.addColumn('number', 'Speed');
  for (val of warpspeed.noDrag) warpspeed.noDragData.addRow([val[0], val[1]]);
  warpspeed.gWarpData = new google.visualization.DataTable();
  warpspeed.gWarpData.addColumn('number', 'W');
  warpspeed.gWarpData.addColumn('number', 'Speed');
  for (val of warpspeed.gWarp) if (isFinite(val[0])) warpspeed.gWarpData.addRow([val[0], val[2]]);
  warpspeed.dWarpData = new google.visualization.DataTable();
  warpspeed.dWarpData.addColumn('number', 'W');
  warpspeed.dWarpData.addColumn('number', 'Speed');
  for (val of warpspeed.dWarp) if (isFinite(val[1])) warpspeed.dWarpData.addRow([val[0], val[2]]);
  warpspeed.wGenData = new google.visualization.DataTable();
  warpspeed.wGenData.addColumn('number', 'W');
  warpspeed.wGenData.addColumn('number', '\u0174\u00B3');
  warpspeed.wGenData.addColumn('number', '\u0174\u00B2');
  warpspeed.wGenData.addColumn('number', '\u0174');
  for (val of warpspeed.wGen) if (isFinite(val[0])) warpspeed.wGenData.addRow([val[1], val[2], val[3], val[4]]);
  warpspeed.subCData = new google.visualization.DataTable();
  warpspeed.subCData.addColumn('number', 'W');
  warpspeed.subCData.addColumn('number', 'W\u00B3');
  warpspeed.subCData.addColumn('number', 'W\u00B2');
  warpspeed.subCData.addColumn('number', 'W');
  for (val of warpspeed.subC) warpspeed.subCData.addRow([val[0], val[1], val[2], val[3]]);
  warpspeed.aEthData = new google.visualization.DataTable();
  warpspeed.aEthData.addColumn('number', 'W');
  warpspeed.aEthData.addColumn('number', '\u00C6');
  for (val of warpspeed.aEth) if (isFinite(val[0])) warpspeed.aEthData.addRow([val[0], val[1]]);
}

const warpspeed = {
  noDrag: [],
  gWarp: [],
  dWarp: [],
  wGen: [],
  subC: [],
  aEth: [],
  distW: [],
  distSp: [],
  noDragData: null,
  gWarpData: null,
  dWarpData: null,
  wGenData: null,
  aEthData: null,
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
  dWarpOptions: {
    title: 'Delivered Warp vs Apparent Speed',
    hAxis: {title: 'Delivered Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },
  wGenOptions: {
    title: 'Delivered Warp vs Apparent Speed',
    hAxis: {title: 'Delivered Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}, scaleType: 'log'},
    curveType: 'function',
    legend: { position: 'right' }
  },
  subCOptions: {
    title: 'Warp vs Apparent Speed',
    hAxis: {title: 'Warp'},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: { position: 'right' }
  },
  aEthOptions: {
    title: 'Warp vs Apparent Speed',
    hAxis: {title: 'Warp', viewWindow: {min: -5, max: 20}},
    vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
    curveType: 'function',
    legend: 'none'
  },

  initTables: function() {
    for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30])
        this.noDrag.push([w, w**3*this.aether(w)]);
    for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
      var dw = this.gWtodW(w);
      this.gWarp.push([w, dw, dw**3*this.aether(w)]);
    }
    for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5, 9.9, 9.99, 9.999, 10]) {
      var gw = this.dWtogW(w);
      this.dWarp.push([w, gw, w**3*this.aether(gw)]);
    }
    for (w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
      var dw = this.gWtodW(w);
      this.wGen.push([w, dw, dw**3*this.aether(w), dw**2*this.aether(w), dw*this.aether(w)]);
    }
    for (w of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 0.999, 1, 1.001, 1.01, 1.1]) {
      var dw = this.gWtodW(w);
      this.subC.push([w, dw**3*this.aether(w), dw**2*this.aether(w), dw*this.aether(w)]);
    }
    for (w of [-Infinity, -5, -1, -0.5, 0, 0.5, 1, 2, 4, 7, 10, 20, Infinity]) {
      this.aEth.push([w, this.aether(w)]);
    }
    this.distW = [ this.gWtodW(6), this.gWtodW(8), this.wTolmW(6), this.wTolmW(8) ];
    this.distSp = [ this.distW[0]**3*this.aether(6), this.distW[1]**3*this.aether(8),
              this.wToLMv(this.distW[2]), this.wToLMv(this.distW[3]) ];
  },

  aether: function(w) {
    return isFinite(w) ? Math.E**(6*Math.tanh((w-1)/3)) : (w < 0 ? Math.E**(-6) : Math.E**(6));
  },

  gWtodW: function(w) {
    return isFinite(w) ? 10*Math.tanh(w*Math.atanh(1/10)) : 10;
  },

  dWtogW: function(w) {
    return Math.atanh(w/10)/Math.atanh(1/10);
  },

  wTolmW: function(w) {
    var a = Math.tan(3*Math.PI/8);
    var s = 1 - (Math.sqrt(2)-1) * 9 / 2 + (Math.sqrt(2)+1) * 40 / 9;
    return 10-(a/((w-s)+Math.sqrt(a**2+(w-s)**2-1)));
  },

  wToLMv: function(w) {
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

  noDragTable: function() {
    var tableContent = '';
    for (val of this.noDrag) tableContent += "<TR><TD>" + val[0] + "</TD><TD>"
        + Math.round(val[1]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },

  gWarpTable: function() {
    var tableContent = '';
    for (val of this.gWarp) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
        + val[1].toFixed(2) + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },

  dWarpTable: function() {
    var tableContent = '';
    for (val of this.dWarp) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + this.checkInfin(val[1], 2)
        + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },

  wGenTable: function() {
    var tableContent = "";
    for (val of this.wGen) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
          + val[1].toFixed(2) + "</TD><TD>" + Math.round(val[2]).toLocaleString() + "</TD><TD>"
          + Math.round(val[3]).toLocaleString() + "</TD><TD>" + Math.round(val[4]).toLocaleString() + "</TD></TR>";
    return tableContent;
  },

  subcTable: function() {
    var tableContent = "";
    for (val of this.subC) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + val[1].toFixed(3) + "</TD><TD>"
        + val[2].toFixed(3) + "</TD><TD>" + val[3].toFixed(3) + "</TD></TR>";
    return tableContent;
  },

  aEthTable: function() {
    var tableContent = "";
    for (val of this.aEth) tableContent += "<TR><TD>" + this.checkInfin(val[0], null) + "</TD><TD>"
        + val[1].toFixed(3) + "</TD></TR>";
    return tableContent;
  },

  distTable1: function() {
    return "<TH></TH><TH></TH><TH>&Wcirc;</TH><TH>" + this.distW[0].toFixed(2) + "</TH><TH>"
        + this.distW[1].toFixed(2) + "</TH><TH>W Del.</TH><TH>" + this.distW[2].toFixed(2)
        + "</TH><TH>" + this.distW[3].toFixed(2) + "</TH>"
  },

  distTable2: function() {
    return "<TH></TH><TH></TH><TH>&Wcirc;&sup3;&AElig;<i>c</i></TH><TH>"
        + Math.round(this.distSp[0]).toLocaleString() + "</TH><TH>"
        + Math.round(this.distSp[1]).toLocaleString() + "</TH><TH>&Sum;&int;W&sup3;<i>c</i></TH><TH>"
        + Math.round(this.distSp[2]).toLocaleString() + "</TH><TH>"
        + Math.round(this.distSp[3]).toLocaleString() + "</TH>"
  },

  wTravTable: function() {
    var distances = [
      ["&alpha; Centauri", 4.37, "ly"],
      ["UFP Core", 7, "pc"],
      ["Rigel", 860, "ly"],
      ["Deneb", 2615, "ly"],
      ["Neut. Zones", 4750, "pc"],
      ["LMC", 163000, "ly"],
      ["Andromeda", 2500000, "ly"]
    ];
    var tableContent = "";
    for (val of distances) tableContent += "<TR><TD>" + val[0] + "</TD><TD>" + val[1].toLocaleString()
          + " " + val[2] + "</TD><TD></TD><TD>" + this.distToTime(this.distSp[0], val[1], val[2])
          + "</TD><TD>" + warpspeed.distToTime(this.distSp[1], val[1], val[2])
          + "</TD><TD></TD><TD>" + warpspeed.distToTime(this.distSp[2], val[1], val[2])
          + "</TD><TD>" + warpspeed.distToTime(this.distSp[3], val[1], val[2]) + "</TD></TR>";
    return tableContent;
  },
};

