import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
import $ from 'jquery'; 
var sortType=[0,0];
var sortFieldName=[];
class Admins extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
      return false;
      //hashHistory.push('/categories_management');
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
    if(typeof this.props.location.query.role_id !='undefined')
    {
      //console.log("inside");
      role_id=this.props.location.query.role_id;
    }

    this.state = {admins: [],activePage: 1,paginationData:10,totalRecords:0,searchText:'',role_id:role_id};
    this.getAdmins = this.getAdmins.bind(this);
    this.getAdmins();
    
    this.handlePageChange = this._handlePageChange.bind(this);
  }
  handleSearchChange(e) {
   this.setState({searchText: e.target.value});
  }
  _handlePageChange(pageNumber) {
    //console.log('active page is',pageNumber);
    this.setState({activePage: pageNumber});
    var reqData=new Object();
    //console.log("sort type",sortType);
        // this is a string
      if(sortFieldName.length>0)
      { 
        reqData.sortField=sortFieldName[0];
        //console.log("reqData",reqData);
        if(reqData.sortField=='fullname')
        {
          reqData.sortType=sortType[0];
        }
        else if(reqData.sortField=='email')
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
    reqData.role_id=this.state.role_id;
    var methodInfo=new Object();
    methodInfo.url="/get-admins";
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
        that.setState({admins: response.data});
      }
      else
      {
        that.setState({admins: [],totalRecords:0});
        alert(response.message);
      }
    });
    //this.setState({activePage: pageNumber});
  }
  getAdmins(param='') {
      //console.log("param",param);
      var reqData=new Object();
      if (typeof param === 'string') {
              // this is a string
              if(param.trim()!='')
              { 
                
                reqData.sortField=param;
                //console.log("reqData",reqData);
                if(reqData.sortField=='fullname')
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
                else if(reqData.sortField=='email')
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
      reqData.role_id=this.state.role_id;
      var methodInfo=new Object();
      methodInfo.url="/get-admins";
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
            that.setState({admins: response.data,totalRecords:response.count});
          }
          else
          {
            that.setState({admins: [],totalRecords:0});
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
    reqData.user_type=2;

    var methodInfo=new Object();
    methodInfo.url="/block-unblock-admins";
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
  render() {
    var states=this.state;
    return (
      <div className="animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i> Admin Roles Management 
              </div>
              <div className="row">
                <div className="col-md-7"></div>
                <div className="search-box col-md-5 mt-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getAdmins.bind(this,this.state)}>Search</button></span>
                    <Link to={'/admin_roles/admin_management?role_id='+this.state.role_id}  className="btn btn-sm btn-success ml-2 pull-right mr-3"><i className="fa fa-plus fa-lg mr-1"></i>Add Admin</Link>
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getAdmins.bind(this,'fullname')} className="haveSorting">Fullname <i className="fa fa-sort"></i></th>
                      {/*<th>Username</th>*/}
                      <th onClick={this.getAdmins.bind(this,'email')} className="haveSorting">Email <i className="fa fa-sort"></i></th>
                      <th>Role</th>
                      <th>Is Blocked</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {  this.state.admins.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} self={this} states={states} />)}
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
            <td>{this.props.data.fullname}</td>
            {/*<td>{this.props.data.username}</td>*/}
            <td>{this.props.data.email}</td>
            <td>{this.props.data.role_id.role_name}</td>
            <td className="text-center"><input type="checkbox" className="block_box"  checked={this.props.data.is_blocked} onClick={this.props.self.blockUnblock.bind(this.props.self,this.props.data._id)} /></td>
            <td>
            <Link to={'/admin_roles/admin_management?role_id='+this.props.states.role_id+'&_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-edit"></i> Edit </Link>
            </td>
         </tr>
      );
   }
}

export default Admins;
