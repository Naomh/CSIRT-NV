import { TestBed } from '@angular/core/testing';
import { LevelNodes } from './levels.service';

describe('LevelsService', () => {
  let service=0

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelNodes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
