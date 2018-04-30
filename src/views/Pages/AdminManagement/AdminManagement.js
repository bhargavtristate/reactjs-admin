import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import md5 from 'md5'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';

class AdminManagement extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
    }
    else
    {
      var access_data=commonMethods.checkCurrentUriAccess(this.props.location.pathname);
      if(access_data!=2)
      {
        hashHistory.push('/dashboard');
      }
    }
    var admin_id='';
    var role_id='';
    if(typeof this.props.location.query._id !='undefined')
    {
      //console.log("inside");
      admin_id=this.props.location.query._id;
      this.getAdminDetail(admin_id);
    }
    if(typeof this.props.location.query.role_id !='undefined')
    {
      //console.log("inside");
      role_id=this.props.location.query.role_id;
    }
    
    this.state = {messages:'',admin_id:admin_id,fullname:'',username:'',email:'',role_id:role_id,password:''};
    
    this.updateAdmin = this.updateAdmin.bind(this);
    //this.getCategories();
    //console.log("this.props",this.props.location.query);
    
  }
  
  handleFieldChanged(field) {
    return (e) => {
      this.setState({[field]:e.target.value});
    };
  }
  getAdminDetail(tasker_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.id= tasker_id;
      var methodInfo=new Object();
      methodInfo.url="/get-admin-detail";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            //console.log("selected date",Math.round(new Date(response.data[0].birth_date).getTime()));
            //$('#file-input').val(response.data[0].category_image);
            //that.setState({all_categories:response.categories});
            that.setState({ fullname: response.data[0].fullname,
                            /*username: response.data[0].username,*/
                            role_id: response.data[0].role_id,
                            email: response.data[0].email,
                            password: ''});
          }
          else
          {
            alert(response.message);
            hashHistory.push('/admin_roles/admins');
          }
      });
  }
  updateAdmin() {
      //console.log("state",this.state);
     
      if(this.state.fullname=='')
      {
        this.setState({messages: "Fullname Required"});
        return false;
      }
      else if(this.state.email=='')
      {
        this.setState({messages: "Email Required"});
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
     // console.log("selected_sub_speciality",this.state);
     // console.log("legth",this.state.selected_sub_speciality.length);
      var reqData=new Object();
      reqData.fullname= this.state.fullname;
      reqData.username= this.state.username;
      reqData.email= this.state.email;
      if(this.state.password!='')
      {
        reqData.password= md5(this.state.password);
      }
      reqData.id= this.state.admin_id;

      var methodInfo=new Object();
      methodInfo.url="/update-admin";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/admin_roles/admins?role_id='+that.state.role_id);
          }
      });
  }
  addAdmin() {
      
      if(this.state.fullname=='')
      {
        this.setState({messages: "fullname Required"});
        return false;
      }
      else if(this.state.email=='')
      {
        this.setState({messages: "Email Required"});
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
        this.setState({messages: "Password Required"});
        return false;
      }


      var reqData=new Object();
      //console.log("imageData",imageData);
      /*reqData.username= this.state.username;*/
      reqData.fullname= this.state.fullname;
      reqData.password= md5(this.state.password);
      reqData.email= this.state.email;
      reqData.role_id= this.state.role_id;
      var methodInfo=new Object();
      methodInfo.url="/add-admin";
      methodInfo.methodName="post";
       
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
      //console.log("response data",response.status);
      //console.log("response categories",response.data);
        alert(response.message);
        if(response.status==1)
        {
          hashHistory.push('/admin_roles/admins?role_id='+that.state.role_id);
        }
        
      });
      
  }
 
  render() {
    //console.log("states",this.state);
    const messages = this.state.messages;
    const admin_id = this.state.admin_id;
    return (
      <div className="row">
          <div className="col-md-8">
            <div className="card">
            <form method="post" encType="multipart/form-data">
              <div className="card-block">
                  {messages !='' &&
                    <div className="alert alert-danger">{messages}</div>
                  }
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Fullname</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Fullname" onChange={this.handleFieldChanged("fullname")} value={this.state.fullname}/>
                    </div>
                  </div>
                 {/* <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Username</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Username" onChange={this.handleFieldChanged("username")} value={this.state.username}/>
                    </div>
                  </div>*/}
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Email</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Email" onChange={this.handleFieldChanged("email")} value={this.state.email}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Password</label>
                    <div className="col-md-9">
                      <input type="password" name="text-input" className="form-control" placeholder="Password" onChange={this.handleFieldChanged("password")} value={this.state.password}/>
                    </div>
                  </div>
              </div>
              <div className="card-footer">
                  {admin_id !='' &&
                    <button type="button" onClick={this.updateAdmin.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                  {admin_id =='' &&
                    <button type="button" onClick={this.addAdmin.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                  }
                  <Link to={'/admin_roles/admins?role_id='+this.state.role_id} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default AdminManagement;
