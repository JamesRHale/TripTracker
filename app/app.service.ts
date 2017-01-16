import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import * as geolocation from 'nativescript-geolocation';

@Injectable()
export class AppService {

    public loc$: Subject<geolocation.Location>;

 constructor() {
    this.loc$ = new Subject();

 }

 onStart() {

 }

}