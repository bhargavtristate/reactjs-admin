import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import md5 from 'md5'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';

class AdminRolesManagement extends Component {
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
    var role_id='';
    if(typeof this.props.location.query._id !='undefined')
    {
      //console.log("inside");
      role_id=this.props.location.query._id;
      this.getAdminRoleDetail(role_id);
    }
    
    this.state = {messages:'',role_id:role_id,role_name:''};
    
    this.updateAdminRoles = this.updateAdminRoles.bind(this);
    //this.getCategories();
    //console.log("this.props",this.props.location.query);
      /*var that=this;
      $("input.permission_box").each(function() {
          var name=$(this).data('key');
          that.setState({[name]:0});
      });*/
  }
  
  handleFieldChanged(field) {
    return (e) => {
      this.setState({[field]:e.target.value});
    };
  }
  handleCheckboxChanged(field) {
    return (e) => {
      this.setState({[field]:e.target.checked});
    };
  }
  getAdminRoleDetail(role_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.id= role_id;
      var methodInfo=new Object();
      methodInfo.url="/get-admin-role-detail";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            that.setState({role_name:response.data[0]['role_name']});
            for(var i=0;i<response.data[0]['permissions'].length;i++)
            {
              that.setState({[response.data[0]['permissions'][i]['name']]:response.data[0]['permissions'][i]['value']});
            }
          }
          else
          {
            alert(response.message);
            hashHistory.push('/admin_roles');
          }
          console.log("State",that.state);
      });
  }
  updateAdminRoles() {
      //console.log("state",this.state);
     
      if(this.state.role_name=='')
      {
        this.setState({messages: "Role Name Required"});
        return false;
      }
      var permissions=[];
      $("input.permission_box").each(function() {
          var name=$(this).data('key');
          var permission=0;
            if($(this).is(":checked")){
              var permission=1;
            }
          permissions.push({name:name,value:permission});
      });
     // console.log("selected_sub_speciality",this.state);
     // console.log("legth",this.state.selected_sub_speciality.length);
      var reqData=new Object();
      reqData.role_name= this.state.role_name;
      reqData.id= this.state.role_id;
      reqData.permissions= permissions;

      var methodInfo=new Object();
      methodInfo.url="/update-admin-roles";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/admin_roles');
          }
      });
  }
  addAdminRoles() {
      
      if(this.state.role_name=='')
      {
        this.setState({messages: "Role Name Required"});
        return false;
      }
      var permissions=[];
      $("input.permission_box").each(function() {
          var name=$(this).data('key');
          var permission=0;
            if($(this).is(":checked")){
              var permission=1;
            }
          permissions.push({name:name,value:permission});
      });
      //console.log("permissions",permissions);
      var reqData=new Object();
          //console.log("imageData",imageData);
      reqData.role_name= this.state.role_name;
      reqData.permissions= permissions;
      var methodInfo=new Object();
      methodInfo.url="/add-admin-roles";
      methodInfo.methodName="post";
       
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
      //console.log("response data",response.status);
      //console.log("response categories",response.data);
        alert(response.message);
        if(response.status==1)
        {
          hashHistory.push('/admin_roles');
        }
        
      });
      
  }
 
  render() {
    //console.log("states",this.state);
    const messages = this.state.messages;
    const role_id = this.state.role_id;
    return (
      <div className="row">
          <div className="col-md-12">
            <div className="card">
            <form method="post" encType="multipart/form-data">
              <div className="card-block">
                  {messages !='' &&
                    <div className="alert alert-danger">{messages}</div>
                  }
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Role Name</label>
                    <div className="col-md-5">
                      <input type="text" name="text-input" className="form-control" placeholder="Role Name" onChange={this.handleFieldChanged("role_name")} value={this.state.role_name}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Permisssions</label>
                    <div className="col-md-9">
                      <table className="permission_list">
                        <tr>
                          <td><label>Categories List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="categories_management" checked={this.state.categories_management} onChange={this.handleCheckboxChanged("categories_management")} value={this.state.categories_management}/></td>
                          <td><label>Categories Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="category_update" checked={this.state.category_update} onChange={this.handleCheckboxChanged("category_update")} value={this.state.category_update}/></td>
                        </tr>
                        <tr>
                          <td><label>Offers List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="offers" checked={this.state.offers} onChange={this.handleCheckboxChanged("offers")} value={this.state.offers}/></td>
                          <td><label>Offers Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="offer_management" checked={this.state.offer_management} onChange={this.handleCheckboxChanged("offer_management")} value={this.state.offer_management}/></td>
                        </tr>
                        <tr>
                          <td><label>Sub-Categories List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="sub_categories" checked={this.state.sub_categories} onChange={this.handleCheckboxChanged("sub_categories")} value={this.state.sub_categories}/></td>
                          <td><label>Sub-Categories Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="sub_categories_management" checked={this.state.sub_categories_management} onChange={this.handleCheckboxChanged("sub_categories_management")} value={this.state.sub_categories_management}/></td>
                        </tr>
                        <tr>
                          <td><label>Admin & Roles List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="admin_roles" checked={this.state.admin_roles} onChange={this.handleCheckboxChanged("admin_roles")} value={this.state.admin_roles}/></td>
                          <td><label>Admin & Roles Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="admin_roles_management" checked={this.state.admin_roles_management} onChange={this.handleCheckboxChanged("admin_roles_management")} value={this.state.admin_roles_management}/></td>
                        </tr>
                        <tr>
                          <td><label>Admins List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="admins" checked={this.state.admins} onChange={this.handleCheckboxChanged("admins")} value={this.state.admins}/></td>
                          <td><label>Admin Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="admin_management" checked={this.state.admin_management} onChange={this.handleCheckboxChanged("admin_management")} value={this.state.admin_management}/></td>
                        </tr>
                        <tr>  
                          <td><label>Users List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="users" checked={this.state.users} onChange={this.handleCheckboxChanged("users")} value={this.state.users}/></td>
                          <td><label>Users Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="user_update" checked={this.state.user_update} onChange={this.handleCheckboxChanged("user_update")} value={this.state.user_update}/></td>
                        </tr>
                        <tr>
                          <td><label>Taskers List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="taskers" checked={this.state.taskers} onChange={this.handleCheckboxChanged("taskers")} value={this.state.taskers}/></td>
                          <td><label>Taskers Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="tasker_update" checked={this.state.tasker_update} onChange={this.handleCheckboxChanged("tasker_update")} value={this.state.tasker_update}/></td>
                        </tr>
                        <tr>
                          <td><label>Complain List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="complain_list" checked={this.state.complain_list} onChange={this.handleCheckboxChanged("complain_list")} value={this.state.complain_list}/></td>
                          <td><label>Complain Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="complain_management" checked={this.state.complain_management} onChange={this.handleCheckboxChanged("complain_management")} value={this.state.complain_management}/></td>
                        </tr>
                        <tr>
                          <td><label>Tasks List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="tasks" checked={this.state.tasks} onChange={this.handleCheckboxChanged("tasks")} value={this.state.tasks}/></td>
                          <td><label>Global setting Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="global_settings" checked={this.state.global_settings} onChange={this.handleCheckboxChanged("global_settings")} value={this.state.global_settings}/></td>
                          {/*<td><label>Tasks Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="tasks_management" checked={this.state.tasks_management} onChange={this.handleCheckboxChanged("tasks_management")} value={this.state.tasks_management}/></td>*/}
                        </tr>
                        <tr>
                          <td><label>Payment List</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="payment_list" checked={this.state.payment_list} onChange={this.handleCheckboxChanged("payment_list")} value={this.state.payment_list}/></td>
                          <td><label>Payment Management</label></td>
                          <td><input type="checkbox"  className="mr-5 permission_box" data-key="payment_management" checked={this.state.payment_management} onChange={this.handleCheckboxChanged("payment_management")} value={this.state.payment_management}/></td>
                        </tr>
                      </table>
                    </div>
                  </div>
              </div>
              <div className="card-footer">
                  {role_id !='' &&
                    <button type="button" onClick={this.updateAdminRoles.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                  {role_id =='' &&
                    <button type="button" onClick={this.addAdminRoles.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                  }
                <Link to={'/admin_roles'} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default AdminRolesManagement;
