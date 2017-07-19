"use strict";

import * as d3 from "d3";

// set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


let svg = d3.select("body").append("svg");

let container =  svg .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

container.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 20);