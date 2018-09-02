import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TokenManagerService } from '../../../projects/token-manager/src/public_api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = TokenManagerService.compareTokens();
    if (token) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
