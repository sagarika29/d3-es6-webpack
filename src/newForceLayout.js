import * as d3 from "d3";
import data from './data2';
import { color } from "d3";

export function newForceLayout(svg) {
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const canvas = {
        width: width - width/4,
        height: height
    };
    const radius = 30;
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    let links = [
        { source: 1, target: 3 },
        { source: 1, target: 2 },
        { source: 2, target: 3 }
    ];
    
    let simulation = d3.forceSimulation()
        .force("x", d3.forceX(0))
        .force("y", d3.forceY(0))
        .force("collide", d3.forceCollide())
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width/2,height/2))
        .force("link", d3.forceLink()
            .id(function (d) { return d.id; }));

    let link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(data).enter().append('g').attr('class', 'node');
    node.append('circle').attr('fill', d => color(d.age)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);

    const offset = (source, target, r) => {
        const dx = source.x - target.x;
        const dy = source.y - target.y;
        const factor = r / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return {
            x: dx * factor,
            y: dy * factor
        };
    };
    const ticked = () => {
        link.attr('x1', d => d.source.x - offset(d.source, d.target, radius).x).attr('y1', d => d.source.y - offset(d.source, d.target, radius).y).attr('x2', d => d.target.x - offset(d.target, d.source, radius).x).attr('y2', d => d.target.y - offset(d.target, d.source, radius).y);
        node.attr('transform', d => 'translate(' + [
            d.x = Math.max(radius + 3, Math.min(canvas.width - radius - 3, d.x)),
            d.y = Math.max(radius + 3, Math.min(canvas.height - radius - 3, d.y))
        ] + ')');
    };

    simulation.nodes(data).on("tick", ticked);
    simulation.force("link").links(links);
   
      
}