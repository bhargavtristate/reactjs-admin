import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
class SubCategoriesManagement extends Component {
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
      if(access_data==0)
      {
        hashHistory.push('/dashboard');
      }
      var admin_info=commonMethods.getAdminInfo();
      //console.log("start_date",start_date);
      //console.log("expire_date",expire_date);
      if(typeof this.props.location.query.category_id !='undefined')
      {
        var category_id=this.props.location.query.category_id;
      }
      this.state = {admin_info:admin_info,messages:'',cat_id:category_id,sub_category_id:'',access_data:access_data};
      if(typeof this.props.location.query.sub_category_id !='undefined')
      {
        var sub_category_id=this.props.location.query.sub_category_id;
        this.state.sub_category_id=sub_category_id;
        this.getSubCateDetail(sub_category_id);
      }
      else
      {
        var sub_category_id='';
      }
      this.addSubCategory = this.addSubCategory.bind(this);
    }

  }
  handleFieldChanged(field) {
    return (e) => {
      this.setState({[field]:e.target.value});
    };
  }
  getSubCateDetail(id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData._id= id;
      var methodInfo=new Object();
      methodInfo.url="/get-sub-category-detail";
      methodInfo.methodName="post";
      var admin_data=this.state.admin_info;
      if(this.state.access_data!=2)
      {
        reqData.user_id=admin_data._id;
      }
      else
      {
        reqData.user_id="";
      }
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            that.setState({
                          'sub_category_english': response.data[0]['sub_categories'][0]['sub_category_english'],
                          'sub_category_arabic': response.data[0]['sub_categories'][0]['sub_category_arabic'],
                        });
          }
          else
          {
            alert(response.message);
            hashHistory.push('/categories_management');
          }
      });
  }
  
  addSubCategory() {
    //console.log("states",this.state);
    if(this.state.sub_category_english=='')
      {
        this.setState({messages: "English Name Required"});
        return false;
      }
      if(this.state.sub_category_arabic=='')
      {
        this.setState({messages: "Arabic Name Required"});
        return false;
      }
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.sub_category_english= this.state.sub_category_english;
      reqData.sub_category_arabic= this.state.sub_category_arabic;
      reqData.category_id= this.state.cat_id;
      var admin_data=this.state.admin_info;
      reqData.admin_id=admin_data._id;
      /*if(this.state.access_data!=2)
      {
      }
      else
      {
        reqData.admin_id="";
      }*/
      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/add-sub-category";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/categories_management/sub_categories?category_id='+that.state.cat_id);
          }
          else if(response.status==3)
          {
             hashHistory.push('/categories_management');
          }
          
      });
  }
  updateSubCategory() {
      
      if(this.state.sub_category_english=='')
      {
        this.setState({messages: "English Name Required"});
        return false;
      }
      if(this.state.sub_category_arabic=='')
      {
        this.setState({messages: "Arabic Name Required"});
        return false;
      }
      
      var reqData=new Object();
      reqData.sub_category_english= this.state.sub_category_english;
      reqData.sub_category_arabic= this.state.sub_category_arabic;
      reqData.category_id= this.state.cat_id;
      reqData.sub_category_id= this.state.sub_category_id;

      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/update-sub-category";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            //hashHistory.push('/categories_management');
            hashHistory.push('/categories_management/sub_categories?category_id='+that.state.cat_id);
          }
      });
  }
  render() {
    const messages = this.state.messages;
    const sub_category_id = this.state.sub_category_id;
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
                    <label className="col-md-3 form-control-label" htmlFor="text-input">English Name</label>
                    <div className="col-md-9">
                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="English Name" value={this.state.sub_category_english} onChange={this.handleFieldChanged("sub_category_english")}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Arabic Name</label>
                    <div className="col-md-9">
                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="Arabic Name" value={this.state.sub_category_arabic} onChange={this.handleFieldChanged("sub_category_arabic")}/>
                    </div>
                  </div>
              </div>
              <div className="card-footer">
                  {sub_category_id !='' &&
                    <button type="button" onClick={this.updateSubCategory.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                  {sub_category_id =='' &&
                    <button type="button" onClick={this.addSubCategory.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                  }
                <Link to={'/categories_management/sub_categories?category_id='+this.state.cat_id} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default SubCategoriesManagement;
