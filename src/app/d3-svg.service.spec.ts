import { TestBed } from '@angular/core/testing';

import { D3SvgService } from './d3-svg.service';

describe('D3SvgService', () => {
  let service: D3SvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D3SvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
