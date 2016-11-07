export class User {
    username: string;
    password: string;
    name: string;
    bio: string;
    dateOfBirth: Date;
    role: string;

    constructor(
        username: string, 
        role: string,
        name: string = "Some Name",
        password: string = "",
        bio: string = "Some Bio",
        dateOfBirth: Date = new Date()) {
        
        this.username = username;
        this.role = role;
    }
}