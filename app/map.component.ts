import { Options } from '../platforms/android/src/main/assets/app/tns_modules/nativescript-geolocation';
import { Observable, Subject } from 'rxjs/Rx';
import { AppService } from './app.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as MapView from 'nativescript-google-maps-sdk';
import {registerElement} from "nativescript-angular/element-registry";

import * as geolocation from 'nativescript-geolocation';

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
    selector: 'map',
    template: `
    <GridLayout>
        <MapView (mapReady)="onMapReady($event)"
            latitude="{{ latitude }}" 
            longitude="{{ longitude }}" 
            zoom="{{ zoom }}" 
            padding="{{ padding }}" 
            mapReady="onMapReady"  >
        </MapView>
    </GridLayout>
    `
})
export class MapComponent {
    public loc$: Subject<geolocation.Location>;
    public points$: Observable<geolocation.Location>;

    public latitude : number = 45.43;
    public longitude : number = -75.7;
    zoom = 14;

    map;

    @ViewChild("MapView") mapView: ElementRef;

    constructor(srv: AppService) {
        this.loc$ = srv.loc$;
        this.points$ = this.loc$.asObservable();
        this.points$.subscribe(v => {
            try {
                this.newPoint(v);
            } catch(e) {
                console.log("Error: " + e);
            }
        });

    }

    // ngOnChanges() {
    //     console.log(this.points);
    //     if(this.points) {
    //         console.log(this.points.length);
    //         if(this.map && this.points.length) {
    //             let {latitude, longitude} = this.points[this.points.length - 1];
    //             if(latitude && longitude){
    //                 var marker = new MapView.Marker();
    //                 marker.position = MapView.Position.positionFromLatLng(latitude, longitude);
    //                 this.map.addMarker(marker);
    //             }
    //         }
    //     }
    // }

    lastPoint: geolocation.Location;

    newPoint(point: geolocation.Location) {
        if(this.map) {
            if(!this.lastPoint) {
                this.addPin(point);
                this.lastPoint = point;
            } else {
                const newPoint = point;

                let opts = new MapView.Polyline();

                opts.width = 5;
                opts.visible = true;

                opts.addPoint(MapView.Position.positionFromLatLng(this.lastPoint.latitude, this.lastPoint.longitude));
                opts.addPoint(MapView.Position.positionFromLatLng(point.latitude, point.longitude));

                console.log(this.lastPoint.latitude);

                this.map.addPolyline(opts);
                this.latitude = point.latitude;
                this.longitude = point.longitude;

                this.lastPoint = point;

            }
        }
    }




    addPin(point: geolocation.Location) {
        if(this.map) {
            let {latitude, longitude} = point;
            if(latitude && longitude){
                var marker = new MapView.Marker();
                marker.position = MapView.Position.positionFromLatLng(latitude, longitude);
                this.map.addMarker(marker);
                this.latitude = latitude;
                this.longitude = longitude;
            }
        }
    }


    @Input() points: geolocation.Location[];

    //Map events
    onMapReady(args) {
        this.map = args.object;
        var marker = new MapView.Marker();
        marker.position = MapView.Position.positionFromLatLng(this.latitude, this.longitude);
        marker.title = "Ottawa";
        marker.snippet = "Canada";

        marker.userData = { index : 1};
        this.map.addMarker(marker);
    }
}
