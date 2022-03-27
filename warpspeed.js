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
    let a = Math.tan(3*Math.PI/8);
    let s = 1 - (Math.sqrt(2)-1) * 9 / 2 + (Math.sqrt(2)+1) * 40 / 9;
    return 10-(a/((w-s)+Math.sqrt(a**2+(w-s)**2-1)));
  },
  delW2spd: function(w) {
    return 6*(Math.E**w-(w**2/2+w+1));
  },
  distToTime: function(v, d, u) {
    let time = d/v * (u == "pc" ? 3.26156: 1);
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
      for (let w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30]) this.data.noDrag.push([w, w**3*this.aether(w)]);
    }
    return this.data.noDrag;
  },
  get genWarp() {
    if (this.data.gWarp.length == 0) {
      for (let w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
        let ew = this.genW2effW(w);
        this.data.gWarp.push([w, ew, this.w2spd(w, ew, 3)]);
      }
    }
    return this.data.gWarp;
  },
  get effWarp() {
    if (this.data.fWarp.length == 0) {
      for (let w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5, 9.9, 9.99, 9.999, 10]) {
        let gw = this.effW2genW(w);
        this.data.fWarp.push([w, gw, this.w2spd(gw, w, 3)]);
      }
    }
    return this.data.fWarp;
  },
  get wTypes() {
    if (this.data.wTypes.length == 0) {
      for (let w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, Infinity]) {
        let ew = this.genW2effW(w);
        this.data.wTypes.push([w, ew, this.w2spd(w, ew, 3), this.w2spd(w, ew, 2), this.w2spd(w, ew, 1)]);
      }
    }
    return this.data.wTypes;
  },
  get subLight() {
    if (this.data.subLt.length == 0) {
      for (let w of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 0.999, 1, 1.001, 1.01, 1.1]) {
        let ew = this.genW2effW(w);
        this.data.subLt.push([w, this.w2spd(w, ew, 3), this.w2spd(w, ew, 2), this.w2spd(w, ew, 1)]);
      }
    }
    return this.data.subLt;
  },
  get wZero() {
    if (this.data.wZero.length == 0) {
      for (let w of [-Infinity, -5, -1, -0.5, 0, 0.5, 1, 2, 4, 7, 10, 20, Infinity])
          this.data.wZero.push([w, this.aether(w)]);
    }
    return this.data.wZero;
  },
  maxCruise: 6,
  maxEmer: 8,
  get distW() {
    if (this.data.distW.length == 0) this.data.distW = [
        this.genW2effW(this.maxCruise), this.genW2effW(this.maxEmer),
        this.genW2delW(this.maxCruise), this.genW2delW(this.maxEmer) ];
    return this.data.distW;
  },
  get distSp() {
    if (this.data.distSp.length == 0) this.data.distSp = [
        this.w2spd(this.data.distW[0], this.maxCruise, 3), this.w2spd(this.data.distW[1], this.maxEmer, 3),
        this.delW2spd(this.data.distW[2]),                 this.delW2spd(this.data.distW[3]) ];
    return this.data.distSp;
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
  // Graph data
  graphData: {
    noDrag: null,
    gWarp: null,
    eWarp: null,
    wType: null,
    subLt: null,
    wZero: null
  },
  graphOptions: {
    noDrag: {
      title: 'Generated Warp vs Apparent Speed',
      hAxis: {title: 'Generated Warp'},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
      curveType: 'function',
      legend: 'none'
    },
    gWarp: {
      title: 'Generated Warp vs Apparent Speed',
      hAxis: {title: 'Generated Warp'},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
      curveType: 'function',
      legend: 'none'
    },
    eWarp: {
      title: 'Effective Warp vs Apparent Speed',
      hAxis: {title: 'Effective Warp'},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
      curveType: 'function',
      legend: 'none'
    },
    wType: {
      title: 'Effective Warp vs Apparent Speed',
      hAxis: {title: 'Delivered Warp'},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}, scaleType: 'log'},
      curveType: 'function',
      legend: { position: 'right' }
    },
    subLt: {
      title: 'Warp vs Apparent Speed',
      hAxis: {title: 'Warp'},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
      curveType: 'function',
      legend: { position: 'right' }
    },
    wZero: {
      title: 'Warp vs Apparent Speed',
      hAxis: {title: 'Warp', viewWindow: {min: -5, max: 20}},
      vAxis: {title: 'Apparent Speed \u00D7c', format: 'short', viewWindow: {min: 0}},
      curveType: 'function',
      legend: 'none'
    }
  },
  initCharts: function() {
    // Build all the chart data
    warpspeed.graphData.noDrag = new google.visualization.DataTable();
    warpspeed.graphData.noDrag.addColumn('number', 'W');
    warpspeed.graphData.noDrag.addColumn('number', 'Speed');
    for (let val of warpspeed.noDrag) warpspeed.graphData.noDrag.addRow([val[0], val[1]]);
    warpspeed.graphData.gWarp = new google.visualization.DataTable();
    warpspeed.graphData.gWarp.addColumn('number', 'W');
    warpspeed.graphData.gWarp.addColumn('number', 'Speed');
    for (let val of warpspeed.genWarp) if (isFinite(val[0])) warpspeed.graphData.gWarp.addRow([val[0], val[2]]);
    warpspeed.graphData.eWarp = new google.visualization.DataTable();
    warpspeed.graphData.eWarp.addColumn('number', 'W');
    warpspeed.graphData.eWarp.addColumn('number', 'Speed');
    for (let val of warpspeed.effWarp) if (isFinite(val[1])) warpspeed.graphData.eWarp.addRow([val[0], val[2]]);
    warpspeed.graphData.wType = new google.visualization.DataTable();
    warpspeed.graphData.wType.addColumn('number', 'W');
    warpspeed.graphData.wType.addColumn('number', '\u0174\u00B3');
    warpspeed.graphData.wType.addColumn('number', '\u0174\u00B2');
    warpspeed.graphData.wType.addColumn('number', '\u0174');
    for (let val of warpspeed.wTypes) if (isFinite(val[0])) warpspeed.graphData.wType.addRow([val[1], val[2], val[3], val[4]]);
    warpspeed.graphData.subLt = new google.visualization.DataTable();
    warpspeed.graphData.subLt.addColumn('number', 'W');
    warpspeed.graphData.subLt.addColumn('number', 'W\u00B3');
    warpspeed.graphData.subLt.addColumn('number', 'W\u00B2');
    warpspeed.graphData.subLt.addColumn('number', 'W');
    for (let val of warpspeed.subLight) warpspeed.graphData.subLt.addRow([val[0], val[1], val[2], val[3]]);
    warpspeed.graphData.wZero = new google.visualization.DataTable();
    warpspeed.graphData.wZero.addColumn('number', 'W');
    warpspeed.graphData.wZero.addColumn('number', '\u00C6');
    for (let val of warpspeed.wZero) if (isFinite(val[0])) warpspeed.graphData.wZero.addRow([val[0], val[1]]);
    // This sets up the onClick and cursor on each of the tables
    for (let t in warpspeed.graphData) {
      let e = document.getElementById(t);
      e.style.cursor = "zoom-in";
      e.onclick = warpspeed.onClick;
    }
  },
  onClick: function() {
    document.getElementById("modalGraph").style.display = "block";
    let chart = new google.visualization.LineChart(document.getElementById('modalChart'));
    chart.draw(warpspeed.graphData[this.id], warpspeed.graphOptions[this.id]);
  },
  // table creators
  tableFunctions: {
    noDrag: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.noDrag) {
        let row = tableBody.insertRow();
        for (let c of [ val[0], Math.round(val[1]).toLocaleString() ])
            row.insertCell().innerHTML = c;
      }
    },
    gWarp: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.genWarp) {
        let row = tableBody.insertRow();
        for (let c of [ warpspeed.checkInfin(val[0], null), val[1].toFixed(2), Math.round(val[2]).toLocaleString() ])
            row.insertCell().innerHTML = c;
      }
    },
    eWarp: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.effWarp) {
        let row = tableBody.insertRow();
        for (let c of [ val[0], warpspeed.checkInfin(val[1], 2), Math.round(val[2]).toLocaleString() ])
            row.insertCell().innerHTML = c;
      }
    },
    wType: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.wTypes) {
        let row = tableBody.insertRow();
        for (let c of [ warpspeed.checkInfin(val[0], null), val[1].toFixed(2), Math.round(val[2]).toLocaleString(),
                    Math.round(val[3]).toLocaleString(), Math.round(val[4]).toLocaleString() ])
            row.insertCell().innerHTML = c;
      }
    },
    subLt: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.subLight) {
        let row = tableBody.insertRow();
        for (let c of [ val[0], val[1].toFixed(3), val[2].toFixed(3), val[3].toFixed(3) ])
            row.insertCell().innerHTML = c;
      }
    },
    wZero: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.wZero) {
        let row = tableBody.insertRow();
        for (let c of [ warpspeed.checkInfin(val[0], null), val[1].toFixed(3) ])
            row.insertCell().innerHTML = c;
      }
    },
    wTravHead: function(id) {
      let tableHead = document.getElementById(id);
      for (let rowData of [
          ["", "", "W", warpspeed.maxCruise, warpspeed.maxEmer, "W Gen.",  warpspeed.maxCruise, warpspeed.maxEmer ],
          ["", "", "&Wcirc;", warpspeed.distW[0].toFixed(2), warpspeed.distW[1].toFixed(2),
                   "W Del.",  warpspeed.distW[2].toFixed(2), warpspeed.distW[3].toFixed(2) ],
          ["", "", "&Wcirc;&sup3;&AElig;<i>c</i>",
            Math.round(warpspeed.distSp[0]).toLocaleString(), Math.round(warpspeed.distSp[1]).toLocaleString(),
                   "&Sum;&int;W&sup3;<i>c</i>",
            Math.round(warpspeed.distSp[2]).toLocaleString(), Math.round(warpspeed.distSp[3]).toLocaleString() ] ]) {
        let row = tableHead.insertRow();
        row.classList.add("w3-light-blue");
        for (let e of rowData) {
          let th = document.createElement("th");
          th.innerHTML = e;
          row.appendChild(th);
        }
      }
    },
    wTrav: function(id) {
      let tableBody = document.getElementById(id);
      for (let val of warpspeed.distances) {
        let row = tableBody.insertRow();
        for (let e of [ val[0], val[1].toLocaleString() + " " + val[2], "",
            warpspeed.distToTime(warpspeed.distSp[0], val[1], val[2]),
            warpspeed.distToTime(warpspeed.distSp[1], val[1], val[2]), "",
            warpspeed.distToTime(warpspeed.distSp[2], val[1], val[2]),
            warpspeed.distToTime(warpspeed.distSp[3], val[1], val[2]) ]) {
          row.insertCell().innerHTML = e;
        }
      }
    }
  },
  loadAllTables: function() {
    for (let t in this.tableFunctions) this.tableFunctions[t](t);
  }
};

