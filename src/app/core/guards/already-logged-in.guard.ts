import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';

export const alreadyLoggedInGuard: CanActivateFn = (route, state) => {
  
  let globalData = inject(GlobalDataService);
  let router = inject(Router);
  

  if(globalData.getStateLogin()){
    router.navigate(['home']);
    return false;
  }
  
  return true;
};
