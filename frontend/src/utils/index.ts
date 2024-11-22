export class LocalStorage {
    // Get the value of a key in local storage
    static get(key: string) {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }

    // Set a key value pair in local storage
    static set(key: string, value: any) {
        localStorage.setItem(key, value)
    }

    //clear localstorage 
    static remove(){
        localStorage.clear()
    }

    //remove item in localstorage
    static removeItem(key: string){
        localStorage.removeItem(key)
    }
}