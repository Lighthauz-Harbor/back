import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class ImageService {

    constructor(private http: Http) {
    }

    upload(picture: any) {
        const URL = 
            "https://api.cloudinary.com/v1_1/lighthauz-harbor/image/upload";

        return this.http.post(URL, {
            file: picture,
            upload_preset: "ac9xvojb"
        }).map((res: Response) => {
            return JSON.parse(res.text());
        });
    }

}