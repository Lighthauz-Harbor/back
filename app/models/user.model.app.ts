export class User {

    private _id: string;
    private _name: string;
    private _username: string;
    private _role: string;
    private _bio: string;
    private _profilePic: string; // URL to the file in image server
    private _dateOfBirth: Date;
    private _createdAt: Date;
    private _selected: boolean; // for selection in users list table

    // don't assign passwords for security purposes
    constructor(
        id: string = "",
        username: string = "unknown@email.com", 
        role: string = "user",
        name: string = "",
        bio: string = "This is some bio",
        profilePic: string = "http://res.cloudinary.com/lighthauz-harbor/image/upload/v1478504599/default-profile-pic_hroujz.png",
        dateOfBirth: Date = new Date(0),
        createdAt: Date = new Date(0)) {
        
        this._id = id;
        this._name = name;
        this._username = username;
        this._role = role;
        this._bio = bio;
        this._profilePic = profilePic;
        this._dateOfBirth = dateOfBirth;
        this._createdAt = createdAt;
        this._selected = false;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

    get username(): string {
        return this._username;
    }

    set username(newUsername: string) {
        this._username = newUsername;
    }

    get role(): string {
        return this._role;
    }

    set role(newRole: string) {
        this._role = newRole;
    } 

    get bio(): string {
        return this._bio;
    }

    set bio(newBio: string) {
        this._bio = newBio;
    }

    get profilePic(): string {
        return this._profilePic;
    }

    set profilePic(newProfilePic: string) {
        this._profilePic = newProfilePic;
    }

    get dateOfBirth(): Date {
        return this._dateOfBirth;
    }

    set dateOfBirth(newDateOfBirth: Date) {
        this._dateOfBirth = newDateOfBirth;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    set createdAt(newCreatedAt: Date) {
        this._createdAt = newCreatedAt;
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(newSelected: boolean) {
        this._selected = newSelected;
    }

}
