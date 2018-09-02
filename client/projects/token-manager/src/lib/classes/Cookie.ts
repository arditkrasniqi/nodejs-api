export default class Cookie {
  public static get(key: string) {
    var name = key + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return false;
  }

  public static exists(key: string) {
    return this.get(key) !== false;
  }

  public static destroy(keys: string[]) {
    keys.forEach(key => {
      document.cookie = `${key} + =; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    });
  }

  public static set(key: string, value: any) {
    if (this.exists(key)) {
      this.destroy([key]);
    }
    document.cookie = `${key}=${value}`;
  }
}
