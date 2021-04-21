/**
 * Omlouvám se, kód pro osobní projekt - není součástí řešení pro Csirt-mu
 */
import {Node} from './network/network.component';
// tslint:disable no-bitwise

export function LevelNodes(Nodes: Node[]): Node[]{
      Nodes.sort((a, b): number => {
       const ret = (a.ID < b.ID) ? -1 : 1;
       return ret;
      });
      Nodes[0].Ylevel = 1;
      Nodes[0].Xlevel = 0;
      Nodes.forEach(node => {
        let lvl = 0;
        node.connections.forEach(connection => {
        const i = Nodes.findIndex(cNode => cNode.ID === connection);
        node.CardinalityFwd += (Nodes[i].Ylevel === 0) ? 1 : 0;
        Nodes[i].Ylevel = (Nodes[i].Ylevel === 0) ? node.Ylevel + 1 : Nodes[i].Ylevel;
        // ↓ Sudý xlevel předchozího nodu  je záporný xlvl u nového ↓ // tslint:disable no-bitwise
        Nodes[i].Xlevel = lvl++;
      });
    });
      return Nodes;
  }


export function getMaxYLevel(Nodes: Node[]): number{
    let mlvl = 0;
    Nodes.forEach(node => {
    mlvl = (node.Ylevel > mlvl) ? node.Ylevel : mlvl;
  });
    return mlvl;
}


export function getMaxXlevel(Nodes: Node[]): number{
let mlvl = 0;
Nodes.forEach(node => {
mlvl = (node.Xlevel > mlvl) ? node.Xlevel : mlvl;
});
return mlvl;
}


export function GetCyclesByDFS(Nodes: Node[]): any {

}
