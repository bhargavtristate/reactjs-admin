import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
var sortType=[0,0];
var sortFieldName=[];
class Categories extends Component {
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
      var manage_access=commonMethods.checkCurrentUriAccess('category_update');
      var manage_access1=commonMethods.checkCurrentUriAccess('offers');
      var manage_access2=commonMethods.checkCurrentUriAccess('sub_categories');
      var admin_info=commonMethods.getAdminInfo();

      this.state = {categories: [],activePage: 1,paginationData:10,totalRecords:0,admin_info:admin_info,searchText:'',management:manage_access,list_offer:manage_access1,list_sub_cat:manage_access2,access_data:access_data};
      this.getCategories = this.getCategories.bind(this);
      this.getCategories();
      
      this.handlePageChange = this._handlePageChange.bind(this);
    }
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
        if(reqData.sortField=='category_name_english')
        {
          reqData.sortType=sortType[0];
        }
        else if(reqData.sortField=='category_name_arabic')
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
    methodInfo.url="/getCategories";
    methodInfo.methodName="post";
    var admin_data=this.state.admin_info;
    reqData.user_id="";
    /*if(admin_data.role_id!=1)
    {
      reqData.user_id=admin_data._id;
    }*/
    
    reqData.paginationData= this.state.paginationData;
    reqData.currentPage= pageNumber;
    //reqData.password= this.state.password;
    var that=this;
    commonMethods.apiCall(methodInfo,reqData,0,function(response){
      //console.log("response data",response.status);
      //console.log("response categories",response.data);
      if(response.status==1)
      {
        that.setState({categories: response.data});
      }
      else
      {
        that.setState({categories: [],totalRecords:0});
        alert(response.message);
      }
    });
    //this.setState({activePage: pageNumber});
  }
  getCategories(param='') {
      var reqData=new Object();
      if (typeof param === 'string') {
              // this is a string
              if(param.trim()!='')
              { 
                
                reqData.sortField=param;
                //console.log("reqData",reqData);
                if(reqData.sortField=='category_name_english')
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
                else if(reqData.sortField=='category_name_arabic')
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
      methodInfo.url="/getCategories";
      methodInfo.methodName="post";
      var admin_data=this.state.admin_info;
      reqData.user_id="";
      /*if(admin_data.role_id!=1)
      {
        reqData.user_id=admin_data._id;
      }*/
      
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
            that.setState({categories: response.data,totalRecords:response.count});
          }
          else
          {
            that.setState({categories: [],totalRecords:0});
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
                <i className="fa fa-align-justify"></i> Categories
              </div>
              <div className="row">
                <div className="col-sm-0 col-md-6"></div>
                <div className="search-box  col-sm-12 col-md-6 mt-4">
                  <div className="input-group">
                    <div className="rightsearchBox">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getCategories.bind(this,this.state)}>Search</button></span>
                    </div>
                    { ((this.state.access_data==2) || (this.state.management!=0)) && <Link to={'/category_update'}  className="btn btn-sm btn-success ml-2 pull-right mr-3"><i className="fa fa-plus fa-lg mr-1"></i>Add Category</Link>}
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getCategories.bind(this,'category_name_english')} className="haveSorting">Name English <i className="fa fa-sort"></i></th>
                      <th>Name Arabic</th>
                      <th>Image</th>
                      { ((this.state.access_data==2) || (this.state.management!=0 || this.state.list_offer!=0 || this.state.list_sub_cat!=0)) && <th>Action</th> }
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.categories.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} stateData={states} />)}
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
            <td>{this.props.data.category_name_english}</td>
            <td>{this.props.data.category_name_arabic}</td>
            <td className="cate-image-bg"><img src={commonMethods.categoryImageBaseUri+this.props.data.category_image} /></td>
            { (this.props.stateData.management!=0 || this.props.stateData.list_offer!=0 || this.props.stateData.list_sub_cat!=0) &&
            <td>
              { ((this.props.stateData.access_data==2 && this.props.stateData.management!=0) || (this.props.stateData.management!=0 && this.props.data.admin_id==this.props.stateData.admin_info._id)) && <Link to={'/category_update?_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-edit"></i> Edit </Link>}
              { this.props.stateData.list_offer!=0 && <Link to={'/categories_management/offers?category_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-external-link"></i> Go to Offers </Link>}
              { this.props.stateData.list_sub_cat!=0 && <Link to={'/categories_management/sub_categories?category_id='+this.props.data._id} className="btn btn-sm btn-primary mr-2" activeClassName="active"><i className="fa fa-external-link"></i> Sub-Categories</Link>}
            </td>
            }
         </tr>
      );
   }
}

export default Categories;
