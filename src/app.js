"use strict";

import * as d3 from "d3";

import data from './data';

//let svg = d3.select("body").append("svg").attr('width',1600).attr('height',800);

let svg = d3.select("body").append("svg").attr('width',1200).attr('height',900);

//Adjacency Matrix
/*
const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
const relations = data[data.map(item => item.name).indexOf('Relations')].values;
const categories = [...new Set(relations.map(r => r.category))];
const length = organizations.length;
let matrix = [...Array(length).keys()].map((el, index) => [...Array(length).keys()].map(item => Object.assign({}, {
    x: index,
    y: item
})));
const color = d3.scaleOrdinal().range(d3.schemeCategory10.map(c => {
    c = d3.rgb(c);
    c.opacity = 0.6;
    return c;
}));
const getRelationFromPoint = (x, y) => {
    const source = organizations[x].id;
    const target = organizations[y].id;
    if (source === target)
        return '#e1e1e1';
    let source2TargetRelations = relations.filter(relation => source === relation.source.id).filter(relation => target === relation.target.id);
    if (source2TargetRelations.length === 1) {
        return color(source2TargetRelations[0].category);
    }
    let target2SourceRelations = relations.filter(relation => source === relation.target.id).filter(relation => target === relation.source.id);
    if (target2SourceRelations.length === 1)
        return color(target2SourceRelations[0].category);
    return '#f0f0f0';
};
const rectWidth = 12;
const offset = 70;
const gHLegend = svg.append('g').attr('transform', `translate(${ offset },${ offset })`);
const textHLegend = gHLegend.selectAll('text').data(organizations).enter().append('text').text(d => d.abbreviation).attr('font-size', '10px').attr('dy', 8).attr('dx', 6).attr('transform', (d, i) => 'translate(' + i * rectWidth + ')rotate(-90)').on('click', d => {
    window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.id }`;
});
const gVLegend = svg.append('g').attr('transform', `translate(${ offset },${ offset })`);
const textVLegend = gVLegend.selectAll('text').data(organizations).enter().append('text').text(d => d.abbreviation).attr('y', (d, i) => i * rectWidth + 8).attr('font-size', '10px').attr('text-anchor', 'end').attr('x', -6).on('click', d => {
    window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.id }`;
});
const gMatrix = svg.append('g').attr('transform', `translate(${ offset },${ offset })`);
const gRows = gMatrix.selectAll('g').data(matrix).enter().append('g').attr('transform', (d, i) => `translate(${ 0 },${ i * rectWidth })`).attr('class', 'row');
const gColumns = gRows.selectAll('g').data((d, i) => matrix[i]).enter().append('g').attr('transform', (d, i) => `translate(${ i * rectWidth },${ 0 })`).attr('class', 'column').on('mouseover', (d, i) => {
    const activeEl = d;
    gMatrix.selectAll('.column').attr('fill-opacity', d => activeEl.y === d.y || activeEl.x === d.x ? 0.6 : 1);
    gVLegend.selectAll('text').attr('font-weight', (d, i) => activeEl.x === i ? 'bold' : 'normal');
    gHLegend.selectAll('text').attr('font-weight', (d, i) => activeEl.y === i ? 'bold' : 'normal');
}).on('mouseout', (d, i) => {
    gMatrix.selectAll('.column').attr('fill-opacity', 1);
    textHLegend.selectAll('text').attr('font-weight', 'normal');
    textVLegend.selectAll('text').attr('font-weight', 'normal');
});
const rect = gColumns.append('rect').attr('height', rectWidth - 1).attr('width', rectWidth - 1).attr('fill', d => getRelationFromPoint(d.x, d.y)).attr('stroke-width', 0.1).attr('stroke', 'black');
const legend = svg.append('g').attr('class', 'options').attr('transform', 'translate(' + [
    offset + rectWidth * length + 50,
    height / 4
] + ')').selectAll('g.legend').data(categories).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
    0,
    index * 30 + 5
] + ')');
legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px');*/

//Tree Map
/*
const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
const relations = data[data.map(item => item.name).indexOf('Relations')].values;
let categories = organizations.reduce((_categories, organization) => {
    const categoryIndex = _categories.map(c => c.name).indexOf(organization.category);
    organization = Object.assign(organization, { size: 10 });
    if (categoryIndex < 0) {
        _categories.push({
            name: organization.category,
            children: [organization]
        });
    } else {
        _categories[categoryIndex].children.push(organization);
    }
    return _categories;
}, []);
const color = d3.scaleOrdinal().range(d3.schemeCategory20.map(function (c) {
    c = d3.rgb(c);
    c.opacity = 0.7;
    return c;
}));
const treemap = d3.treemap().size([
    width,
    height
]).padding(7).round(true);
let root = d3.hierarchy({
    name: 'categories',
    children: categories
});
let nodes = treemap(root.sum(d => d.size).sort((a, b) => b.height - a.height));
const gNode = svg.selectAll('.node').data(root.leaves()).enter().append('g').attr('class', 'node').attr('transform', d => `translate(${ [
    d.x0,
    d.y0
] })`).on('mouseover', (d, i, gNodes) => {
    let el = d3.select(gNodes[i]);
    el.select('rect').attr('stroke-opacity', 0.2).attr('fill-opacity', 0.7);
    el.select('text').attr('font-size', '14px').attr('font-weight', 'bold');
    d3.event.stopPropagation();
}).on('mouseout', (d, i, gNodes) => {
    let el = d3.select(gNodes[i]);
    el.select('rect').attr('stroke-opacity', 1).attr('fill-opacity', 1);
    el.select('text').attr('font-size', '12px').attr('font-weight', 'normal');
    d3.event.stopPropagation();
}).on('click', d => {
    window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.data.id }`;
});
gNode.append('rect').attr('width', d => d.x1 - d.x0).attr('height', d => d.y1 - d.y0).attr('fill', d => color(d.data.category));
gNode.append('text').text(d => d.data.abbreviation).attr('dx', 5).attr('dy', 20).attr('font-size', '12px').attr('text-anchor', 'center');
const category = svg.selectAll('.category').data(root.descendants().filter(n => n.depth === 1)).enter().append('g').attr('class', 'category').attr('transform', d => `translate(${ [
    d.x0,
    d.y0
] })`);
category.append('text').text(d => d.data.name).attr('dx', 10).attr('dy', 5).attr('font-size', '14px');
*/

//Force Layout


const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const legendWidth = 200;
const canvas = {
    width: width - legendWidth,
    height: height
};
const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
const relations = data[data.map(item => item.name).indexOf('Relations')].values.filter(link => link.source.id !== null && link.target.id !== null); // Null check in data of relations
const categories = [...new Set(organizations.map(o => o.category))];
let nodes = [...organizations];
let links = relations.map(relation => Object.assign({}, {
    data: relation,
    source: relation.source.id,
    target: relation.target.id,
}));
let relation_nodes=[];
relations.filter(function(relation) {
     relation_nodes.push(relation.source.id,relation.target.id);
});
let relation_node=(relation => {
    return relation.filter((x, i) =>{
      if(relation.indexOf(x) === i) {
        return relation;
     }
    })
  })
let final=[];
nodes.filter(node=>{
    if(relation_node(relation_nodes).includes(node.id))
     final.push(node);
});
console.log(relation_node(relation_nodes));
console.log(final);
const radius = 20;
const color = d3.scaleOrdinal(d3.schemeCategory20);
let simulation = d3.forceSimulation().force('link', d3.forceLink().id(d => d.id)).force('charge', d3.forceManyBody().strength(-1000)).force('collide', d3.forceCollide().radius(radius + 20)).force('x', d3.forceX()).force('y', d3.forceY()).force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2));
let link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line').attr('class', 'link').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(final).enter().append('g').attr('class', 'node').on('mouseover', d => {
    const activeNode = d;
    const activeNodeLinks = relations.reduce((links, link) => {
        if (link.source.id === activeNode.id)
            links.push(link.target.id);
        if (link.target.id === activeNode.id)
            links.push(link.source.id);
        return links;
    }, [activeNode.id]);
    svg.selectAll('.node > circle').attr('stroke-opacity', d => activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.2).attr('fill-opacity', d => activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.5).attr('r', d => d === activeNode ? radius + 15 : radius);
    svg.selectAll('.node > text').attr('font-size', d => d === activeNode ? '12px' : '9px');
    svg.selectAll('.link').transition().attr('stroke-width', d => d.source === activeNode || d.target === activeNode ? 4 : 2).attr('stroke-opacity', d => d.source === activeNode || d.target === activeNode ? 1 : 0.2);
    d3.event.stopPropagation();
}).on('mouseout', d => {
    svg.selectAll('.node > circle').attr('stroke-opacity', 0.2).attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('r', radius);
    svg.selectAll('.node > text').attr('font-size', '9px');
    svg.selectAll('.link').transition().attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    d3.event.stopPropagation();
}).on('click', d => {
    window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.id }`;
});

node.append('circle').attr('fill', d => color(d.category)).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
node.append('text').text(d => d.abbreviation).attr('text-anchor', 'middle').attr('font-size', '9px');

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
svg.append('line').attr('x1', width - legendWidth + 5).attr('y1', 0).attr('x2', width - legendWidth + 5).attr('y2', height).attr('stroke-width', 2).attr('stroke', '#000000');
const legend = svg.append('g').attr('class', 'options').attr('transform', 'translate(' + [
    width - legendWidth + 10,
    0
] + ')').selectAll('g.legend').data(categories).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
    0,
    index * 30 + 5
] + ')').on('mouseover', (d, i, elem) => {
    const activeLegendItem = d;
    const activeNodes = nodes.filter(node => node.category === activeLegendItem).map(node => node.id);
    d3.select(elem[i]).select('text').attr('font-size', '10px').attr('font-weight', 'bold');
    svg.selectAll('.node > circle').attr('stroke-opacity', d => activeNodes.indexOf(d.id) > -1 ? 1 : 0.2).attr('fill-opacity', d => activeNodes.indexOf(d.id) > -1 ? 1 : 0.5);
    d3.event.stopPropagation();
}).on('mouseout', (d, i, elem) => {
    d3.select(elem[i]).select('text').attr('font-weight', 'normal').attr('font-size', '9px');
    svg.selectAll('.node > circle').attr('stroke-opacity', 0.2).attr('fill-opacity', 0.5);
    d3.event.stopPropagation();
});
legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '9px');

//Chord Diagram

//
// const getNodeById = (nodes, id) => {
//     return nodes[nodes.map(x => x.data.id).indexOf(id)];
// };
// const project = (x, y) => {
//     let angle = (x - 90) / 180 * Math.PI, radius = y;
//     return [
//         radius * Math.cos(angle),
//         radius * Math.sin(angle)
//     ];
// };
// const projectX = (x, y) => {
//     let angle = (x - 90) / 180 * Math.PI, radius = y;
//     return radius * Math.cos(angle);
// };
// const projectY = (x, y) => {
//     let angle = (x - 90) / 180 * Math.PI, radius = y;
//     return radius * Math.sin(angle); // changed -> radius * Math.sin(angle) - 60
// };
// let relations = data[data.map(item => item.name).indexOf('Relations')].values;
// let organizations = data[data.map(item => item.name).indexOf('Organizations')].values.map(organization => Object.assign(organization, { size: 30 }));
// let services = organizations.reduce((categories, organization) => {
//     if (Object.keys(categories).indexOf(organization.category) > -1) {
//         categories[organization.category].children.push(organization);
//     } else {
//         categories[organization.category] = {
//             name: organization.category,
//             children: [organization]
//         };
//     }
//     return categories;
// }, {});
// const categories = [...new Set(relations.map(o => o.category))];
// let color = d3.scaleOrdinal().range(d3.schemeCategory10.map(c => {
//     c = d3.rgb(c);
//     c.opacity = 0.6;
//     return c;
// }));
// const legendWidth = 200;
// const svgWidth = parseFloat(svg.attr('width'));
// const svgHeight = parseFloat(svg.attr('height'));
// const canvas = {
//     width: svgWidth, //svgWidth - legendWidth
//     height: svgHeight
// };
// let width = canvas.width, height = canvas.height;
// let root = d3.hierarchy({
//     name: 'services',
//     children: Object.values(services)
// });
// let cluster = d3.cluster().size([
//     360,
//     width / 2 - 265
// ]);
// cluster(root);
// let circle = svg.append('circle').attr('cx', width / 2).attr('cy', height / 2).attr('r', width / 2 - 265).attr('fill', '#F0F0F0');//height / 2 - 60 -> height / 2
// let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
// let nodes = root.descendants().filter(n => !n.children);
// let node = g.selectAll('.node').data(nodes).enter().append('g').attr('transform', d => 'translate(' + project(d.x, d.y) + ')');
// node.append('circle').attr('r', 2.5);
// let text = node.append('text').attr('class', 'text').attr('dy', '0.31em').attr('x', d => d.x < 180 ? 6 : -6).style('text-anchor', d => d.x < 180 ? 'start' : 'end').attr('font-family', 'sans-serif').attr('font-size', '10px').attr('transform', d => 'rotate(' + (d.x < 180 ? d.x - 90 : d.x + 90) + ')').text(d => d.data.abbreviation).on('click', d => {
//     d3.event.stopPropagation();
// }).on('mouseover', (d, i, elem) => {
//     let id = d.data.id;
//     d3.select(elem[i]).attr('font-size', '12px').attr('font-weight', 'bold');
//     g.selectAll('.link').transition().attr('stroke-width', d => {
//         if (d.source.id === id) {
//             let targetIndex = elem.map(x => x['__data__']['data'].id).indexOf(d.target.id);
//             d3.select(elem[targetIndex]).attr('font-size', '12px').attr('font-weight', 'bold');
//             return 4;
//         }
//         if (d.target.id === id) {
//             let sourceIndex = elem.map(x => x['__data__']['data'].id).indexOf(d.source.id);
//             d3.select(elem[sourceIndex]).attr('font-size', '12px').attr('font-weight', 'bold');
//             return 4;
//         }
//         return 2;
//     }).style('stroke-opacity', d => {
//         if (d.source.id === id || d.target.id === id) {
//             return 1;
//         }
//         return 0.1;
//     });
//     d3.event.stopPropagation();
// }).on('mouseout', (d, i, elem) => {
//     g.selectAll('.link').transition().attr('stroke-width', 2).style('stroke-opacity', 1);
//     g.selectAll('.text').attr('font-size', '10px').attr('font-weight', 'normal');
//     d3.event.stopPropagation();
// }).on('click', d => {
//     window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.data.id }`;
// });
// relations = relations.filter(link => link.source.id !== null && link.target.id !== null); // Null check in data of relations
// const line = d3.line().x(d => projectX(d.x, d.y)).y(d => projectY(d.x, d.y)).curve(d3.curveBundle.beta(0.45));
// let edges = g.selectAll('.link').data(relations).enter();
// edges.append('path').attr('class', 'link').attr('d', d => {
//     let source = getNodeById(nodes, d.source.id);
//     let target = getNodeById(nodes, d.target.id);
//     return line(source.path(target));
// }).attr('stroke', d => color(d.category)).attr('stroke-width', 0.3).attr('fill', 'none').attr('pointer-events', 'none');
// const legend = svg.append('g').attr('class', 'options').attr('transform', 'translate(' + [
//     width - legendWidth + 100,
//     height / 4
// ] + ')').selectAll('g.legend').data(categories).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
//     0,
//     index * 30 + 5
// ] + ')');
// legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
// legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px');
//
//
