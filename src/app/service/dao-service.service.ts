
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()

export class DaoService {

    constructor(private angularFire: AngularFireDatabase) {}

    insert<T>(entity: string, obj: T): Promise<string> {
      return new Promise<string>((resolve, reject) => {

        this.angularFire.list(entity).push(obj)
          .then(key => resolve(key), (error) => reject(error));
      });
    }

    update<T>(entity: string, key: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.angularFire.list(entity).update(key, data)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }

    updateByPath<T>(entity: string, key: string, path: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.angularFire.list(`${entity}/${path}/${key}`).push(data)
                .then(() => resolve());
        });
    }


    remove<T>(entity: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            this.angularFire.list(entity).remove(key)
                .then(() => resolve())
                .catch(error => reject(error));
        });
    }


    list<T>(entity: string): AngularFireList<T[]> {
        return this.angularFire.list(entity);
    }


    search<T>(entity: string, property: string, value: any): AngularFireList<T[]> {
        return this.angularFire.list(entity,
                query => query.orderByChild(property).equalTo(value));
    }

    getUserKey<T>(entity: string, property: string, value: string): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            this.angularFire.list(entity,
                query => query.orderByChild(property).equalTo(value))
                .snapshotChanges().pipe(
                map(actions =>
                    actions.map(snapshot =>  snapshot.key )
                ))
                .subscribe(
                    result => resolve(result),
                    error => reject(error)
                );
        });
    }

    get<T>(entity: string, property: string, value: any): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            this.angularFire.list(entity,
                query => query.orderByChild(property).equalTo(value))
                .valueChanges().subscribe(
                    result => resolve(result[0]),
                    error => reject(error)
                );
        });
    }


    getByKey<T>(entity: string,  value: any): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            this.angularFire.list(entity,
                query => query.orderByKey().equalTo(value))
                .valueChanges().subscribe(
                    result => resolve(result[0]),
                    error => reject(error)
                );
        });
    }


}
