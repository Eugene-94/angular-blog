import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Post, FbCreateResponse } from "./interfaces";

@Injectable({ providedIn: 'root' })

export class PostService {
    constructor (
        private http: HttpClient
    ) {}

    create(post: Post): Observable<Post> {
        return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
            .pipe(map((resp: FbCreateResponse) => {
                const newPost: Post = {
                    ...post,
                    id: resp.name,
                    date: new Date(post.date)
                }
                return newPost;
            }))
    }
}