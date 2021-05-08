import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpService } from '../http.service';

  

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts:any = [];
  file:any;
  imageData: string;
  create: HTMLElement;
  navbar:HTMLElement;
  carousel:HTMLElement;
  stick:boolean = false;
  poster:any;
  role:string;
  constructor( private http: HttpService) {
    
   }
   

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    console.log(this.role);
    this.http.getPost().subscribe(data=>{
      this.posts = data;
      
    })
  }

  ngAfterViewInit(){
    if(this.role!="student"){
      this.create = document.getElementById("create");
      this.create.classList.remove("sticky");
      this.navbar = document.getElementById("navbar");
      this.carousel = document.getElementById("carousel");
      this.handleScroll();
    }
  }



  @HostListener('window:scroll', ['$event'])
    handleScroll(){
      

// Get the offset position of the navbar
      if(this.role!= "student"){
        let sticky = this.create.offsetTop;
        let nav = this.navbar.offsetTop + this.navbar.offsetHeight;
        let car = this.carousel.offsetTop + this.carousel.offsetHeight;
        
        if ((window.pageYOffset + nav) >= (sticky - 60)) {
          this.create.classList.add("sticky-top")
          this.create.style.top = nav+60+"px";
          this.stick = true;
        } 
        
        if(this.stick && (window.pageYOffset + nav) < car) {
          this.create.classList.remove("sticky-top");
          this.stick = false;
        }
      }
      
    }

    changed(event){
      this.file = (event.target as HTMLInputElement).files[0];
      console.log(this.file);
      
    }
    

    PostForm(details:NgForm){

      const profileData = new FormData();
      profileData.append("message", details.controls["message"].value);
      profileData.append("image", this.file);
      this.http.addPost(profileData).subscribe(data=>{
        console.log(data);
        this.http.getPost().subscribe(data=>{
        this.posts = data;
      
      })
    })
    
    }

}
