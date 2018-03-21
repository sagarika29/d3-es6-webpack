'use strict';

import * as d3 from 'd3';

import data from './data';

let svg = d3
	.select('body')
	.append('svg')
	.attr('width', 1200)
	.attr('height', 900);

const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const legendWidth = 200;
const canvas = {
	width: width - legendWidth,
	height: height
};
const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
const projects = data[data.map(item => item.name).indexOf('Projects')].values;
const cities = data[data.map(item => item.name).indexOf('city')].values;
const o2p = data[data.map(item => item.name).indexOf('O2P')].values.filter(
	link => link.source.id !== null && link.target.id !== null
); // Null check in data of relations
//const categories = [...new Set(organizations.map(o => o.category))];
let nodes = [...organizations, ...projects, ...cities];
console.log(nodes);
let links = o2p.map(o2p =>
	Object.assign(
		{},
		{
			data: o2p,
			source: o2p.source.id,
			target: o2p.target.id
		}
	)
);
console.log(links);
const radius = 40;
const color = d3.scaleOrdinal(d3.schemeCategory20);
let simulation = d3
	.forceSimulation()
	.force('link', d3.forceLink().id(d => d.id))
	.force('charge', d3.forceManyBody().strength(-1000))
	.force('collide', d3.forceCollide().radius(radius + 20))
	.force('x', d3.forceX())
	.force('y', d3.forceY())
	.force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2));
let link = svg
	.append('g')
	.attr('class', 'links')
	.selectAll('line')
	.data(links)
	.enter()
	.append('line')
	.attr('class', 'link')
	.attr('stroke', 'black')
	.attr('stroke-width', 2)
	.attr('stroke-opacity', 0.2);
let node = svg
	.append('g')
	.attr('class', 'nodes')
	.selectAll('g.node')
	.data(nodes)
	.enter()
	.append('g')
	.attr('class', 'node')
	.on('mouseover', d => {
		const activeNode = d;
		const activeNodeLinks = o2p.reduce(
			(links, link) => {
				if (link.source.id === activeNode.id) links.push(link.target.id);
				if (link.target.id === activeNode.id) links.push(link.source.id);
				return links;
			},
			[activeNode.id]
		);
		svg
			.selectAll('.node > circle')
			.attr('stroke-opacity', d => (activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.2))
			.attr('fill-opacity', d => (activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.5))
			.attr('r', d => (d === activeNode ? radius + 15 : radius));
		svg
			.selectAll('.node > rect')
			.attr('stroke-opacity', d => (activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.2))
			.attr('fill-opacity', d => (activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.5));
		svg.selectAll('.node > text').attr('font-size', d => (d === activeNode ? '12px' : '11px'));
		svg
			.selectAll('.link')
			.transition()
			.attr('stroke-width', d => (d.source === activeNode || d.target === activeNode ? 4 : 2))
			.attr('stroke-opacity', d => (d.source === activeNode || d.target === activeNode ? 1 : 0.2));
		d3.event.stopPropagation();
	})
	.on('mouseout', d => {
		svg
			.selectAll('.node > circle')
			.attr('stroke-opacity', 0.2)
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0.5)
			.attr('r', radius);
		svg
			.selectAll('.node > rect')
			.attr('stroke-opacity', 2)
			.attr('fill-opacity', 0.5);
		svg.selectAll('.node > text').attr('font-size', '11px');
		svg
			.selectAll('.link')
			.transition()
			.attr('stroke-width', 2)
			.attr('stroke-opacity', 0.2);
		d3.event.stopPropagation();
	})
	.on('click', d => {
		window.location.href = `${window.location.protocol}//${window.location.hostname}:${
			window.location.port
		}/#/explorer/organizations/${d.id}`;
	});
//node.append('circle').attr('fill', d => color(d.category)).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
let _s32 = Math.sqrt(3) / 2;
let A = 25;
let xDiff = 500;
let yDiff = 500;
let pointData = [
	[A + xDiff, 0 + yDiff],
	[A / 2 + xDiff, A * _s32 + yDiff],
	[-A / 2 + xDiff, A * _s32 + yDiff],
	[-A + xDiff, 0 + yDiff],
	[-A / 2 + xDiff, -A * _s32 + yDiff],
	[A / 2 + xDiff, -A * _s32 + yDiff]
];

node.each(function(d) {
	if (d.type == 'organization') {
		d3
			.select(this)
			.append('circle')
			.attr('fill', d => color(d.category))
			.attr('r', radius)
			.attr('cx', 0)
			.attr('cy', 0)
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0.5)
			.attr('stroke-opacity', 0.2);
	} else if (d.type == 'project') {
		d3
			.select(this)
			.append('rect')
			.attr('fill', d => color(d.color))
			.attr('x', -(120 / 2))
			.attr('y', -(52 / 2))
			.attr('width', 120)
			.attr('height', 52)
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0.5)
			.attr('stroke-opacity', 0.2);
	} else if (d.type == 'city') {
		d3
			.select(this)
			.append('polygon')
			.attr('points', '60,20 100,40 100,80 60,100 20,80 20,40')
			.attr('fill', d => color(d.color))
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.attr('fill-opacity', 0.5)
			.attr('stroke-opacity', 0.2);
	}
});
node
	.append('text')
	.text(d => d.abbreviation)
	.attr('text-anchor', 'middle')
	.attr('font-size', '11px');

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
	link
		.attr('x1', d => d.source.x - offset(d.source, d.target, radius).x)
		.attr('y1', d => d.source.y - offset(d.source, d.target, radius).y)
		.attr('x2', d => d.target.x - offset(d.target, d.source, radius).x)
		.attr('y2', d => d.target.y - offset(d.target, d.source, radius).y);
	node.attr(
		'transform',
		d =>
			'translate(' +
			[
				(d.x = Math.max(radius + 1.2, Math.min(canvas.width - radius, d.x))),
				(d.y = Math.max(radius + 1.2, Math.min(canvas.height - radius, d.y)))
			] +
			')'
	);
};
simulation.nodes(nodes).on('tick', ticked);
simulation.force('link').links(links);

