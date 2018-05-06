import * as d3 from "d3";
import data from './data';

export function newForceLayout2(svg) {
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const canvas = {
        width: width ,
        height: height
    };

    const nodes = data[data.map(item => item.name).indexOf('Organizations')].values;
    const relations = data[data.map(item => item.name).indexOf('Relations')].values.filter(link =>link.source && link.source.id !== null && link.target && link.target.id !== null); // Null check in data of relations
   
    let links = relations.map(relation => Object.assign({}, {
        data: relation,
        source: relation.source.id,
        target: relation.target.id,
    }));

    let relation_nodes = [];
    relations.filter((relation) => {
        relation_nodes.push(relation.source.id, relation.target.id);
    });
    let relation_node = (relation => {
        return relation.filter((x, i) => {
            if (relation.indexOf(x) === i) {
                return relation;
            }
        })
    })
    let final = [];
    nodes.filter(node => {
        if (relation_node(relation_nodes).includes(node.id))
            final.push(node);
    });
    let simulation = d3.forceSimulation()
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force("collide", d3.forceCollide().radius(radius + 30))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width/2,height/2))
    .force('link', d3.forceLink().id(d => d.id));

    let link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(final).enter().append('g').attr('class', 'node');
    
    const radius = 20;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    node.append('circle').attr('fill', d => color(d.category)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
    
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
    simulation.nodes(nodes).on('tick', ticked);
    simulation.force('link').links(links);
    
}