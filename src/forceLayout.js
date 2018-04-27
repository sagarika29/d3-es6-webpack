import * as d3 from "d3";
import data from './data';

 export function forceLayout(svg){
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const legendWidth = 200;
    const canvas = {
        width: width - legendWidth,
        height: height
    };
    const organizations = data[data.map(item => item.name).indexOf('Organizations')].values;
    const relations = data[data.map(item => item.name).indexOf('Relations')].values.filter(link =>link.source && link.source.id !== null && link.target && link.target.id !== null); // Null check in data of relations
    const categories = [...new Set(organizations.map(o => o.category))];
    let nodes = [...organizations];
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
    
    const radius = 20;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    let simulation = d3.forceSimulation().force('link', d3.forceLink().id(d => d.id)).force('charge', d3.forceManyBody().strength(-1000)).force('collide', d3.forceCollide().radius(radius + 20)).force('x', d3.forceX()).force('y', d3.forceY()).force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2));
    let link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(final).enter().append('g').attr('class', 'node').on('mouseover', d => {
        onMouseOverEvent(d);    
    }).on('mouseout', d => {
        onMouseOutEvent(d);
    }).on('click', d => {
        window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/explorer/organizations/${d.id}`;
    });
    
    node.append('circle').attr('fill', d => color(d.category)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
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
    legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px').attr("id", function (d) { return d; });
    legend.append("foreignObject")
        .attr("width", 100)
        .attr("height", 100)
        .append("xhtml:body")
        .html(`<input type=checkbox id="check" />`)
        .on("click", function (d, i, elem) {
            d3.select(elem[i].children[0]).attr("class", d);
            
            
            if (d3.select(elem[i].children[0]).property("checked") === true) {
                elem.forEach((el)=>{
                    if(el != elem[i])    
                    d3.select(el.children[0]).property("checked",false);
                })
                const activeLegendItem = d;
                const activeNodes = nodes.filter(node => node.category === activeLegendItem).map(node => node);
                const selectedNodes = relation_node(nodes.filter(node => node.category === activeLegendItem).map(node => node))
                const updatedNodes = [];
                const updatedLinks = []
                selectedNodes.map(node => {
                    relations.map(relation => {
                        if (relation.source.id === node.id || relation.target.id === node.id) {
                            updatedLinks.push({
                                data: relation,
                                source: relation.source.id,
                                target: relation.target.id
                            });
                        }
                    });
                }
                )
                const relation_nodes = [];
                updatedLinks.map((relation) => {
                    relation_nodes.push(relation.source);
                    relation_nodes.push(relation.target);
                });
                final.filter(node => {
                    if (relation_nodes.includes(node.id))
                        updatedNodes.push(node);
                });
                svg.selectAll('g.nodes').remove();
                svg.selectAll('g.links').remove();
    
                let newNode = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(updatedNodes).enter().append('g').attr('class', 'node').on('mouseover', d => {
                    onMouseOverEvent(d);
                }).on('mouseout', d => {
                    onMouseOutEvent(d);
                }).on('click', d => {
                    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/explorer/organizations/${d.id}`;
                });
                newNode.append('circle').attr('fill', d => color(d.category)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
                newNode.append('text').text(d => d.abbreviation).attr('text-anchor', 'middle').attr('font-size', '9px');
    
                let newLink = svg.append('g').attr('class', 'links').selectAll('line').data(updatedLinks).enter().append('line').attr('class', 'link').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    
                const ticked = () => {
                    newLink.attr('x1', d => d.source.x - offset(d.source, d.target, radius).x).attr('y1', d => d.source.y - offset(d.source, d.target, radius).y).attr('x2', d => d.target.x - offset(d.target, d.source, radius).x).attr('y2', d => d.target.y - offset(d.target, d.source, radius).y);
                    newNode.attr('transform', d => 'translate(' + [
                        d.x = Math.max(radius + 3, Math.min(canvas.width - radius - 3, d.x)),
                        d.y = Math.max(radius + 3, Math.min(canvas.height - radius - 3, d.y))
                    ] + ')');
                };
    
                simulation.nodes(updatedNodes).on('tick', ticked);
                simulation.force('link').links(updatedLinks);
                simulation.alpha(1).restart();
            }
            else {
                d3.select(elem[i].children[0]).attr("checked", false);
                svg.selectAll('g.nodes').remove();
                svg.selectAll('g.links').remove();
                const radius = 20;
                let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(final).enter().append('g').attr('class', 'node').on('mouseover', d => {
                    onMouseOverEvent(d);
                }).on('mouseout', d => {
                    onMouseOutEvent(d);
                }).on('click', d => {
                    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/explorer/organizations/${d.id}`;
                });
                node.append('circle').attr('fill', d => color(d.category)).attr('id', (d) => { return d.id; }).attr('r', radius).attr('cx', 0).attr('cy', 0).attr('stroke', 'black').attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('stroke-opacity', 0.2);
                node.append('text').text(d => d.abbreviation).attr('text-anchor', 'middle').attr('font-size', '9px');
    
                let link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line').attr('class', 'link').attr('stroke', 'black').attr('stroke-width', 2).attr('stroke-opacity', 0.2);
    
                const ticked2 = () => {
                    link.attr('x1', d => d.source.x - offset(d.source, d.target, radius).x).attr('y1', d => d.source.y - offset(d.source, d.target, radius).y).attr('x2', d => d.target.x - offset(d.target, d.source, radius).x).attr('y2', d => d.target.y - offset(d.target, d.source, radius).y);
                    node.attr('transform', d => 'translate(' + [
                        d.x = Math.max(radius + 3, Math.min(canvas.width - radius - 3, d.x)),
                        d.y = Math.max(radius + 3, Math.min(canvas.height - radius - 3, d.y))
                    ] + ')');
                };
    
                simulation.nodes(final).on('tick', ticked2);
                simulation.force('link').links(links);
    
                simulation.alpha(1).restart();
            }
           
        });
        const onMouseOverEvent = (d) => {
            const activeNode = d;
            const activeNodeLinks = relations.reduce((links, link) => {
                if (link.source.id === activeNode.id)
                    links.push(link.target.id);
                if (link.target.id === activeNode.id)
                    links.push(link.source.id);
                return links;
            }, [activeNode.id]);
            svg.selectAll('.node > circle').attr('stroke-opacity', d => activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.2).attr('fill-opacity', d => activeNodeLinks.indexOf(d.id) > -1 ? 1 : 0.5).attr('r', d => d === activeNode ? radius : radius);
            svg.selectAll('.node > text').attr('font-size', d => d === activeNode ? '12px' : '9px');
            svg.selectAll('.link').transition().attr('stroke-width', d => d.source === activeNode || d.target === activeNode ? 4 : 2).attr('stroke-opacity', d => d.source === activeNode || d.target === activeNode ? 1 : 0.2);
            d3.event.stopPropagation();
        }
    
        const onMouseOutEvent = (d) => {
            svg.selectAll('.node > circle').attr('stroke-opacity', 0.2).attr('stroke-width', 2).attr('fill-opacity', 0.5).attr('r', radius);
            svg.selectAll('.node > text').attr('font-size', '9px');
            svg.selectAll('.link').transition().attr('stroke-width', 2).attr('stroke-opacity', 0.2);
            d3.event.stopPropagation();
        }
}
