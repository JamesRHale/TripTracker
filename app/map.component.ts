import {Component, ElementRef, ViewChild} from '@angular/core';
import * as MapView from "nativescript-google-maps-sdk";
import {registerElement} from "nativescript-angular/element-registry";

// Important - must register MapView plugin in order to use in Angular templates
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
    selector: 'map',
    template: `
    <GridLayout>
        <MapView (mapReady)="onMapReady($event)">
            latitude="{{ latitude }}" 
            longitude="{{ longitude }}" 
            zoom="{{ zoom }}" 
            padding="{{ padding }}" 
            mapReady="onMapReady"  
        </MapView>
    </GridLayout>
    `
})
export class MapComponent {

    public latitude : number = 45.43;
    public longitude : number = -75.7;
    zoom = 13;
    @ViewChild("MapView") mapView: ElementRef;

    //Map events
    onMapReady(args) {
        var map = args.object;
        var marker = new MapView.Marker();
        marker.position = MapView.Position.positionFromLatLng(-45.0, -75.7);
        marker.title = "Ottawa";
        marker.snippet = "Canada";

        marker.userData = { index : 1};
        map.addMarker(marker);
    }
}
