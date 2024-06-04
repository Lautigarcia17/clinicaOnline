import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';

export const authGuard: CanActivateFn = (route, state) => {

  let globalData = inject(GlobalDataService);
  let router = inject(Router);

  if (globalData.getStateLogin()) {
    return true;
  }

  router.navigate(['login']);
  return false;
};
