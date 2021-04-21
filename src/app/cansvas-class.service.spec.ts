import { TestBed } from '@angular/core/testing';

import { Canvas } from './cansvas-class.service';

describe('CansvasClassService', () => {
  let service: Canvas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Canvas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
