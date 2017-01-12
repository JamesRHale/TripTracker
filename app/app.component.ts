import { Component } from "@angular/core";

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public trackingStarted:boolean = false
    public isTracking:boolean = false
    public noTripsLabel = "Record and log your trips"

    public startTracking() {
        this.trackingStarted = true
        this.isTracking = true
    }

     public stopTracking() {
        this.isTracking = false
    }

      public resumeTracking() {
        this.isTracking = true
    }

       public completeTracking() {
        this.isTracking = false
        this.trackingStarted = false
    }
}
