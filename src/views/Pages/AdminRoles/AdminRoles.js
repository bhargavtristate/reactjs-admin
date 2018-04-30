import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
import $ from 'jquery'; 
var sortType=[0,0];
var sortFieldName=[];
class AdminRoles extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("path",this.props.location.pathname);
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
    this.state = {admins: [],activePage: 1,paginationData:10,totalRecords:0,searchText:''};
    this.getAdmins = this.getAdmins.bind(this);
    this.getAdmins();
    
    this.handlePageChange = this._handlePageChange.bind(this);
  }
  handleSearchChange(e) {
   this.setState({searchText: e.target.value});
  }
  _handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
    var reqData=new Object();
      // this is a string
      if(sortFieldName.length>0)
      { 
        reqData.sortField=sortFieldName[0];
        //console.log("reqData",reqData);
        if(reqData.sortField=='role_name')
        {
          reqData.sortType=sortType[0];
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
    methodInfo.url="/get-admin-roles";
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
                if(reqData.sortField=='role_name')
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
      methodInfo.url="/get-admin-roles";
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
  render() {
    return (
      <div className="animated fadeInRight">
        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i> Admin Roles Management 
              </div>
              <div className="row">
                <div className="col-md-4"></div>
                <div className="search-box col-md-8 mt-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getAdmins.bind(this,this.state)}>Search</button></span>
                    <Link to={'/admin_roles_management'}  className="btn btn-sm btn-success ml-2 pull-right mr-3"><i className="fa fa-plus fa-lg mr-1"></i>Add Roles</Link>
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getAdmins.bind(this,'role_name')} className="haveSorting">Role Name <i className="fa fa-sort"></i></th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.admins.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} self={this} />)}
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
            <td>{this.props.data.role_name}</td>
            <td>
            <Link to={'/admin_roles_management?_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-edit"></i> Edit </Link>
            <Link to={'/admin_roles/admins?role_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-external-link"></i> Go to Admins </Link>
            </td>
         </tr>
      );
   }
}

export default AdminRoles;
