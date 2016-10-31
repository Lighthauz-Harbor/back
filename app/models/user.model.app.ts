export class User {
    username: string;
    password: string;
    role: string;

    constructor(username: string, role: string) {
        this.username = username;
        this.role = role;
        // set password to empty string for privacy
        this.password = "";
    }
}