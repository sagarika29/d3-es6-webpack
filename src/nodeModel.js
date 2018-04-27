import * as d3 from "d3";
import data from './data2';
import { color } from "d3";

export function nodeModel(svg){
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    
    const nodes =[
        {x : width/12,y : height/9}, //100,100
        {x : width/6,y : height/4 - 25}, //200,200
        {x : width/4,y : height/9} //300,100
    ]

    const modelData = data.map((item,i)=>Object.assign({}, {
        id: item.id,
        age: item.age,
        x: nodes[i].x,
        y: nodes[i].y,
    }));
   
    const radius = 30;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(modelData).enter().append('g').attr('class', 'node');
    node.append('circle').attr('fill', d => color(d.age)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', (d)=> {return d.x}).attr('cy', (d)=> {return d.y}).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
}