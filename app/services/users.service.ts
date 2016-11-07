import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { User } from "../models/user.model.app";

@Injectable()
export class UsersService {

    constructor(private http: Http) {

    }

    getList(): User[] {
        return [];
    }

}