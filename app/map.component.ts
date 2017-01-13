import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as MapView from "nativescript-google-maps-sdk";
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

    public latitude : number = 45.43;
    public longitude : number = -75.7;
    zoom = 13;

    map;

    @ViewChild("MapView") mapView: ElementRef;

    ngOnChanges() {
        console.log(this.points.length);
        if(this.map && this.points.length) {
            let {latitude, longitude} = this.points[this.points.length - 1];
            if(latitude && longitude){
                var marker = new MapView.Marker();
                marker.position = MapView.Position.positionFromLatLng(latitude, longitude);
                this.map.addMarker(marker);
            }
        }
    }


    @Input() points: geolocation.Location[] = [];

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
