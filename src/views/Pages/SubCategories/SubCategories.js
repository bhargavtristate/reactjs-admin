import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
import Timestamp from 'react-timestamp';
var sortType=[0,0];
var sortFieldName=[];
class SubCategories extends Component {
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
      var access_data=commonMethods.checkCurrentUriAccess(this.props.location.pathname);
      if(access_data==0)
      {
        hashHistory.push('/dashboard');
      }
      var manage_access=commonMethods.checkCurrentUriAccess('offer_management');
    
      var admin_info=commonMethods.getAdminInfo();
      if(typeof this.props.location.query.category_id !='undefined')
      {
        var category_id=this.props.location.query.category_id;
      }
      this.state = {subCategories: [],activePage: 1,paginationData:10,totalRecords:0,searchText:'',admin_info:admin_info,category_id:category_id,management:manage_access,access_data:access_data};
      //console.log("states",this.state);
      this.getSubCategories = this.getSubCategories.bind(this);
      this.getSubCategories();
      
      this.handlePageChange = this._handlePageChange.bind(this);
      //console.log("admin data",commonMethods.getAdminInfo());
    }
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
        if(reqData.sortField=='sub_category_english')
        {
          reqData.sortType=sortType[0];
        }
        else if(reqData.sortField=='sub_category_arabic')
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
      if(this.state.category_id!='')
      {
        var admin_data=this.state.admin_info;
        reqData.user_id="";
        /*if(admin_data.role_id!=1)
        {
          reqData.user_id=admin_data._id;
        }
        else
        {
          reqData.user_id="";
        }*/
        reqData.category_id=this.state.category_id;
        var methodInfo=new Object();
        methodInfo.url="/get-category-wise-sub-categories";
        methodInfo.methodName="post";
        var admin_data=this.state.admin_info;
        if(admin_data.role_id!=1)
        {
          reqData.user_id=admin_data._id;
        }
        else
        {
          reqData.user_id="";
        }
        reqData.paginationData= this.state.paginationData;
        reqData.currentPage= pageNumber;
        //reqData.password= this.state.password;
        var that=this;
        commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response data",response.status);
            //console.log("response categories",response.data[0]['discount_and_subCategories']);
            if(response.status==1)
            {
              that.setState({subCategories: response.data,totalRecords:response.count});
            }
            else
            {
              that.setState({subCategories: [],totalRecords:0});
              alert(response.message);
            }
        });
      }
    //this.setState({activePage: pageNumber});
  }
  getSubCategories(param='') {
     
      //console.log("param",param);
      //console.log("state",this.state);
      var reqData=new Object();
      if (typeof param === 'string') {
              // this is a string
              if(param.trim()!='')
              { 
                
                reqData.sortField=param;
                //console.log("reqData",reqData);
                if(reqData.sortField=='sub_category_english')
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
                else if(reqData.sortField=='sub_category_arabic')
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
      if(this.state.category_id!='')
      {
        var admin_data=this.state.admin_info;
        reqData.user_id="";
        /*if(admin_data.role_id!=1)
        {
          reqData.user_id=admin_data.category_id;
        }
        else
        {
          reqData.user_id="";
        }*/
        reqData.category_id=this.state.category_id;
        var methodInfo=new Object();
        methodInfo.url="/get-category-wise-sub-categories";
        methodInfo.methodName="post";
        var admin_data=this.state.admin_info;
        if(admin_data.role_id!=1)
        {
          reqData.user_id=admin_data._id;
        }
        else
        {
          reqData.user_id="";
        }
        reqData.paginationData= this.state.paginationData;
        reqData.currentPage= 1;
        this.setState({activePage: 1});
        //reqData.password= this.state.password;
        var that=this;
        commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response data",response.status);
            //console.log("response categories",response.data[0]['discount_and_subCategories']);
            if(response.status==1)
            {
              that.setState({subCategories: response.data,category_name:response.category_name,totalRecords:response.count});
            }
            else
            {
              that.setState({subCategories: [],totalRecords:0,category_name:response.category_name});
              alert(response.message);
              if("is_out" in response && response.is_out==1)
              {
                hashHistory.push('/categories_management');
              }
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
                <i className="fa fa-align-justify"></i>Sub-Categories of <strong>{this.state.category_name}</strong> Category
              </div>
              <div className="row">
                <div className="col-md-8"></div>
                <div className="search-box col-md-4 mt-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getSubCategories.bind(this,this.state)}>Search</button></span>
                    { ((this.state.access_data==2) || (this.state.management!=0)) && <Link to={'/categories_management/sub_categories_management?category_id='+this.state.category_id}  className="btn btn-sm btn-success ml-2 pull-right mr-3"><i className="fa fa-plus fa-lg mr-1"></i>Add Sub-Category</Link>}
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getSubCategories.bind(this,'sub_category_english')} className="haveSorting">English Name <i className="fa fa-sort"></i></th>
                      <th className="haveSorting">Arabic Name</th>
                      { ((this.state.access_data==2) || (this.state.management!=0)) && <th>Action</th> }
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.subCategories.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} category_id={this.state.category_id} stateData={states} />)}
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
            <td>{this.props.data.sub_category_english}</td>
            <td>{this.props.data.sub_category_arabic}</td>
            { (this.props.stateData.management!=0 || this.props.stateData.access_data==2) && <td> { ((this.props.stateData.access_data==2) || (this.props.stateData.management!=0 && this.props.data.admin_id==this.props.stateData.admin_info._id)) && <Link to={'/categories_management/sub_categories_management?sub_category_id='+this.props.data._id+'&category_id='+this.props.category_id} className="btn btn-primary mr-2" activeClassName="active"><i className="icon-pencil"></i> Edit </Link>}</td>}
         </tr>
      );
   }
}

export default SubCategories;
