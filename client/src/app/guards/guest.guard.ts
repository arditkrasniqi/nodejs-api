import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TokenManagerService } from '../../../projects/token-manager/src/public_api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = TokenManagerService.compareTokens();
    if (token) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
