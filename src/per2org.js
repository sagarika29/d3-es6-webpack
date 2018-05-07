import * as d3 from "d3";
import data from './p2oData';
import './index.css';
export function per2org(svg){
    const width = parseFloat(svg.attr('width'));
    const height = parseFloat(svg.attr('height'));
    const legendWidth = 200;
    const canvas = {
        width: width - legendWidth,
        height: height
    };

    const organizations=data.map(d=>{return d.Organisation}).map(org=>Object.assign({},{
        data: org,
        id: org.id,
        name: org.name,
        type: data.map((d,i)=>{if(d.Organisation.id==org.id){
            return d.type
        }}),
        status: data.map((d,i)=>{if(d.Organisation.id==org.id){
            return d.status
        }})
    }))
    const persons=data.map(d=>{return d.Person}).map(person=>Object.assign({},{
        data: person,
        id: person.id,
        name: person.name,
        type: data.map((d,i)=>{if(d.Person.id==person.id){
            return d.type
        }}),
        status: data.map((d,i)=>{if(d.Person.id==person.id){
            return d.status
        }})
    }))
    let nodes=[...organizations,...persons];
    const links = data.map(d=>Object.assign({},{
        data:d,
        source:d.Organisation.id,
        target:d.Person.id
    }))
    let resArr = [];
    let types =[...new Set(data.map(o => o.type))];
    nodes.filter((item)=>{
      let i = resArr.findIndex(x => x.id == item.id);
      if(i <= -1){
            resArr.push(item);
      }
      return null;
    });
    const radius=20;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    let simulation = d3.forceSimulation().force('link', d3.forceLink().id(d => d.id)).force('charge', d3.forceManyBody().strength(-600)).force('collide', d3.forceCollide().radius(radius + 20)).force('x', d3.forceX()).force('y', d3.forceY()).force('center', d3.forceCenter(canvas.width / 2, canvas.height / 3));
    
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(resArr).enter().append('g').attr('class', 'node');
    let link = svg.append('g').data(links).attr('class','links').selectAll('line').data(links).enter().append('line').attr('class', (d)=> { return (d.data.status != "Derzeit") ? "link_dashed" : "link_continuous" ; }).attr('stroke', (d)=>{return color(d.data.type)}).attr('stroke-opacity', 0.2);
    
    node.append('svg:foreignObject').attr("width", 50).attr("height", 50).attr("font-size",'30px').attr("fill","darkslategrey").append("xhtml:body").html((d)=>{if(d.data.entityType == "Organization"){return '<i class="fa fa-warehouse"></i>'} else return '<i class="fa fa-user"></i>'});
    node.append('text').text(d => d.name).attr('text-anchor', 'start').attr('font-size', '11px').attr('y','50');
    
    const ticked = () => {
        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y + 28; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y + 34; });
      node.attr("transform", function(d) { return "translate(" + (d.x - 25 ) + "," + (d.y- 10) + ")"; });
    };
    
    simulation.nodes(resArr).on('tick', ticked);
    simulation.force("link").links(links);

    const legend = svg.append('g').attr('class', 'options').attr('transform', 'translate(' + [
        width - legendWidth + 100,
        height / 4
    ] + ')').selectAll('g.legend').data(types).enter().append('g').attr('class', 'legend').attr('transform', (d, index) => 'translate(' + [
        0,
        index * 30 + 5
    ] + ')');
    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', d => color(d));
    legend.append('text').text(d => d).attr('x', 20).attr('dy', 10).attr('font-size', '12px');
    
     
}