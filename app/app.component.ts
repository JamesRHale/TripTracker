import { AppService } from './app.service';
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

    public long$: Observable<string>;
    public points: geolocation.Location[];
    public points$: Observable<geolocation.Location>;

    @ViewChild("mylabel") myLabel: ElementRef;

    constructor(private _ngZone: NgZone, srv: AppService) {
        this.loc$ = srv.loc$;
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
            updateDistance: 10, 
            minimumUpdateTime : 1000 * 5
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
