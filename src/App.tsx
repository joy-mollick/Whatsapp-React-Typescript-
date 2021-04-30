// @ts-ignore
import firebase from 'firebase';
import { cachedDataVersionTag } from 'node:v8';

import Typewriter from 'typewriter-effect';
import React, { Component, useRef } from "react";
import ReactDOM from "react-dom";
/// import firebase authentication
import { auth } from "./Firebase";
/// import Realtime Dtabase of firebase 
import { db } from "./Firebase";
import './style.css';
import logo from './logo.svg';
// @ts-ignore
//import ReactHoldButton from 'react-long-press';
///import { Container, Button, Link } from 'react-floating-action-button';
// @ts-ignore
// import { Container, Button, Link,lightColors, darkColors } from 'react-floating-action-button';
import down from "./again.png";
import home from "./home.png";
import fri from "./friend.png";
import user from "./user.png";
// @ts-ignore
import swal from '@sweetalert/with-react';
// @ts-ignore
import {Swipe} from "react-swipe-component";


function unique_key(a:string,b:string)
{
    let mx_on,mn_on;
    if(a.length>b.length) {mx_on=a;mn_on=b}
    else if(a.length!=b.length) {mx_on=b;mn_on=a}
    else {
      if(a>b){mx_on=a;mn_on=b}
    else {mx_on=b;mn_on=a}
  }
    let a_b=mx_on+"_"+mn_on;
    return a_b;
}

function messenger(mess:string)
{
  let res:string="";
  if(mess.includes("kost")) res="Inshallah sob thik hoye jabe";
  else if(mess.includes("hotash")) res="Inshallah hotasha kete  jabe";
  return res;
}

function sizing(siz:string)
{
  let iii=siz.length-1;
 while(siz[iii]==" ") iii--;
 siz = siz.substring(0,iii+1);
    return siz;
}

interface myprops{

}

interface mystate{
    chats: any,
    content: any,
    selected:boolean,
    friend:string,
    friend_key:string,
    found:boolean,
    me:string,
    pass:string,
    special_mess:any,
    search:any,
    chat_friend:any,
    signup:any,
    add_friend:any,
    my_date:any,
    last_active:any,
    logout:any;
    now_chatting_friend:any;
    typing:any
}

let userr:string="";
 let tem:string;
 let lasted:string;

export default class Profile extends Component<myprops,mystate> {

    constructor(props:myprops) {
      super(props);

      this.state = {
        me:"",
        chats: [],
        content: '',
        selected:false,
        friend:'',
        friend_key:"",
        found:false,
        pass:"",
        special_mess:null,
        search:"",
        chat_friend:[],
        signup:true,
        add_friend:false,
        my_date:"",
        last_active:"",
        logout:false,
        now_chatting_friend:"",
        typing:""
      };
      /// by binding we are passing as objects 
      this.handleFriend = this.handleFriend.bind(this);
      this.submit_friend = this.submit_friend.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handle_me = this.handle_me.bind(this);
      this.submit_me = this.submit_me.bind(this);
      this.handle_pass = this.handle_pass.bind(this);
      this.handle_search= this.handle_search.bind(this);
      this.submit_search=this.submit_search.bind(this);
      this.refresh=this.refresh.bind(this);
      this.home=this.home.bind(this);
      this.handle_chat=this.handle_chat.bind(this);
      this.show=this.show.bind(this);
      this.handleSignup = this.handleSignup.bind(this);
      this.today_timing = this.today_timing.bind(this);
      this.log_handle=this.log_handle.bind(this);
      this.log_out=this.log_out.bind(this);
      this.show=this.show.bind(this);
    }

    today_timing()
    {
      let todays = new Date();
      let dates = todays.getFullYear()+'-'+(todays.getMonth()+1)+'-'+todays.getDate();
      this.setState({my_date :dates});
    }

    handleSignup()
    {
       if(this.state.me==""||this.state.pass=="") { swal(
        <div> 
          <p>Username or password can't be empty</p>
        </div>
           )
     }
       else if(this.state.signup)
       {
        let ref=db.ref("chats").child("user_details").child(sizing(this.state.me));
        let b=false;
        let esxt=false;
         /// db.ref("chats").child("user_details").child(this.state.username);
        ref.once("value")
       .then((snapshot:any) => {
        b = snapshot.exists(); // true
       if(b!=true){
         this.setState({me:sizing(this.state.me)});
         this.setState({pass:sizing(this.state.pass)});
         db.ref("chats").child("user_details").child(this.state.me).child("username").set(this.state.me);
         db.ref("chats").child("user_details").child(this.state.me).child("start_date").set(Date.now());
         db.ref("chats").child("user_details").child(this.state.me).child("password").set(this.state.pass);
         this.setState({signup:false});
         swal(
          <div>
            <h1>Hello! {this.state.me}</h1>        
            <p>Account has created</p>
          </div>
              )
         // alert("Account created");
         this.setState({found:true});}
         else {  swal(
          <div>  
            <p>{this.state.me} already exists! Try another one .</p>
          </div>
              )}
        });
       }
       else{
         this.setState({signup:false});
         this.submit_me();
       }
    }



    scrollToBottom = () => {
      if(this.state.found&&this.state.selected){
      const chatt:any = document.getElementById("chatList");
      chatt.scrollTop = chatt.scrollHeight;
      }
    };

    handle_search(event:any)
    {
      this.setState({
        search: event.target.value
      });
    }

    handle_me(event:any)
    {

      this.setState({
        me: event.target.value
      });

    }

    handle_pass(event:any)
    {
      this.setState({
        pass: event.target.value
      });
    }

    show()
  {
    db.ref("chats").child("user_details").child(this.state.me).child("chat_friend").on("value", (snapshot => {
      let chat_friend:any = [];
      //let last_one:any=[];
      snapshot.forEach((snap: { val: () => any; }) => {
        chat_friend.push(snap.val());
      });
      this.setState({ chat_friend });
     /// this.setState({last_one});
   }));


    this.setState({signup:false});
    this.setState({search:""});
    this.setState({selected:false,add_friend:false,friend:"",friend_key:""});
    swal(
      <div> 
        <p>Please refresh the page to see the latest messages of your friends</p>
      </div>
         )
  }

    submit_me()
    {

      if(this.state.pass==""||this.state.me=="") {swal(
        <div>  
          <p>Password or Username can't be empty !!</p>
        </div>
            )}

      else{
       //this.setState({me:sizing(this.state.me)});
      this.today_timing();
      console.log("this is me"+ (this.state.me));
      if(!this.state.signup){
      let ref=db.ref("chats").child("user_details").child(sizing(this.state.me));
      let b=false;
      let esxt=false;
       /// db.ref("chats").child("user_details").child(this.state.username);
      ref.once("value")
     .then((snapshot:any) => {
      b = snapshot.exists(); // true
      //console.log(pss)
      if(b)
      {
        console.log("Dhukbo");
      db.ref("chats").child("user_details").child(sizing(this.state.me)).child("password").once("value").then((data: { val: () => string | null; }) => {
        console.log("dekhao to"+data.val());
      if(data.val() !== null && data.val()!==sizing(this.state.pass)){
        swal(
          <div>  
            <p>Your password for account {this.state.me} is wrong , try again !</p>
          </div>
              )
          }
          else if(data.val() !== null && data.val()==sizing(this.state.pass))
            {
              db.ref("chats").child("user_details").child(this.state.me).child("log_out").set(false);
              userr=this.state.me;
              esxt=true;
              this.setState({found:true});
              swal(
                <div> 
                  <h1>Assalamu alaikum {this.state.me}</h1> 
                  <p>Welcome to Payra</p>
                </div>
                   )
            }
      });
        //pss=snapshot.val().password;
        //console.log(pss);
        //if(this.state.pass!=pss) alert("Password is incorrect !");
        ///userr=this.state.me;
      }
      else { swal(
        <div>  
          <h1>{this.state.me} account doesn't exist.</h1>
          <p>To create account , signup </p>
        </div>
            );this.setState({signup:true});}
    });

      }

      else { this.handleSignup()}
    }

    }



    handleFriend(event:any) 
    {
      this.setState({...this.state,[event.target.name]:event.target.value});
    }
  
     submit_friend()
  {
    if(this.state.friend=="") { swal(
      <div> 
        <p>Friend's username can't be empty</p>
      </div>
         )}
    else{
         this.setState({pass:""});
         this.setState({friend:sizing(this.state.friend)});
        let my_child=this.state.friend;
        let reff=db.ref("chats").child("user_details").child(my_child);
        let b=false;
         /// db.ref("chats").child("user_details").child(this.state.username);
        reff.once("value")
       .then((snapshot:any) => {
        b = snapshot.exists(); // true
       /// exists 
       if(b==true)
       {
         if(!this.state.add_friend) {swal(
          <div>      
            <p>{this.state.friend} exist in the Payra . Now you can add him</p>
          </div>
              )}
         this.setState({add_friend:true});
      }
      else
      {
        swal(
          <div>      
            <p>{this.state.friend} doesn't exist in the Payra</p>
          </div>
              )
        //alert("This user doesn't exist in payra ");
      }

    });

    if(this.state.add_friend) {
      let exst=false;
    db.ref("chats").child("user_details").child(this.state.me).child("chat_friend").on("value", (snapshot => {
      snapshot.forEach((snap:any) => {
       /// console.log(snap.val());
        if(snap.val().name===this.state.friend) {exst=true;
           }
      }); 
           }));
           if(!exst) {

            ///this.setState({selected:true});
            /// let my_ky:string=unique_key(this.state.me,my_child);
            ///this.setState({friend_key:my_ky});
            // console.log(my_ky+" Not found !");
           /// console.log(this.state.friend_key);
           /// console.log(ans+"  and "+my_child);
      
            //// pushing chat_friend 
            db.ref("chats").child("user_details").child(this.state.me).child("chat_friend").push({
             name:my_child
            }); 
            console.log("done 1");
      
            db.ref("chats").child("user_details").child(my_child).child("chat_friend").push({
              name:this.state.me
             }); 
      
             console.log("done 2");
          
             }
      
          else 
          {
            swal(
              <div>      
                <p>{this.state.friend} is already your friend,search him in your friend list</p>
              </div>
                  )
           //alert('This user already your friend , You cannot add him!');
          }
    

  } }

}

handleChange(event:any) {
  this.setState({
    content: event.target.value
  });
}

async handleSubmit(event:any) 
{
  event.preventDefault();
  // child(this.state.my_date)
  // child(this.state.my_date)
      db.ref("chats").child("chat_details").child(this.state.friend_key).push({
      content: this.state.content,
      timestamp: Date.now(),
      uid: this.state.me,
      status: false
    }); 
    let ret=messenger(this.state.content);
    this.setState({special_mess:ret});
  
    console.log("last one"+ this.state.content);
    this.setState({ content: '' });
   /// this.setState({ search: "" });
    if(this.state.selected){
    /// pushing
    db.ref("chats").child("chat_details").child(this.state.friend_key).on("value", (snapshot => {
      let chats:any = [];
      snapshot.forEach((snap:any) => {
        if(snap.val().content!=undefined||snap.val().content!=null)
        chats.push(snap.val());
      });
     // chats.sort(function (a:any, b:any) { return a.timestamp - b.timestamp });
      this.setState({ chats });
     // this.setState({show:true});
     this.scrollToBottom();
}));}


}

submit_search()
{

  let searching=this.state.chats;
  let elemnt:number=searching.length-1;
  let str_el:any;
  let serachable:string=this.state.search;
  for(var x=0;x<this.state.chats.length;x++)
  {
    str_el=searching[x].content;
    if(str_el.includes(serachable))
    {
      elemnt=x;
        break;
    }
  }
  const elemToScrollTo = document.getElementById(elemnt.toString());
  if (!!elemToScrollTo) {
    elemToScrollTo.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}



formatTime(timestamp:any) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}-${(d.getMonth()+1)}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  refresh()
  {
    this.setState({signup:false});
    this.setState({add_friend:false});
    this.setState({search:""});
    this.scrollToBottom();
  }

  home()
  {
    this.setState({selected:false,found:false,add_friend:false});
  }

  log_handle()
  {
    this.setState({signup:false});
  }



  async componentDidUpdate(){
    if(this.state.search==""){
     /// const vava:any=this.myRef.current;
    ///  vava.scrollIntoView({behavior: 'smooth', block: 'end'});
      ///setTimeout(() => this.setState({special_mess:null}), 30000);
      if(this.state.selected){
      console.log("matro dhuklam did e"+this.state.friend_key);
      const mmme=this.state.me;
      const dbCon = db.ref("chats").child("chat_details").child(this.state.friend_key);
    dbCon.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
     if(child.val().uid!=mmme){
      child.ref.update(
      {
        status: true
      }
      );
    }
    });
  });
  this.scrollToBottom();

}
  else {console.log("Checking")}
     // catch {}
  }
  }

   handle_chat(e:any)
    {
       tem=unique_key(e.target.id,this.state.me);
       console.log("chating_handle e target"+e.target);
       db.ref("chats").child("chat_details").child(tem).on("value", (snapshot => {
        let chats:any = [];
        snapshot.forEach((snap) => {
          if(snap.val().content!=undefined||snap.val().content!=null)
          chats.push(snap.val());
        });
       // chats.sort(function (a:any, b:any) { return a.timestamp - b.timestamp });
        this.setState({ chats });
       // this.setState({show:true});
       this.scrollToBottom();}));
       this.setState({friend_key:unique_key(e.target.id,this.state.me)});
       this.setState({now_chatting_friend:e.target.id});
       this.setState({selected:true});

       /// set particular friend situation 
       db.ref("chats").child("user_details").child(sizing(e.target.id)).child("log_out").once("value").then((data: { val: () => string; }) => {
        console.log("dekhao to"+data.val());
        this.setState({logout:data.val()});
      });

      db.ref("chats").child("user_details").child(sizing(e.target.id)).child("last_active").once("value").then((data: { val: () => string; }) => {
        console.log("dekhao to"+data.val());
        this.setState({last_active:data.val()});
      });

    }

   

    log_out()
    {
      //// logging out  
      this.setState({found:false});
      this.setState({selected:false});
      this.setState({me:""});
      let my:string=this.state.me;
      console.log(" Eita ami "+my);
      console.log(Date.now());
      db.ref("chats").child("user_details").child(my).child("last_active").set(Date.now());
      db.ref("chats").child("user_details").child(my).child("log_out").set(true);
      swal(
        <div>  
          <p>Succesfully Logging Out</p>
        </div>
            )
    }

    onKeyPressed(event:any) {
      this.setState({
       
      });
    }


    render() 
    {

      let header:any;
      let strng="  active at "+ this.formatTime(this.state.last_active);

      if(!this.state.logout)
      header=<div className="containerrr">
      <p className="i">    {this.state.now_chatting_friend}  is active now  </p>
    </div>; 

    else   header=<div className="containerrr">
      <p className="i">   {this.state.now_chatting_friend} was  {strng}  </p>
    </div>; 

      let friends:any=[];
    
      for(var w=0;w<this.state.chat_friend.length;w++)
      {
        friends[w]=<li id={this.state.chat_friend[w].name} className="container_vau" onClick={this.handle_chat}><img id={this.state.chat_friend[w].name} src={user} alt="Anonymous"/> <p id={this.state.chat_friend[w].name}>{this.state.chat_friend[w].name}</p></li>;
      }

        let friend_list=<div className="in" > <div className="body">
        <input className="inp" name="friend" type="text" onChange={this.handleFriend} placeholder="write your friend's name" value={this.state.friend}/>
        <button style={{borderRadius: '20px'}} onClick={this.submit_friend} >{this.state.add_friend?"Add":"Search friend"}</button> 
      </div></div>;


let log_out=  <button style={{borderRadius: '20px'}} onClick={this.log_out}>Log Out</button> ;
     

let log_inn= <div className="App-header" ><img src={logo} className="App-logo" alt="logo" /><div className="start">

<label htmlFor="uname" className="in"><b>Username</b></label>
<input  style={{borderRadius:'10px'}} type="text" placeholder="Enter Username" name="uname" required onChange={this.handle_me} value={this.state.me}/>

<label htmlFor="psw" className="in"><b>Password</b></label>
<input style={{borderRadius:'10px'}} type="password" placeholder="Enter Password" name="psw" required onChange={this.handle_pass}/>

<div>
<button style={{borderRadius:'30px'}} type="submit" onClick={this.handleSignup} className="in">{this.state.signup?"Sign Up":"Login"}</button>
</div>
{this.state.signup?<p onClick={this.log_handle}>               Have account ?  Log in </p>:null}
</div>
</div>;

      let arr:any=[];
      let str:string;

      for(var i=0;i<this.state.chats.length;i++)
      {

        str=this.state.chats[i].content;
        let main_content= <div id={i.toString()}><li className="other"> <div className="msg">
     <p style={{ color: 'green' }}>  {this.state.chats[i].uid}</p>
      <div className="messge">{this.state.chats[i].content}</div>
       <span className="timeStampRight">{this.formatTime(this.state.chats[i].timestamp)}</span>
     </div>
     </li>
        </div>  ;

       let typing_cntent=<Typewriter
  onInit={(typewriter) => {
  typewriter.typeString(str)
    .callFunction(() => {
      console.log('String typed out!');
    })
    .start();
}}
/>;


      let main_content1=<div id={i.toString()}>
      <li className="self">
     <div className="msg">
    {this.state.chats[i].status==false? <p style={{ color: 'red' }}>  {this.state.chats[i].uid}</p> :<p>  {this.state.chats[i].uid}</p>}
     <div className="messge">{this.state.chats[i].content}</div>
      <span className="timeStampRight">{this.formatTime(this.state.chats[i].timestamp)}</span>
    </div>
    </li>
       </div>;

       let lasting=<div id={i.toString()}><li className="other"> <div className="msg">
       <p style={{ color: 'green' }}>  {this.state.chats[i].uid}</p>
        <div className="messge">{typing_cntent}</div>
         <span className="timeStampRight">{this.formatTime(this.state.chats[i].timestamp)}</span>
       </div>
       </li>
          </div>  ;

             if(i!=this.state.chats.length-1){
          if(this.state.chats[i].uid==this.state.me)
         arr.push( main_content1);

         else  arr.push(main_content);}

         else 
         {
          if(this.state.chats[i].uid==this.state.me)
          arr.push( main_content1);
          else if(this.state.logout)  arr.push(main_content);
          else arr.push(lasting);
         }

      }

      let messenger=<span className="messages">{this.state.special_mess}</span>;
      arr.push(messenger);


      let floats=  <div className="do">
            <img className="round_img" src={down} onClick={this.refresh} />
            <img className="round_img" src={home} onClick={this.home}/>
            <img className="round_img" src={fri} onClick={this.show}/>
            </div>;


      /// last one 

        return (
         <div >
           {!this.state.found?log_inn:null}
           {(this.state.found&&!this.state.selected)?log_out:null}
           {this.state.found && !this.state.selected?<div>{friend_list}</div>:null}
           {this.state.found&&!this.state.selected?floats:null}
           {(this.state.found &&!this.state.selected )?<div className="ulll in"><div><p>Your friends</p></div>{friends}</div>:null}
      
         {this.state.selected? <div className="body" > 
         {(this.state.found&&this.state.selected)?header:null}
         <div className="chatWindow">
           <div className="chat" id="chatList"> 
           {arr} 
           </div> 
           <div className="chatInputWrapper">
           <form className="inputiing" onSubmit={this.handleSubmit}>
  <input
     onKeyDown={event => this.onKeyPressed(event)}
    className="textarea input"
    type="text"
    placeholder="Enter your message..."
    onChange={this.handleChange}
    value={this.state.content}
  />
<button className="sendd" onClick={this.handleSubmit}>Send</button>
</form>
</div>
         
         </div> 

         <div className="inputiing">

</div>
     <div className="friending">
     <input className="inp in" name="friend" type="text" onChange={this.handle_search} placeholder="Search something in chat" />
      <button style={{borderRadius: '20px'}} onClick={this.submit_search} className="in">Search</button> {floats} 

      </div> </div> :null}
      </div>

        )
    }
}

