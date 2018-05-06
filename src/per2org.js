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

    const links = data.map(d=>Object.assign({},{
        data:d,
        source:d.Organisation.id,
        target:d.Person.id
    }))
    console.log(links);
    const organizations=data.map(d=>{return d.Organisation}).map(org=>Object.assign({},{
        data: org,
        id: org.id,
        owns: "Organization",
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
        owns: "Person",
        name: person.name,
        type: data.map((d,i)=>{if(d.Person.id==person.id){
            return d.type
        }}),
        status: data.map((d,i)=>{if(d.Person.id==person.id){
            return d.status
        }})
    }))
    
    let nodes=[...organizations,...persons];
    
    let resArr = [];
    nodes.filter((item)=>{
      let i = resArr.findIndex(x => x.id == item.id);
      if(i <= -1){
            resArr.push(item);
      }
      return null;
    });
    const radius=20;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    let simulation = d3.forceSimulation().force('link', d3.forceLink().id(d => d.id)).force('charge', d3.forceManyBody().strength(-1000)).force('collide', d3.forceCollide().radius(radius + 35)).force('x', d3.forceX()).force('y', d3.forceY()).force('center', d3.forceCenter(canvas.width / 2, canvas.height / 2));
    
    let node = svg.append('g').attr('class', 'nodes').selectAll('g.node').data(resArr).enter().append('g').attr('class', 'node');
    let link = svg.append('g').data(links).attr('class','links').selectAll('line').data(links).enter().append('line').attr('class', (d)=> { return (d.data.status != "Derzeit") ? "link_dashed" : "link_continuous" ; }).attr('stroke', (d)=>{return color(d.data.type)}).attr('stroke-opacity', 0.2);
    
    node.append('svg:foreignObject').attr("width", 50).attr("height", 50).attr("font-size",'30px').attr("fill","darkslategrey").append("xhtml:body").html((d)=>{if(d.owns == "Organization"){return '<i class="fa fa-warehouse"></i>'} else return '<i class="fa fa-user"></i>'});
    node.append('text').text(d => d.name).attr('text-anchor', 'start').attr('font-size', '11px').attr('y','60');
    
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
    
    simulation.nodes(resArr).on('tick', ticked);
    simulation.force("link").links(links);
}