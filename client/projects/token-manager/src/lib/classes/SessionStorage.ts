export default class SessionStorage {
    public static get(key: string) {
        if (this.exists(key)) {
            return sessionStorage.getItem(key);
        }
        return false;
    }

    public static exists(key: string) {
        return sessionStorage.getItem(key) !== null;
    }

    public static destroy(keys: string[]) {
        keys.forEach(key => {
            sessionStorage.removeItem(key);
        });
    }

    public static set(key: string, value: any) {
        if (this.exists(key)) {
            this.destroy([key]);
        }
        sessionStorage.setItem(key, value);
    }
}
