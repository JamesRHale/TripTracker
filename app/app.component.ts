import {
    THIS_EXPR
} from '../platforms/android/src/main/assets/app/tns_modules/@angular/compiler/src/output/output_ast';
import { Observable, Subject } from 'rxjs/Rx';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';

import * as geolocation from 'nativescript-geolocation';


@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public trackingStarted:boolean = false
    public isTracking:boolean = false
    public noTripsLabel = "Record and log your trips"

    public loc$: Subject<geolocation.Location>;
    public watchId: number;


    public longs: string[] = [];
    public points: geolocation.Location[];

    public long$: Observable<string>;
    public points$: Observable<geolocation.Location>;

    @ViewChild("mylabel") myLabel: ElementRef;

    constructor(private _ngZone: NgZone) {
        this.loc$ = new Subject();
        this.long$ = this.loc$.asObservable().map(l => `${l.latitude} : ${l.longitude}`);
        this.long$.subscribe(v => {
            try {
                _ngZone.run(() => {
                    this.longs.push(v);
                    // this.myLabel.nativeElement.text = this.longs.join('              ');            
                });
            } catch(e) {
                console.log("Error: " + e);
            }
        });

        this.points$ = this.loc$.asObservable();
        this.points$.subscribe(v => {
            try {
                _ngZone.run(() => {
                    this.points.push(v);
                    // this.myLabel.nativeElement.text = this.longs.join('              ');            
                });
            } catch(e) {
                console.log("Error: " + e);
            }
        });
    }

    public startTracking() {
        this.trackingStarted = true;
        this.isTracking = true;
        this.longs = [];
        this.points = [];

        this.watchId = geolocation.watchLocation((loc) => {
            if (loc && this.isTracking) {
                this.loc$.next(loc);
                // this.myLabel.nativeElement.text = loc.longitude;
                // console.log("Received location: " + loc.longitude);

                // alert(`Long is ${loc.longitude}`);
            }
        }, (e) => {
            console.log("Error: " + e.message);
        }, 
        {
            desiredAccuracy: 3, 
            updateDistance: 5, 
            minimumUpdateTime : 1000
        }); // Should update every 20 seconds according to Googe documentation. Not verified.

    }

     public stopTracking() {
        this.isTracking = false;
    }

      public resumeTracking() {
        this.isTracking = true;
    }

       public completeTracking() {
        this.isTracking = false;
        this.trackingStarted = false;
        geolocation.clearWatch(this.watchId);
    }
}
