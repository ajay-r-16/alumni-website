import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { user_details } from '../models/user_details';

declare var $:any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  resetEmail:string="";
  resetToken:string="";
  resetPassword1:string="";
  resetPassword2:string="";

  constructor( private http: HttpService, private router: Router) {
    
   }

  ngOnInit(): void {
    if(localStorage.getItem("token")){
      this.router.navigate(['/home']);
    }
  }

  

  showRegister(){
    let register = document.getElementById("register");
    document.getElementById("login").setAttribute("style", "display:none");
    document.getElementById("body").append(register);
    register.setAttribute("style","display:block");
    

  }

  showLogin(){
    let login = document.getElementById("login");
    document.getElementById("register").setAttribute("style", "display:none");
    document.getElementById("body").append(login);
    login.setAttribute("style","display:block");
  }

  login(){
    let user = new user_details();
    user.email = document.getElementById("email").innerHTML;
    user.password = document.getElementById("password").innerHTML;
    this.http.login(user);
   
  }

  LoginForm(details:NgForm){
    let user = {
      email:String,
      password:String
    };
    user.email = details.controls['email'].value;
    user.password = details.controls['password'].value;
    this.http.login(user).subscribe((data)=>{
      if(data["token"]){  
        localStorage.setItem("token",data["token"]);
        localStorage.setItem("role", data["role"]);
        this.router.navigate(['/home']);
      }
    })
  }

  RegisterForm(details:NgForm){
    let user = new user_details();  
    user.email = details.controls['registerEmail'].value;
    user.fullname = details.controls['registerfn'].value+details.controls['registerln'].value;
    user.phone = details.controls['phoneNumber'].value;
    user.dob = details.controls['dob'].value;
    user.department = details.controls['department'].value;
    user.designation = details.controls['designation'].value;
    user.batch = details.controls['batch'].value;
    user.password = details.controls['registerPassword'].value;
    this.http.register(user).subscribe((data)=>{
      if(data["token"]){
        localStorage.setItem("token",data["token"]);
        localStorage.setItem("role", data["role"]);
        
        this.router.navigate(['/home']);
      }
    })
  }

  ResetEmail(){
    this.http.resetEmail(this.resetEmail).subscribe((data)=>{
      console.log(data);
      $("#exampleModal").modal('hide');
      $("#staticBackdrop").modal('show');

    })

  }

  ResetToken(){
    this.http.resetToken(this.resetToken).subscribe(data=>{
      console.log(data);
      $("#staticBackdrop").modal('hide');
      $("#staticBackdrop1").modal('show');

    })
  }

  ResetPassword(){
    this.http.resetPassword(this.resetPassword1,this.resetToken).subscribe(data=>{
      console.log(data);
      this.router.navigate(['/login']);
    })

  }
}
