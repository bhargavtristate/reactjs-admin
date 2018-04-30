import React, { Component } from 'react';
import md5 from 'md5'; 
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

class Login extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(checkLoginResponse)
    {
      hashHistory.push('/dashboard');
    }
    else
    {
      hashHistory.push('/pages/login');
    }
    this.state = {email: '',password:'',messages:''};
    this.checkLogin = this.checkLogin.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);


  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.checkLogin();
    }
  }
  handleEmailChange(e) {
   this.setState({email: e.target.value});

  }
  handlePasswordChange(e) {
     this.setState({password: e.target.value});
  }

  checkLogin() {
    if(this.state.email.trim()=="")
    {
      //alert("Please enter email id.");
      this.setState({messages:'Please enter email id'});
      return false;
    }
    else if(this.state.email.trim()!="")
    {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(this.state.email))
      {
        this.setState({messages:'Please enter valid email id'});
        //alert("Please enter valid email id.");
        return false;
      }
    }
    if(this.state.password=='')
    {
      //alert("Please enter password.");
      this.setState({messages:'Please enter password'});
      return false;
    }
    else
    {
      //console.log("EMail: " + this.state.email);
      this.state.password=md5(this.state.password)
      //console.log("Password: " + this.state.password);

      var methodInfo=new Object();
      methodInfo.url="/checkAdminLogin";
      methodInfo.methodName="post";
      var reqData=new Object();
      reqData.email= this.state.email;
      reqData.password= this.state.password;
      this.state.password='';
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response)
      {
        //console.log("response data",response.status);
        that.setState({messages:response.message});
        if(response.status==1)
        {

          //$scope.inValidUser =1 ;
          //$scope.login_message = response.message;
          commonMethods.setLogin(response.data[0]);
          //hashHistory.push('/dashboard');
          hashHistory.push('/dashboard');
          //$location.path('list.users');
        }
        /*else
        {
          //alert(response.message);
          //$scope.inValidUser =2 ;
          //$scope.login_message = response.message;
        }*/
      });
    }
    
  }
  render() {
    const messages = this.state.messages;
    //console.log("messages",messages);
    let messageBox = null;
    if (messages!='')
    {
      messageBox = <div className="alert alert-info">{messages}</div>
    } 
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card-group mb-0">
              <div className="card p-4">
                <div className="card-block">
                  <h1>Login</h1>
                  {/*<p className="text-muted">Sign In to your account</p>*/}
                  {messageBox}
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-user"></i></span>
                    <input type="text" className="form-control" value={this.state.email} onChange={this.handleEmailChange.bind(this)} onKeyPress={this.handleKeyPress} placeholder="Email"/>
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input type="password" className="form-control" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} onKeyPress={this.handleKeyPress} placeholder="Password"/>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <button type="button" onClick={this.checkLogin} className="btn btn-primary px-4 login-btn">Login</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
