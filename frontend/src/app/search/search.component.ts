import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  filter = {};
  filter_copy = {};
  filter_name:string = 'Batch';
  filter_title:string = 'Start year';
  filter_value:string = '';
  name:String= '';
  result:any=[];

  constructor( private http:HttpService, private router:Router) { }

  ngOnInit(): void {
  }

  changeFilter(ele){
    this.filter_name = ele.value;
    if(ele.value=="Batch"){
      this.filter_title = "Start year";
    }
    else if(ele.value=="Company"){
      this.filter_title = "Company name";
    }
    else if(ele.value=="Department"){
      this.filter_title = "Choose a department";
    }
    else if(ele.value=="Email"){
      this.filter_title = "Email Address";
    }
  }

  applyFilter(){
    // console.log(this.filter.includes([this.filter_name,this.filter_value]));
    this.filter_copy = Object.assign({},this.filter);
    
    if(this.filter_name in this.filter_copy){
      if(this.filter_name=="Batch"){
        this.filter_copy[this.filter_name].push(Number(this.filter_value));
      }
      else
        this.filter_copy[this.filter_name].push(this.filter_value);
      
    }
    else{
      if(this.filter_name=="Batch"){
        this.filter_copy[this.filter_name] = [Number(this.filter_value)];
      }
      else
        this.filter_copy[this.filter_name] = [this.filter_value];
      
    }
    this.filter_value="";
    this.filter = Object.assign({},this.filter_copy);
  }


  closeFilter(element:HTMLElement){
    element.parentElement.remove();
  }

  getData(){
    this.http.getProfile(this.filter,this.name).subscribe((data)=>{
      this.result = data;
    });
  }

  visitProfile(id:string){
    
    let url = '/visitprofile/'+id;
    this.router.navigate([url]);
  }
}
