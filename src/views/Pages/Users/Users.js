import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
import $ from 'jquery'; 
var sortType=[0,0];
var sortFieldName=[];
class Users extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
      //hashHistory.push('/categories_management');
    }
    else
    {
      //hashHistory.push('/');
      var access_data=commonMethods.checkCurrentUriAccess(this.props.location.pathname);
      if(access_data==0)
      {
        hashHistory.push('/dashboard');
      }
      var manage_access=commonMethods.checkCurrentUriAccess('user_update');
      //console.log("manage_access",manage_access);
      /*if(access_data==0)
      {
        hashHistory.push('/dashboard');
      }*/
    }
    this.state = {taskers: [],activePage: 1,paginationData:10,totalRecords:0,searchText:'',management:manage_access};
    this.getUsers = this.getUsers.bind(this);
    this.getUsers();
    
    this.handlePageChange = this._handlePageChange.bind(this);
  }
  handleSearchChange(e) {
   this.setState({searchText: e.target.value});
  }
  _handlePageChange(pageNumber) {
    console.log('active page is',pageNumber);
    this.setState({activePage: pageNumber});
    var reqData=new Object();
    console.log("sort type",sortType);
        // this is a string
      if(sortFieldName.length>0)
      { 
        reqData.sortField=sortFieldName[0];
        //console.log("reqData",reqData);
        if(reqData.sortField=='first_name')
        {
          reqData.sortType=sortType[0];
        }
        else if(reqData.sortField=='last_name')
        {
          reqData.sortType=sortType[1];
        }
      }
      else
      {
        reqData.sortField='created_date';
        reqData.sortType=-1;
      }
    //console.log("not search",$scope.searchData);
    if( typeof this.state.searchText !=='undefined' && this.state.searchText.trim()!='' )
    {
      reqData.searchText=this.state.searchText;
    }
    var methodInfo=new Object();
    methodInfo.url="/getUsers";
    methodInfo.methodName="post";
    reqData.paginationData= this.state.paginationData;
    reqData.currentPage= pageNumber;
    //reqData.password= this.state.password;
    var that=this;
    commonMethods.apiCall(methodInfo,reqData,0,function(response){
      //console.log("response data",response.status);
      //console.log("response categories",response.data);
      if(response.status==1)
      {
        that.setState({taskers: response.data});
      }
      else
      {
        that.setState({taskers: [],totalRecords:0});
        alert(response.message);
      }
    });
    //this.setState({activePage: pageNumber});
  }
  getUsers(param='') {
      //console.log("param",param);
      var reqData=new Object();
      if (typeof param === 'string') {
              // this is a string
              if(param.trim()!='')
              { 
                
                reqData.sortField=param;
                //console.log("reqData",reqData);
                if(reqData.sortField=='first_name')
                {
                  sortFieldName=[];
                  sortFieldName.push(reqData.sortField);
                  if(sortType[0]==0)
                  {
                    sortType=[1,0];
                    reqData.sortType=sortType[0];
                  }
                  else if(sortType[0]==1)
                  {
                    sortType=[-1,0];
                    reqData.sortType=sortType[0];
                  }
                  else if(sortType[0]==-1)
                  {
                    sortType=[1,0];
                    reqData.sortType=sortType[0];
                  }
                }
                else if(reqData.sortField=='last_name')
                {
                  sortFieldName=[];
                  sortFieldName.push(reqData.sortField);
                  if(sortType[1]==0)
                  {
                    sortType=[0,1];
                    reqData.sortType=sortType[1];
                  }
                  else if(sortType[1]==1)
                  {
                    sortType=[0,-1];
                    reqData.sortType=sortType[1];
                  }
                  else if(sortType[1]==-1)
                  {
                    sortType=[0,1];
                    reqData.sortType=sortType[1];
                  }
                }
              }
              else
              {
                reqData.sortField='created_date';
                reqData.sortType=-1;
              }
      }
      if(param.searchText!='' && typeof param.searchText !=='undefined')
      {
        reqData.searchText=param.searchText;
      }
      var methodInfo=new Object();
      methodInfo.url="/getUsers";
      methodInfo.methodName="post";
      
      reqData.paginationData= this.state.paginationData;
      reqData.currentPage= 1;
      this.setState({activePage: 1});
      //reqData.password= this.state.password;
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          if(response.status==1)
          {
            that.setState({taskers: response.data,totalRecords:response.count});
          }
          else
          {
            that.setState({taskers: [],totalRecords:0});
            alert(response.message);
          }
      });
  }
  blockUnblock(user_id,e){    
    //console.log("user_id",user_id);
    //var is_block=0;
    //console.log("e",e);
    var self=e.target;
    if($(e.target).is(":checked")){
        var is_block=1;
    }
    else if($(e.target).is(":not(:checked)")){
      var is_block=0;
    }
    var reqData=new Object();
    reqData.id=user_id;
    reqData.is_blocked=is_block;
    reqData.user_type=1;

    var methodInfo=new Object();
    methodInfo.url="/block-unblock";
    methodInfo.methodName="post";
    //reqData.password= this.state.password;
    var that=this;
    commonMethods.apiCall(methodInfo,reqData,0,function(response){
      //console.log("response data",response.status);
      //console.log("response categories",response.data);
      if(response.status==1)
      {
        if(reqData.is_blocked==1)
        {
          $(self).prop('checked', true);
        }
        else if(reqData.is_blocked==0)
        {
           $(self).prop('checked', false);
        }
        alert(response.message);
        //Router.reload();
        /*Router.refresh();*/
        //window.location.reload();
      }
      else
      {
        alert(response.message);
      }
    });
  }
  deleteUser(user_id,e){
    if (confirm("Are you sure, you want to delete this user!") == true) {
        var reqData=new Object();
        reqData.id=user_id;
        reqData.user_type=1;

        var methodInfo=new Object();
        methodInfo.url="/delete-user";
        methodInfo.methodName="post";
        //reqData.password= this.state.password;
        var that=this;
        commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response data",response.status);
          //console.log("response categories",response.data);
          if(response.status==1)
          {
            alert(response.message);
            that.getUsers();
          }
          else
          {
            alert(response.message);
          }
        });
    }
  }
  render() {
    var states=this.state;
    return (
      <div className="animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i> Users
              </div>
              <div className="row">
                <div className="col-md-8"></div>
                <div className="search-box col-md-4 mt-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getUsers.bind(this,this.state)}>Search</button></span>
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getUsers.bind(this,'first_name')} className="haveSorting">First Name <i className="fa fa-sort"></i></th>
                      <th onClick={this.getUsers.bind(this,'last_name')} className="haveSorting">Last Name <i className="fa fa-sort"></i></th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Is Blocked</th>
                      {this.state.management!=0 && <th>Action</th> }
                      
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.taskers.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} self={this} stateData={states} />)}
                  </tbody>
                </table>
                <div className="pagination">
                  <Pagination 
                    activePage={this.state.activePage} 
                    itemsCountPerPage={this.state.paginationData} 
                    totalItemsCount={this.state.totalRecords} 
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}
class TableRow extends Component {
   render() {
      return (
         <tr>
            <td>{this.props.index}</td>
            <td>{this.props.data.first_name}</td>
            <td>{this.props.data.last_name}</td>
            <td>{this.props.data.email}</td>
            <td>{this.props.data.phone_no}</td>
            <td><input type="checkbox" className="block_box"  checked={this.props.data.is_blocked} onClick={this.props.self.blockUnblock.bind(this.props.self,this.props.data._id)} /></td>
            { this.props.stateData.management!=0 &&  
              <td>
              <Link to={'/user_update?_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-edit"></i> Edit </Link>
              <a  href="javascript:void(0);" className="btn btn-sm btn-primary mr-2" onClick={this.props.self.deleteUser.bind(this.props.self,this.props.data._id)}><i className="fa fa-trash"></i> Delete</a>
              </td>
            }
           
         </tr>
      );
   }
}

export default Users;
