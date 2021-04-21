/**
 * @brief přidává svg "šablony" pro různá zařízení
 * @param svg svg (graf,...)
 */
export function SvgDefs(svg: any): void {
  const defs = svg.append('svg:defs');
  const devices = [
  'end-device-clear',
  'end-device-firewall-clear',

  'end-device-fraud',
  'end-device-firewall-fraud',

  'router-clear',
  'router-firewall-clear',

  'router-fraud',
  'router-firewall-fraud',
];
  devices.forEach(device => {
    defs.append('svg:pattern')
    .attr('id', device)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('patternContentUnits', 'objectBoundingBox')
    .append('svg:image')
    .attr('width', 1)
    .attr('height', 1)
    .attr('preserveAspectRatio', 'none')
    .attr('xlink:href', 'assets/Images/' + device + '.svg');
  });
}
