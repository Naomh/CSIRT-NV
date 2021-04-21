/**
 * Omlouvám se zbytečný kód pro osobní projekt - není součástí řešení pro Csirt-mu
 */
import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';
import { Injectable } from '@angular/core';
import { LevelNodes } from './levels.service';
// tslint:disable: no-bitwise
@Injectable({
  providedIn: 'root'
})
export class Canvas{
  public nodesOA = [];
  public lines = [];
  constructor(public Nodes, ylevels, xlevels) {
    const canvas = document.querySelector('canvas');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const ctx = canvas.getContext('2d');
    const lvlHgt = (canvas.height - 200) / ylevels;
    const lvlWdt = (canvas.width - 100) / xlevels;
    const winY = canvas.height >> 1;
    const winX = canvas.width >> 1;

    /*
    ↓ Třída pro zařízení ↓
    */
    class Node {
      constructor(public x: number, public y: number, public color: string, public ID: string) {
        this.draw();
      }
      draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText(this.ID, this.x, this.y);

      }
    }
     /*
    ↓ Třída pro komunikační spojení ↓
    */
    class Line{
      constructor(public x: number, public x1: number, public y: number, public y1: number){
        this.draw();
      }
      draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x1, this.y1);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
    class Coordinates{
      constructor(public x: number, public y: number){}
      public calcXY = (Count, xlevel, ylevel) => {
      const angle = ylevel === 1 ? (2 * Math.PI / Count) * xlevel : (Math.PI / Count) * (xlevel + 1);
      const quater = Math.floor(angle / 91);
      console.log('uhel: ', angle, 'kvadrant: ', quater);

      this.x += this.calcx(angle);
      this.y += this.calcy(angle);
    }
    calcx = (angle): number => Math.sin(angle) * lvlHgt;

    calcy = (angle): number => Math.cos(angle) * lvlHgt;
  }
    const PrevXY = new Coordinates(winX, winY);
    Nodes.forEach(node => {
      if (node.Ylevel === 1){
        this.nodesOA.push(new Node(PrevXY.x, PrevXY.y, 'maroon', node.ID));
      }else{
        const i = this.nodesOA.findIndex(index => index.ID === node.ID);
        PrevXY.x = this.nodesOA[i].x;
        PrevXY.y = this.nodesOA[i].y;
      }
      node.connections.forEach(connection => {
        const i = Nodes.findIndex(index => index.ID === connection);
        if (Nodes[i].Ylevel  > node.Ylevel){
        const CurrentXY = new Coordinates (PrevXY.x, PrevXY.y);
        CurrentXY.calcXY(node.CardinalityFwd, Nodes[i].Xlevel + 1, node.Ylevel);
        this.nodesOA.push(new Node(CurrentXY.x, CurrentXY.y, 'maroon', connection));
        }
      });
    });






    /*const PrevXY = new Coordinates(winX, winY);
    Nodes.forEach(node => {
      if (node.Ylevel === 1){
      this.nodesOA.push(new Node(PrevXY.x, PrevXY.y, 'maroon', node.ID));
      }
      let i = this.nodesOA.findIndex(iNode => iNode.ID === node.ID ) - 1;
      if ( i !== -1){
        PrevXY.x = this.nodesOA[i].x;
        PrevXY.y = this.nodesOA[i].y;
      }
      node.connections.forEach(connection => {
        const newXY = PrevXY;
        i = Nodes.findIndex(iNode => iNode.ID === connection) - 1;
        newXY.calcXY(node.CardinalityFwd, Nodes[i].Xlevel + 1);
        this.nodesOA.push(new Node( newXY.x, newXY.y, 'maroon', connection));
    });
   });
   /* Nodes.forEach( node => {
      const a = (Math.sin(360 / node.CardinalityFwd) ** -1 * lvlHgt);
      const c = (Math.cos(360 / node.CardinalityFwd) ** -1 * a );
      const ylvl = winY + lvlHgt * (node.Ylevel - 1);
      const xlvl = winX + lvlWdt * node.Xlevel;
      this.nodesOA.push(new Node(xlvl, ylvl, 'Maroon'));
      winX = first ? winX + c : winX - c;
      first = !first;
    });
  */
  }
}
