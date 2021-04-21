import { preserveWhitespacesDefault } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {Canvas} from '../cansvas-class.service';
import {LevelNodes, getMaxYLevel, getMaxXlevel} from '../levels.service';
import * as NodesData from 'src/assets/Network.json';
import {D3SvgService} from '../d3-svg.service';
import { HttpClient } from '@angular/common/http';


export interface Node {
  ID: string;
  type: string;
  connections: string[];
  Ylevel: number;
  Xlevel: number;
  CardinalityFwd: number;
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.less']
})
export class NetworkComponent implements OnInit {
  public Nodes: Node[] = new Array<Node>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    NodesData.network.forEach( node =>
    this.Nodes.push({ ID: node.id, connections: node.connections, type: node.Type, Ylevel: 0, Xlevel: 0, CardinalityFwd: 0 }));
    this.Nodes = LevelNodes(this.Nodes);
    const Ylevels = getMaxYLevel(this.Nodes);
    const Xlevels = getMaxXlevel(this.Nodes);
   // const Cns = new Canvas(this.Nodes, Ylevels, Xlevels);
    const d3 = new D3SvgService(innerHeight, innerWidth, this.http);
    d3.AssignDataAndForce();
  }
  }

