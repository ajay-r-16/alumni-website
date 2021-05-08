import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import {Location} from '@angular/common';

declare var $ : any;
@Component({
  selector: 'app-visit-profile',
  templateUrl: './visit-profile.component.html',
  styleUrls: ['./visit-profile.component.css']
})
export class VisitProfileComponent implements OnInit {
  id:string;
  profile:any = {};
  name="";
  query:string = "";
  
  constructor(private http:HttpService, private route: ActivatedRoute, private router: Router, private location: Location) { 
    
      
  }

  ngOnInit(): void {
    
    this.id = this.route.snapshot.params.id;
   
    this.http.visitProfile(this.id).subscribe(data=>{
      this.profile = data;
      let { fullname } = this.profile;
      this.name = fullname ;
      this.profile["dob"] = this.profile["dob"].split('T')[0];
      delete this.profile["fullname"]
      
    })
  }

  send(){
    let data = {};
    console.log(this.id)
    data["alumni_id"]=this.id;
    data["query"]=this.query;

    this.http.sendQuery(data).subscribe((data)=>{
        console.log(data);
    })
    
    
    
  }


  goBack(){
    this.location.back();
  }

  

}
