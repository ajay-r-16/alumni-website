import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css']
})
export class QueryComponent implements OnInit {
  queries:any=[];
  role:string;
  message:string = "";
  reply_status:number=0;
  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.getQueries();
    this.role = localStorage.getItem('role');
  }

  getQueries(){
    this.http.getQueries().subscribe(data=>{
      this.queries = data;
    })
  }

  reply(i){
    document.getElementById("reply_btn"+i).style.display = "none";
    document.getElementById("msg"+i).style.display = "block";
  }

  cancelReply(i){
    document.getElementById("reply_btn"+i).style.display = "block";
    document.getElementById("msg"+i).style.display = "none";
  }

  sendReply(id,i){
    this.http.answerQuery(id, (<HTMLInputElement>document.getElementById("message"+i)).value).subscribe((data)=>{
      console.log(data);
      this.getQueries();
    });
    
  }

}
