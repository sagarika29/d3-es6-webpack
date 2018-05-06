"use strict";

import * as d3 from "d3";

import {forceLayout} from './forceLayout';
import {treeMap} from './treeMap';
import {adjacencyMatrix} from './adjacencyMatrix';
import {chordDiagram} from './chordDiagram';
import {nodeModel} from './nodeModel';
import {newForceLayout} from './newForceLayout';
import {newForceLayout2} from './newForceLayout2';
import {per2org} from './per2org';
//let svg = d3.select("body").append("svg").attr('width',1600).attr('height',800);

let svg = d3.select("svg")
const force_button = document.getElementById("force");
const adjacency_button = document.getElementById("adjacencyMatrix");
const chord_button = document.getElementById("chord");
const tree_button = document.getElementById("tree");
const node_button = document.getElementById("node");
const new_force_button = document.getElementById("newForce");
const new_force_button_2 = document.getElementById("newForce2");
const per2org_button = document.getElementById("per2org");

//Adjacency Matrix
adjacency_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',2500).attr('height',2250);
    adjacencyMatrix(svg);
});

//Tree Map
tree_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',900);
    treeMap(svg);
});

//Force Layout

force_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',900);
    forceLayout(svg);
});

//Chord Diagram
chord_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',900);
    chordDiagram(svg);
});

//New model
node_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',900);
    nodeModel(svg);
});

//New force demo
new_force_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',500).attr('height',500);
    newForceLayout(svg);
});

new_force_button_2.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',900);
    newForceLayout2(svg);
});

per2org_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    svg.attr('width',1200).attr('height',1100);
    per2org(svg);
});