import * as d3 from "d3";
import data from './data';

 export function adjacencyMatrix(svg){
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
    const relations = data[data.map(item => item.name).indexOf('Relations')].values;
    const categories = [...new Set(relations.map(r => r.category))];
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
    organizations.filter(node => {
        if (relation_node(relation_nodes).includes(node.id))
            final.push(node);
    });
    const length = final.length;
    console.log(length);
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
        const source = final[x].id;
        const target = final[y].id;
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
    const textHLegend = gHLegend.selectAll('text').data(final).enter().append('text').text(d => d.abbreviation).attr('font-size', '11px').attr('dy', 8).attr('dx', 6).attr('transform', (d, i) => 'translate(' + i * rectWidth + ')rotate(-90)').on('click', d => {
        window.location.href = `${ window.location.protocol }//${ window.location.hostname }:${ window.location.port }/#/explorer/organizations/${ d.id }`;
    });
    const gVLegend = svg.append('g').attr('transform', `translate(${ offset },${ offset })`);
    const textVLegend = gVLegend.selectAll('text').data(final).enter().append('text').text(d => d.abbreviation).attr('y', (d, i) => i * rectWidth + 8).attr('font-size', '11px').attr('text-anchor', 'end').attr('x', -6).on('click', d => {
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
        900 / 4
    ] + ')').selectAll('g.legend').data(categories).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
        0,
        index * 30 + 5
    ] + ')');
    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
    legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px');
 }
