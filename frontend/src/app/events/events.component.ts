import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

declare var $ : any;
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events:any = [];
  role:string;
  file:any;

  constructor(private http: HttpService, private router:Router) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.http.getEvent("approved").subscribe(data=>{
      this.events = data;
      console.log(this.events);
    })
  }

  changed(e){
    this.file = (e.target as HTMLInputElement).files[0];
  }

  EventForm(details:NgForm){

    const eventData = new FormData();
    eventData.append("event_name", details.controls["event_name"].value);
    eventData.append("event_desc", details.controls["event_desc"].value);
    eventData.append("event_date", details.controls["event_date"].value);
    eventData.append("image", this.file);
    console.log("Clicked");
    
    this.http.addEvent(eventData).subscribe(data=>{
      console.log(data);
      this.router.navigate(['/events']);

    })
  
  }

}
