import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import InfiniteCalendar, {Calendar,withRange} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
class TaskerUpdate extends Component {
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
      var tasker_id=this.props.location.query._id;
      this.getTaskerDetail(tasker_id);
    }
    
    this.state = {messages:'',tasker_id:tasker_id,'showDatePicker':false,selected_date:'',maxDate:new Date(),all_categories:[],all_sub_categories:[],selected_sub_speciality:[]};
    
    this.updateTasker = this.updateTasker.bind(this);
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
  getTaskerDetail(tasker_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.id= tasker_id;
      var methodInfo=new Object();
      methodInfo.url="/get-tasker-info";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            //console.log("selected date",Math.round(new Date(response.data[0].birth_date).getTime()));
            //$('#file-input').val(response.data[0].category_image);
            that.setState({all_categories:response.categories});
            that.setState({ first_name: response.data[0].first_name,
                            last_name: response.data[0].last_name,
                            credit_point: response.data[0].credit_point,
                            credit_number: response.data[0].credit_number,
                            account_no: response.data[0].account_no,
                            phone_no: response.data[0].phone_no,
                            email: response.data[0].email,
                            user_name: response.data[0].user_name,
                            speciality: response.data[0].speciality,
                            sub_speciality: response.data[0].sub_speciality,
                            gender: response.data[0].gender});

              if(response.data[0].birth_date=='')
              {
                that.setState({birth_date:'',selected_date:new Date()});
              }
              else
              {
                that.setState({birth_date:response.data[0].birth_date,selected_date:Math.round(new Date(response.data[0].birth_date).getTime())});
              }
              if(typeof response.data[0].speciality =="undefined")
              {
                that.handleCateChange(response.categories[0]['_id']);
              }
              else
              {
                that.handleCateChange(response.data[0].speciality);
              }
              var selected_sub_speciality=that.getColumn(response.data[0].sub_speciality,'sub_category_id');
              that.setState({selected_sub_speciality: selected_sub_speciality});
              //console.log("selected_sub_speciality",selected_sub_speciality);
          }
          else
          {
            alert(response.message);
            hashHistory.push('/taskers');
          }
      });
  }
  updateTasker() {
    console.log("state",this.state);
      var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
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
      else if(this.state.credit_point=='')
      {
        
        this.setState({messages: "Credit point Required"});
        return false;
      }
      else if(!digit.test(this.state.credit_point))
      {
        this.setState({messages: "Credit point not valid"});
        return false;
      }
      else if(this.state.selected_sub_speciality.length === 0)
      { console.log("inside condition");
        this.setState({messages: "sub speciality Required"});
        return false;
      }

     // console.log("selected_sub_speciality",this.state);
     // console.log("legth",this.state.selected_sub_speciality.length);
      var reqData=new Object();
      reqData.first_name= this.state.first_name;
      reqData.last_name= this.state.last_name;
      reqData.credit_point= this.state.credit_point;
      reqData.gender= this.state.gender;
      reqData.birth_date= this.state.birth_date;
      reqData._id= this.state.tasker_id;
      reqData.speciality= this.state.speciality;
      reqData.selected_sub_speciality= this.state.selected_sub_speciality;
      //var is_image=1;
      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/update-tasker-info";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/taskers');
          }
      });
  }
  handleDateChange(dateInfo)
  {
    this.setState({birth_date: this.convert_date(dateInfo)});
  }
  handleCateChange(cat_id)
  {
    console.log("hello inside cate",cat_id);
    //this.setState({all_sub_categories: this.convert_date(dateInfo)});
    //var that=this;
    var that=this;
    that.setState({all_sub_categories: [],selected_sub_speciality: []});
    this.state.all_categories.map(function(obj, index) {
      if(obj._id == cat_id) {
        that.setState({all_sub_categories: obj.sub_categories});
        return false;
      }
    });
    //console.log("sub speciality",this.state);
  }
  convert_date(cdate)
  {
    //var cdate=new Date(cdate);
    var date= cdate.getDate();
    var month= cdate.getMonth()+1;
    var year= cdate.getFullYear();
    var formated_date=year+'-'+month+'-'+date;
    return formated_date;
  }
  getColumn(dataArray,name) {
      return dataArray.map(function(el) {
         // gets corresponding 'column'
         if (el.hasOwnProperty(name)) return el[name];
         // removes undefined values
      }).filter(function(el) { return typeof el != 'undefined'; }); 
  };
  render() {
    //console.log("states",this.state);
    const messages = this.state.messages;
    const tasker_id = this.state.tasker_id;
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
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Birth Date</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Birth Date" onChange={this.handleFieldChanged("birth_date")} value={this.state.birth_date}  onClick={this.selectdate.bind(this)} readOnly />
                      <div className="datePicker">
                        {this.state.showDatePicker && 
                          <InfiniteCalendar height={300}  selected={this.state.selected_date} maxDate={this.state.maxDate} onSelect={this.handleDateChange.bind(this)}/>
                        }
                      </div>
                      </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Credit Point</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="number" name="text-input" className="form-control" placeholder="Credit Point" onChange={this.handleFieldChanged("credit_point")} value={this.state.credit_point}/>
                        <span className="input-group-addon"><i className="fa fa-dollar"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Credit Number</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Credit Number" onChange={this.handleFieldChanged("credit_number")} value={this.state.credit_number} disabled="disabled"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Account Number</label>
                    <div className="col-md-9">
                      <input type="text" name="text-input" className="form-control" placeholder="Account Number" onChange={this.handleFieldChanged("account_no")} value={this.state.account_no} disabled="disabled"/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Gender</label>
                    <div className="col-md-9">
                      <input type="radio" name="gender" onChange={this.handleFieldChanged("gender")} value="1" checked={this.state.gender == 1}/>Male &nbsp;&nbsp;&nbsp;
                      <input type="radio" name="gender" onChange={this.handleFieldChanged("gender")} value="2" checked={this.state.gender == 2} />Female
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
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Speciality</label>
                    <div className="col-md-9">
                      <select name="categories" value={this.state.speciality} onChange={this.handleFieldChanged('speciality')}>
                        {this.state.all_categories.map((categories, i) => <option value={categories._id} key={i} selected={this.state.speciality == categories._id}>{categories.category_name_english}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Sub-Speciality</label>
                    <div className="col-md-9">
                      {this.state.all_sub_categories.map((sub_categories, i) => <label key={i}><input type="checkbox" onChange={this.handleFieldChanged("sub_speciality")}  name="sub_categories[]" value={sub_categories._id}  checked={this.state.selected_sub_speciality.indexOf(sub_categories._id)!=-1} />{sub_categories.sub_category_english}&nbsp;&nbsp;&nbsp;</label> )}
                    </div>
                  </div>

              </div>
              <div className="card-footer">
                  {tasker_id !='' &&
                    <button type="button" onClick={this.updateTasker.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                <Link to={'/taskers'} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default TaskerUpdate;
