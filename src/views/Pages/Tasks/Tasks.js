import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import ReactDOM from "react-dom";
import Pagination from "react-js-simple-pagination";
import Lightbox from 'react-image-lightbox';
import Timestamp from 'react-timestamp';
import $ from 'jquery'; 
var sortType=[0,0];
var sortFieldName=[];
class Tasks extends Component {
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
    }
    this.state = {task_status:0,tasks: [],activePage: 1,paginationData:10,totalRecords:0,searchText:'',photoIndex: 0,isOpen: false};
            
    this.getTasks = this.getTasks.bind(this);
    this.getTasks();
    
    this.handlePageChange = this._handlePageChange.bind(this);
  }
  handleFieldChanged(field) {
    return (e) => {
      //console.log("value",e.target.value);
      this.setState({[field]:e.target.value});
      //console.log("state in change",this.state);
      if([field]=="task_status")
      {
        this.getTasks({[field]:e.target.value});
        this.setState({searchText:''});

      }
    };
  }
  handleSearchChange(e) {
   this.setState({searchText: e.target.value});
  }
  _handlePageChange(pageNumber) {
    //console.log('active page is',pageNumber);
    this.setState({activePage: pageNumber});
    var reqData=new Object();
    console.log("sort type",sortType);
        // this is a string
      if(sortFieldName.length>0)
      { 
        reqData.sortField=sortFieldName[0];
        //console.log("reqData",reqData);
        if(reqData.sortField=='task_title')
        {
          reqData.sortType=sortType[0];
        }
        else if(reqData.sortField=='created_date')
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
    
    reqData.task_status=this.state.task_status;
    var methodInfo=new Object();
    methodInfo.url="/get-tasks";
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
        that.setState({tasks: response.data,totalRecords:response.count});
      }
      else
      {
        that.setState({tasks: [],totalRecords:0});
        alert(response.message);
      }
    });
    //this.setState({activePage: pageNumber});
  }
  getTasks(param='') {
      //console.log("param",param);
      //console.log("state",this.state);
      var reqData=new Object();
      if (typeof param === 'string') {
              // this is a string
              if(param.trim()!='')
              { 
                
                reqData.sortField=param;
                //console.log("reqData",reqData);
                if(reqData.sortField=='task_title')
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
                else if(reqData.sortField=='created_date')
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
      if(param.task_status!='' && typeof param.task_status !=='undefined')
      {
        //console.log("inside");
        reqData.task_status=param.task_status;
      }
      else
      { 
        //console.log("inside else");
        reqData.task_status=this.state.task_status;
      }
      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/get-tasks";
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
            that.setState({tasks: response.data,totalRecords:response.count});
          }
          else
          {
            that.setState({tasks: [],totalRecords:0});
            alert(response.message);
          }
      });
  }

  render() {
    var states=this.state;
    //console.log("State",states);
    return (
      <div className="animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i> Tasks
              </div>
              <div className="row">
                <div className="col-md-8">
                <div className="col-md-8">
                </div>
                <div className="col-md-4 pull-right">
                  <select className="form-control mt-4" value={this.state.task_status} onChange={this.handleFieldChanged("task_status")}>
                    <option value="0">Pending Tasks</option>
                    <option value="1">Active Tasks</option>
                    <option value="2">Cancelled Tasks</option>
                    <option value="3">Completed Tasks</option>
                    <option value="-1">Rescheduled Tasks</option>
                  </select>
                </div>
                </div>
                <div className="search-box col-md-4 mt-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" value={this.state.searchText} onChange={this.handleSearchChange.bind(this)} />
                    <span className="input-group-btn"><button type="button" className="btn btn-primary" onClick={this.getTasks.bind(this,this.state)}>Search</button></span>
                  </div>
                </div>
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th onClick={this.getTasks.bind(this,'task_title')} className="haveSorting">Task Title <i className="fa fa-sort"></i></th>
                      <th>Address</th>
                      <th>Speciality</th>
                      <th>User's Name & Phone.no</th>
                      {this.state.task_status!=0 && <th>Tasker's Name & Phone.no</th> }
                      {this.state.task_status==2 && <th>Cancelled Info</th> }
                      <th onClick={this.getTasks.bind(this,'created_date')} className="haveSorting">Created Date <i className="fa fa-sort"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.tasks.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} self={states} />)}
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
    const  photoIndex  = this.props.self.photoIndex;
    const  isOpen  = this.props.self.isOpen;
           
    var image = '';
    if(this.props.self.task_status==2 &&  this.props.data.cancel_image1 != '')
    {
      var images = [];
      images.push(commonMethods.cancelIMageUrl+this.props.data.cancel_image1);
      images.push(commonMethods.cancelIMageUrl+this.props.data.cancel_image2);
     

    }
     console.log('',commonMethods.cancelIMageUrl+this.props.data.cancel_image2);
      return (
         <tr>
            <td>{this.props.index}</td>
            <td>{this.props.data.task_title}</td>
            <td>{this.props.data.task_location_address}</td>
            <td>{this.props.data.category_name_english}</td>
            <td>{this.props.data.user_first_name+' '+this.props.data.user_last_name}<br/><span>{this.props.data.user_phone_no}</span></td>
            {this.props.self.task_status!=0 && <td>{this.props.data.tasker_first_name+' '+this.props.data.tasker_last_name}<br/><span>{this.props.data.tasker_phone_no}</span></td>}
            {
              this.props.self.task_status==2 && <td><b>By: </b><span>{this.props.data.cancelled_by==0 && "User"}</span><span>{this.props.data.cancelled_by==1 && "Tasker"}</span><br/>
              <b>Reason: </b>{this.props.data.cancel_reason}<br/>
              <b>Date: </b><Timestamp time={Math.round(this.props.data.cancelled_date/1000)} format='date'/>
              <br/>
              <div>
                <button
                    type="button"
                    onClick={() => this.setState({ isOpen: true })}
                >
                    Open Lightbox
                </button>
 
                {isOpen &&
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
 
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() => this.setState({
                            photoIndex: (photoIndex + images.length - 1) % images.length,
                        })}
                        onMoveNextRequest={() => this.setState({
                            photoIndex: (photoIndex + 1) % images.length,
                        })}
                    />
                }
            </div>
              </td>
            }
            <td><Timestamp time={Math.round(this.props.data.created_date/1000)} format='date'/></td>
         </tr>
      );
   }
}

export default Tasks;
