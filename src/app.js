"use strict";

import * as d3 from "d3";

import {forceLayout} from './forceLayout';
import {treeMap} from './treeMap';
import {adjacencyMatrix} from './adjacencyMatrix';
import {chordDiagram} from './chordDiagram';
//let svg = d3.select("body").append("svg").attr('width',1600).attr('height',800);

let svg = d3.select("svg")
const force_button = document.getElementById("force");
const adjacency_button = document.getElementById("adjacencyMatrix");
const chord_button = document.getElementById("chord");
const tree_button = document.getElementById("tree");

//Adjacency Matrix
adjacency_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
     adjacencyMatrix(svg);
});

//Tree Map
tree_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    treeMap(svg);
});

//Force Layout

force_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    forceLayout(svg);
});

//Chord Diagram
chord_button.addEventListener("click", () => {
    svg.selectAll('*').remove();
    chordDiagram(svg);
});
