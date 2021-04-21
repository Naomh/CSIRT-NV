import { Injectable} from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { SvgDefs } from './svg-pattern.service';

interface Node {
  name: string;
  type: string;
  services?: [{ name: string, owner: string }];
}

interface Link {
  source: string;
  target: string;
}

interface Graph {
  nodes: any[];
  links: any[];
}
@Injectable({
  providedIn: 'root'
})

export class D3SvgService {
  public data: any;
  public graph: any;
  constructor(public height: number, public width: number, private http: HttpClient) {
  }
  /**
   * @param Links objekty přebírané z Links.json
   * @returns array spojení podle popisu z Network.json
   */
  private AssignLinks(Links): any {
    const links: Link[] = new Array<Link>();
    Links.Links.forEach(link => {
      links.push({ source: link.src, target: link.dest });
    });
    return links;
  }
/**
 *
 * @param Nodes objekty přebírané z Network.json
 * @returns array uzlů podle popisu z Network.json
 */
  private AssignNodes(Nodes): any {
    const nodes: Node[] = new Array<Node>();
    Nodes.network.forEach(node => {
      nodes.push({ name: node.id, type: node.Type, services: node?.services });
    });
    return nodes;
  }
  /**
   * @brief kontrola načtení dat z API do proměnné graph
   * @param graph údaje o grafu(Links, Nodes)
   * @returns graph
   */
  private GraphPms(graph: Graph): Promise<Graph> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (graph && graph.links && graph.nodes) {
          console.log('Graph: success', graph);
          resolve(graph);
          clearInterval(interval);
        } else {
          console.log('failed');
        }
      }, 100);
    });
  }
  /**
   * @brief kontrola přijmu dat z API
   * @param response subscribe pro Links.json nebo Network.json
   * @returns promise response
   */
  private GetDataPms(response: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (response) {
          resolve(response);
          clearInterval(interval);
        } else {
          throw('Data fetch failed');
        }
      }, 500);
    });
  }

   /**
    * @brief přebírá data z API a přepisuje do graph
    */
  public AssignDataAndForce(): void {
    const graph: Graph = {} as Graph;
    const urls = [{ id: 0, path: './assets/Links.json' }, { id: 1, path: './assets/Network.json' }];
    urls.forEach(url => {
      this.http.get(url.path).subscribe(async (response) => {
        await this.GetDataPms(response);
        if (url.id === 0) {
          graph.links = this.AssignLinks(response);
        } else {
          graph.nodes = this.AssignNodes(response);
          this.Force(await this.GraphPms(graph));
        }
      });
    });
  }

/**
 * @brief vytváří force layout pro vizualizaci sítě
 * @param graph soubor Nodů a linek
 */
  private Force(graph: Graph): any {
    const svg = d3.select('svg');
    const r = 40;
    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        'link',
        d3
          .forceLink()
          .id((d) => d.name)
          .links(graph.links)
      )
      .force('collide', d3.forceCollide(r * 1.5))
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', ticked);

    SvgDefs(svg);

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => 1)
      .attr('stroke', (d) => 'black');

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', r)
      .attr('fill', (d) => 'url(#' + d.type + ')')
      .on('dblclick', dblclick)
      .on('mouseenter', TooltipHover)
      .on('mouseleave', TooltipHidden)
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    const label = svg.selectAll(null)
      .data(graph.nodes)
      .enter()
      .append('text')
      .text((d) => d.name)
      .style('text-anchor', 'middle')
      .style('fill', '#555')
      .style('font-family', 'Arial')
      .style('font-size', 12);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '10px')
      .style('z-index', '10')
      .style('min-width', '150px')
      .style('min-height', '100px')
      .style('background-color', 'rgba(32, 32, 60, 0.8)')
      .style('color', 'silver')
      .style('border-radius', '5px')
      .style('opacity', '0')
      .style('transition:', 'opacity 0.3s linear')
      .text('');

      /**
       * @brief vytvoří okénko s informaci o jednotlivých nodech
       * @param node uzel, pro který se má tooltip objevit
       */
    function loadTooltipContent(node: any): void {
      let htmlContent = '<div>';
      htmlContent += '<span class="name"> Node: ' + node.name + '<\/span><br>';
      htmlContent += '<span class="service">Services:<\/span><hr>';
      node.services?.forEach(service => {
      Object.keys(service).forEach(key => htmlContent += '<b>' + key + ': <\/b>' + service[key] + ' ');
      htmlContent += '<hr>';
    });
      htmlContent += '<\/div>';
      tooltip.html(htmlContent);
    }
    let isTooltipHidden = false;
    /**
     * @brief zobrazí tooltip
     * @param event vyvolaná interakcí uživatele
     * @param node uzel, pro který je událost vyvolaná
     * @returns styly pro tooltip (průhlednost, z-index a pozici xy)
     */
    function TooltipHover(event, node): any {
      if (isTooltipHidden === true){
        return;
      }
      loadTooltipContent(node);

      return tooltip.style('top', (node.y - 10) + 'px').style('left', (node.x + r + 10) + 'px').style('opacity', '100').style('z-index', '10');
    }
    /**
     * @brief schová tooltip
     * @returns styly pro tooltip (průhlednost 100%, přenese do pozadí)
     */
    function TooltipHidden(): any{
      return tooltip.style('opacity', '0').style('z-index', '-10');
    }
    /**
     * @brief ticky grafu
     */
    function ticked(): void {
      node
        .attr('cx', (d) => d.x = Math.max(r, Math.min(innerWidth - r, d.x)))
        .attr('cy', (d) => d.y = Math.max(r, Math.min(innerHeight - r, d.y)));
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      label.attr('x', (d) => d.x)
        .attr('y', (d) => d.y - (r + 10));
    }
    /**
     * @brief příprava na drag
     * @param event event vyvolaný uživatelem na svg objektu
     * @param d uzel na kterém byl event vyvolaný
     */
    function dragstarted(event, d): void {
      if (!event.active) { simulation.alphaTarget(0.3).restart(); }
      d3.select(this).classed('fixed', d.fixed = true);
      isTooltipHidden = true;
      tooltip.style('opacity', '0');
    }
/**
 * @brief mění pozici nodů v závislosti na pohybu a pozici myši
 */
    function dragged(event, d): void {
      d.fx = event.x;
      d.fy = event.y;
    }
/**
 * @brief konec tažení
 */
    function dragended(event, d): void {
      if (!event.active) { simulation.alphaTarget(0); }
      isTooltipHidden = false;
    }
  /**
   * @brief uvolňuje připnutý node
   */
    function dblclick(event, d): void {
      d3.select(this).classed('fixed', d.fixed = false);
      d.fx = null;
      d.fy = null;
    }
  }

}
