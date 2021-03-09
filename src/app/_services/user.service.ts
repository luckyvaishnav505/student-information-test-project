import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(skip ,limit) {
        return this.http.get<User[]>(`${config.apiUrl}/users/list`+`?skip=`+skip+`&limit=` +limit);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/register1`, user);
    }

    update(user: any) {
        return this.http.post(`${config.apiUrl}/users/updateUser` , user);
    }
    search(key: any) {
        return this.http.post(`${config.apiUrl}/users/search` , key);
    }
    delete(id: number) {
        return this.http.post(`${config.apiUrl}/users/removeUser` ,{_id :id});
    }
}