import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import InfiniteCalendar, {Calendar,withRange} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
class UserUpdate extends Component {
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
    }
    if(typeof this.props.location.query._id !='undefined')
    {
      //console.log("inside");
      var user_id=this.props.location.query._id;
      this.getUserDetail(user_id);
    }
    
    this.state = {messages:'',user_id:user_id,'showDatePicker':false,selected_date:'',maxDate:new Date(),all_categories:[],all_sub_categories:[],selected_sub_speciality:[]};
    
    this.updateUser = this.updateUser.bind(this);
    //this.getCategories();
    //console.log("this.props",this.props.location.query);
    
  }
  selectdate()
  {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }
  handleFieldChanged(field) {
    //console.log("Speciality",field);
    return (e) => {
      // update() is provided by React Immutability Helpers
      // https://facebook.github.io/react/docs/update.html
      /*let newState = update(this.state, {
        [field]: {$set: e.target.value}
      });*/
      //console.log("field",field);
      //console.log("value",e.target.value);
      this.setState({[field]:e.target.value});
      if(field=='speciality')
      {
        this.handleCateChange(e.target.value);
      }
      if(field=='sub_speciality')
      {
        console.log("inside checked");
              // current array of options
          var checked_speciality=this.state.selected_sub_speciality;

          // check if the check box is checked or unchecked
          if (e.target.checked) {
            console.log("selected value",e.target.value);
            // add the numerical value of the checkbox to options array
            checked_speciality.push(e.target.value);
          } else {
            // or remove the value from the unchecked checkbox from the array
            let index = checked_speciality.indexOf(e.target.value);
            checked_speciality.splice(index, 1);
          }
          console.log("checked_speciality",checked_speciality);
          // update the state with the new array of options
          this.setState({ selected_sub_speciality: checked_speciality });
      }
    };

  }
  getUserDetail(tasker_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.id= tasker_id;
      var methodInfo=new Object();
      methodInfo.url="/getUserData";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            //console.log("selected date",Math.round(new Date(response.data[0].birth_date).getTime()));
            //$('#file-input').val(response.data[0].category_image);
            //that.setState({all_categories:response.categories});
            that.setState({ first_name: response.data[0].first_name,
                            last_name: response.data[0].last_name,
                            phone_no: response.data[0].phone_no,
                            email: response.data[0].email,
                            user_name: response.data[0].user_name});
          }
          else
          {
            alert(response.message);
            hashHistory.push('/users');
          }
      });
  }
  updateUser() {
      //console.log("state",this.state);
     
      if(this.state.first_name=='')
      {
        this.setState({messages: "first name Required"});
        return false;
      }
      else if(this.state.last_name=='')
      {
        this.setState({messages: "last name Required"});
        return false;
      }

     // console.log("selected_sub_speciality",this.state);
     // console.log("legth",this.state.selected_sub_speciality.length);
      var reqData=new Object();
      reqData.first_name= this.state.first_name;
      reqData.last_name= this.state.last_name;
      reqData._id= this.state.user_id;

      var methodInfo=new Object();
      methodInfo.url="/updateUserData";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/users');
          }
      });
  }
 
  render() {
    //console.log("states",this.state);
    const messages = this.state.messages;
    const user_id = this.state.user_id;
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
                    <label className="col-md-3 form-control-label" htmlFor="text-input">First Name</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="First Name" onChange={this.handleFieldChanged("first_name")} value={this.state.first_name}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">last Name</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Last Name" onChange={this.handleFieldChanged("last_name")} value={this.state.last_name}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Email</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Email" onChange={this.handleFieldChanged("email")} value={this.state.email} disabled="disabled"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Username</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Username" onChange={this.handleFieldChanged("user_name")} value={this.state.user_name} disabled="disabled"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Phone Number</label>
                    <div className="col-md-9">
                      <input type="number" name="text-input" className="form-control" placeholder="Phone Number" onChange={this.handleFieldChanged("phone_no")} value={this.state.phone_no} disabled="disabled"/>
                    </div>
                  </div>
              </div>
              <div className="card-footer">
                  {user_id !='' &&
                    <button type="button" onClick={this.updateUser.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                <Link to={'/users'} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default UserUpdate;
