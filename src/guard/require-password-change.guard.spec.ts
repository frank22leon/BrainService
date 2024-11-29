import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { requirePasswordChangeGuard } from './require-password-change.guard';

describe('requirePasswordChangeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => requirePasswordChangeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
