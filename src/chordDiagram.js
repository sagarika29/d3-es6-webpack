import * as d3 from "d3";
import data from './data';

export function chordDiagram(svg){
     
const getNodeById = (nodes, id) => {
    return nodes[nodes.map(x => x.data.id).indexOf(id)];
};
const project = (x, y) => {
    let angle = (x - 90) / 180 * Math.PI, radius = y;
    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle)
    ];
};
const projectX = (x, y) => {
    let angle = (x - 90) / 180 * Math.PI, radius = y;
    return radius * Math.cos(angle);
};
const projectY = (x, y) => {
    let angle = (x - 90) / 180 * Math.PI, radius = y;
    return radius * Math.sin(angle); // changed -> radius * Math.sin(angle) - 60
};
let relations = data[data.map(item => item.name).indexOf('Relations')].values;
let organizations = data[data.map(item => item.name).indexOf('Organizations')].values.map(organization => Object.assign(organization, { size: 30 }));
let services = organizations.reduce((categories, organization) => {
    if (Object.keys(categories).indexOf(organization.category) > -1) {
        categories[organization.category].children.push(organization);
    } else {
        categories[organization.category] = {
            name: organization.category,
            children: [organization]
        };
    }
    return categories;
}, {});
const categories = [...new Set(organizations.map(o => o.category))];
let color = d3.scaleOrdinal().range(d3.schemeCategory10.map(c => {
    c = d3.rgb(c);
    c.opacity = 0.6;
    return c;
}));
const legendWidth = 200;
const svgWidth = parseFloat(svg.attr('width'));
const svgHeight = parseFloat(svg.attr('height'));
const canvas = {
    width: svgWidth, //svgWidth - legendWidth
    height: svgHeight
};
let width = canvas.width, height = canvas.height;
let root = d3.hierarchy({
    name: 'services',
    children: Object.values(services)
});
let cluster = d3.cluster().size([
    360,
    width / 2 - 265
]);
cluster(root);
let circle = svg.append('circle').attr('cx', width / 2).attr('cy', height / 2).attr('r', width / 2 - 265).attr('fill', '#F0F0F0');//height / 2 - 60 -> height / 2
let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
let nodes = root.descendants().filter(n => !n.children);
let node = g.selectAll('.node').data(nodes).enter().append('g').attr('transform', d => 'translate(' + project(d.x, d.y) + ')');
node.append('circle').attr('r', 2.5);
let text = node.append('text').attr('class', 'text').attr('dy', '0.31em').attr('x', d => d.x < 180 ? 6 : -6).style('text-anchor', d => d.x < 180 ? 'start' : 'end').attr('font-family', 'sans-serif').attr('font-size', '10px').attr('transform', d => 'rotate(' + (d.x < 180 ? d.x - 90 : d.x + 90) + ')').text(d => d.data.abbreviation).on('click', d => {
    d3.event.stopPropagation();
}).on('mouseover', (d, i, elem) => {
    let id = d.data.id;
    d3.select(elem[i]).attr('font-size', '12px').attr('font-weight', 'bold');
    g.selectAll('.link').transition().attr('stroke-width', d => {
        if (d.source.id === id) {
            let targetIndex = elem.map(x => x['__data__']['data'].id).indexOf(d.target.id);
            d3.select(elem[targetIndex]).attr('font-size', '12px').attr('font-weight', 'bold');
            return 4;
        }
        if (d.target.id === id) {
            let sourceIndex = elem.map(x => x['__data__']['data'].id).indexOf(d.source.id);
            d3.select(elem[sourceIndex]).attr('font-size', '12px').attr('font-weight', 'bold');
            return 4;
        }
        return 2;
    }).style('stroke-opacity', d => {
        if (d.source.id === id || d.target.id === id) {
            return 1;
        }
        return 0.1;
    });
    d3.event.stopPropagation();
}).on('mouseout', (d, i, elem) => {
    g.selectAll('.link').transition().attr('stroke-width', 2).style('stroke-opacity', 1);
    g.selectAll('.text').attr('font-size', '10px').attr('font-weight', 'normal');
    d3.event.stopPropagation();
}).on('click', d => {
    window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.data.id }`;
});
relations = relations.filter(link => link.source.id !== null && link.target.id !== null); // Null check in data of relations
const line = d3.line().x(d => projectX(d.x, d.y)).y(d => projectY(d.x, d.y)).curve(d3.curveBundle.beta(0.45));
let edges = g.selectAll('.link').data(relations).enter();
edges.append('path').attr('class', 'link').attr('d', d => {
    let source = getNodeById(nodes, d.source.id);
    let target = getNodeById(nodes, d.target.id);
    return line(source.path(target));
}).attr('stroke', d => color(d.category)).attr('stroke-width', 0.3).attr('fill', 'none').attr('pointer-events', 'none');
const legend = svg.append('g').attr('class', 'options').attr('transform', 'translate(' + [
    width - legendWidth + 100,
    height / 4
] + ')').selectAll('g.legend').data(categories).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
    0,
    index * 30 + 5
] + ')');
legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px');
legend.append("foreignObject")
    .attr("width", 100)
    .attr("height", 100)
    .append("xhtml:body")
    .html(`<input type=checkbox id="check" />`)
    .on("click", function (d, i, elem) {
        d3.select(elem[i].children[0]).attr("class", d);
            if (d3.select(elem[i].children[0]).property("checked") === true) {
                const updatedOrganizations = [];
                organizations.map(org=>{
                    if(org.category === d)
                    updatedOrganizations.push(org);
                })
                console.log(updatedOrganizations);
            }
            else{
                d3.select(elem[i].children[0]).attr("checked", false);
            }
    });
 }
