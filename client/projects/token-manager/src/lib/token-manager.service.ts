import { Injectable } from '@angular/core';
import Cookie from './classes/Cookie';
import SessionStorage from './classes/SessionStorage';

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  constructor() {
  }

  public static setTokenWithExpiration(token: string, expiration: Number): void {
    Cookie.set('token', token);
    Cookie.set('expiration', expiration);
    SessionStorage.set('token', token);
    SessionStorage.set('expiration', expiration);
  }

  public static setToken(token: string){
    Cookie.set('token', token);
    SessionStorage.set('token', token);
  }

  public static destroy(): void {
    Cookie.destroy(['token', 'expiration']);
    SessionStorage.destroy(['token', 'expiration']);
  }

  public static get(key: string): string|boolean {
    return Cookie.get(key);
  }

  public static tokenExists(): boolean {
    return Cookie.exists('token') && SessionStorage.exists('token');
  }

  public static compareTokens(): boolean {

    const tokenState = this.tokenExists() ?
      Cookie.get('token') === SessionStorage.get('token') : false;
    if (!tokenState) {
      this.destroy();
      return false;
    }
    return true;
  }
}
