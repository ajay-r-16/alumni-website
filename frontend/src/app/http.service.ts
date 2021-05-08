import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {user_details} from './models/user_details';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class HttpService {
  current_user:any = {};
  filter:any;
  constructor(private http:HttpClient, private router: Router) { 
    
  }
  base_url:String = "http://localhost:5000";
  
  register(user:user_details){
    let url = this.base_url + "/signup";
    return this.http.post(url,user);
  }

  login(user){
    let url = this.base_url + "/login";
    return this.http.post(url,user);
  }

  getQueries(){
    let url=this.base_url+"/getQueries";
    var header = {
        headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token'))
      }
      return this.http.get(url,header);
  }

  sendQuery(query:any){
    console.log(query)
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token')),
      body: query
    }
    let url=this.base_url+"/addQuery";
   

    return this.http.post(url, query, header);
  }

  answerQuery(id,msg){
    let data = {id: id, action: msg};
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token')),
      body: data
    }
    let url=this.base_url+"/answerQuery";
    return this.http.post(url, data, header);

  }



  addPost(data:FormData) {
    let url=this.base_url+"/addPost";
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token')),
      body: data
    }
    return this.http.post(url, data, header);
  }

  addEvent(data:FormData) {
    let url=this.base_url+"/addEvent";
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token')),
      body: data
    }
    return this.http.post(url, data, header);
  }

  getProfile(arr,name){


    this.filter = Object.assign({},arr);
    if(name != "")
      this.filter['fullname'] = [name];
    let str = JSON.stringify(this.filter);
    str = str.replace(/Company/g, 'institution');
    str = str.toLowerCase(); 
    console.log(str);
    let url = this.base_url + "/search/:"+str;

    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token'))
    }


    return this.http.get(url,header);
  }


  visitProfile(id:string){
    let url = this.base_url + "/visit/"+id;
    return this.http.get(url);
  }

  resetEmail(email:string){
    let url = this.base_url + "/resetPassword";
    return this.http.post(url, {email: email});
  }

  resetToken(token:string){
    let url = this.base_url+"/validateToken";
    return this.http.post(url,{resettoken: token});
  }

  resetPassword(password:string,token:string){
    let url = this.base_url+"/newPassword";
    return this.http.post(url,{newPassword: password,resettoken: token});
  }

  getPost(){
    let url = this.base_url+'/getPosts';
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token'))
    }
    return this.http.get(url, header);
  }

  getEvent(status:string){
    let url = this.base_url+'/getEvents/'+status;
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token'))
    }
    return this.http.get(url,header);
  }

  updateEvent(request){
    let url = this.base_url+'/updateEvent/';
    var header = {
      headers:new HttpHeaders().set('Authorization','Bearer '+localStorage.getItem('token'))
    }
    return this.http.post(url, request, header);
  }

  // getLatestSongs(){
  //   var url = "get_latest"
  //   var header = {
  //     headers:new HttpHeaders().set('Authorization',localStorage.getItem('token'))
  //   }
  //   return this.http.get(url,header);
  // }
}
