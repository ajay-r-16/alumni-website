import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

declare var $:any;
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests:any = [];
  request:any={};
  status:string="pending";
  
  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.http.getEvent("pending").subscribe(data=>{
      this.requests = data;
      console.log(this.requests);
    })
  }

  getEvents(status:string){
    this.status = status;
    this.http.getEvent(status).subscribe(data=>{
      this.requests = data;
      console.log(this.requests);
    })
  }

  showCanvas(request){
    console.log(request)
    this.request = request;

    // document.getElementById("offcanvasExample").classList.add("show");
    
  }

  updateEvent(status){
    this.request.status = status;
    this.http.updateEvent(this.request).subscribe(data=>{
      console.log(data);
    });
  }

}
