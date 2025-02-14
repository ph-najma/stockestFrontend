import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { nonauthenticatedGuard } from './nonauthenticated.guard';

describe('nonauthenticatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => nonauthenticatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
