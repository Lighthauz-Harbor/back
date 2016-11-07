export class User {
    name: string;
    username: string;
    password: string;
    role: string;
    bio: string;
    profilePic: string; // URL to the file in image server
    dateOfBirth: Date;
    createdAt: Date;

    constructor(
        username: string, 
        role: string,
        name: string = "Some Name",
        bio: string = "This is some bio",
        profilePic: string = "http://res.cloudinary.com/lighthauz-harbor/image/upload/v1478504599/default-profile-pic_hroujz.png",
        dateOfBirth: Date = new Date(),
        createdAt: Date = new Date(0),
        password: string = "") {
        
        this.username = username;
        this.role = role;
    }
}