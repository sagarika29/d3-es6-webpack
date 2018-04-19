import * as d3 from "d3";
import data from './data';

 export function treeMap(svg){
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
 }
