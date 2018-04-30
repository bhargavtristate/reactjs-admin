import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
import InfiniteCalendar, {Calendar,withRange} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
class OffersManagement extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    
    //console.log("admin_info",admin_info);
    //console.log("path",this.props.location.pathname.substring(this.props.location.pathname.lastIndexOf('/')  + 1));
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
    }
    else
    {
      //hashHistory.push('/');
      var access_data=commonMethods.checkCurrentUriAccess(this.props.location.pathname);
      if(access_data==0)
      {
        hashHistory.push('/dashboard');
      }
      var admin_info=commonMethods.getAdminInfo();
      var start_date = new Date();
      var expire_date=new Date();
      expire_date=new Date(expire_date.setDate(expire_date.getDate() + 7));
      this.addOffer = this.addOffer.bind(this);
      this.getOfferDetail = this.getOfferDetail.bind(this);
      //console.log("start_date",start_date);
      //console.log("expire_date",expire_date);
      if(typeof this.props.location.query.category_id !='undefined')
      {
        var category_id=this.props.location.query.category_id;
      }
      this.state = {offer_id:'','offer_title':'','offer_description':'','discount_code':'','discount_percentage':'',admin_info:admin_info,'showDatePicker':false,messages:'','offer_status':0,cat_id:category_id,start_date:start_date,expire_date:expire_date,start_end_date:'',access_data:access_data};
      if(typeof this.props.location.query.offer_id !='undefined')
      {
        //console.log("inside admin_info",admin_info);
        var offer_id=this.props.location.query.offer_id;
        this.state.offer_id=offer_id;
        //this.setState({offer_id:offer_id});
        this.getOfferDetail(offer_id);
      }
    }
    console.log("state",this.state);
   

  }
  handleFieldChanged(field) {
    return (e) => {
      // update() is provided by React Immutability Helpers
      // https://facebook.github.io/react/docs/update.html
      /*let newState = update(this.state, {
        [field]: {$set: e.target.value}
      });*/
      //console.log("field",field);
      //console.log("value",e.target.value);
      this.setState({[field]:e.target.value});
    };
  }
  handleDateChange(dateInfo)
  {
    if(dateInfo.eventType==3)
    {
      //console.log("date info",dateInfo);
      var start_date=Math.round(dateInfo.start.getTime());
      var expire_date=Math.round(dateInfo.end.getTime());

      var selected_start_date=dateInfo.start;
      var start_timestamp=Math.round(selected_start_date.getTime());
      selected_start_date=this.convert_date(start_timestamp);
      /*var date= selected_start_date.getDate();
      var month= selected_start_date.getMonth();
      var year= selected_start_date.getFullYear();
      selected_start_date=date+'-'+month+'-'+year;*/

      var selected_expire_date=dateInfo.end;
      var end_timestamp=Math.round(selected_expire_date.getTime());
      selected_expire_date=this.convert_date(end_timestamp);
     /* var date= selected_expire_date.getDate();
      var month= selected_expire_date.getMonth();
      var year= selected_expire_date.getFullYear();
      selected_expire_date=date+'-'+month+'-'+year;*/
      this.setState({'start_date':start_timestamp,showDatePicker: !this.state.showDatePicker,'expire_date':end_timestamp,'start_end_date':selected_start_date+' to '+selected_expire_date});
    }
    //console.log("selected_start_date",selected_start_date,'-',start_date);
    //console.log("selected_expire_date",selected_expire_date,'-',expire_date);
  }
  selectdate()
  {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }
  getOfferDetail(offer_id){
      var reqData=new Object();
      
      //console.log("imageData",this.state);
      reqData._id= offer_id;
      var admin_data=this.state.admin_info;
      if(this.state.access_data!=2)
      {
        reqData.user_id=admin_data._id;
      }
      else
      {
        reqData.user_id="";
      }

      var methodInfo=new Object();
      methodInfo.url="/get-offer-detail";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            //$('#file-input').val(response.data[0].category_image);
            var start_date=response.data[0]['discount_and_offers'][0]['start_date'];
            var expire_date=response.data[0]['discount_and_offers'][0]['expiry_date'];
            var start_end_date=that.convert_date(start_date)+' to '+that.convert_date(expire_date);
            that.setState({
                          'offer_title': response.data[0]['discount_and_offers'][0]['offer_title'],
                          'offer_description': response.data[0]['discount_and_offers'][0]['offer_description'],
                          'discount_code': response.data[0]['discount_and_offers'][0]['discount_code'],
                          'discount_percentage': response.data[0]['discount_and_offers'][0]['discount_percentage'],
                          'start_date':start_date,
                          'expire_date':expire_date,
                          'start_end_date':start_end_date,
                          'offer_status':response.data[0]['discount_and_offers'][0]['status']
                        });
          }
          else
          {
            alert(response.message);
            hashHistory.push('/categories_management');
          }
      });
  }
  convert_date(cdate)
  {
    var cdate=new Date(cdate);
    var date= cdate.getDate();
    var month= cdate.getMonth()+1;
    var year= cdate.getFullYear();
    var formated_date=date+'-'+month+'-'+year;
    return formated_date;
  }
  addOffer() {
    //console.log("states",this.state);
    if(this.state.offer_title=='')
    {
      this.setState({messages: "Offer title Required"});
      return false;
    }
    if(this.state.offer_description=='')
    {
      this.setState({messages: "Offer Description Required"});
      return false;
    }
    if(this.state.discount_code=='')
    {
      this.setState({messages: "Discount Code Required"});
      return false;
    }
    if(this.state.discount_percentage=='')
    {
      this.setState({messages: "Discount Percentage Required"});
      return false;
    }
    else if(this.state.discount_percentage!='')
    {
      var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
      if(!digit.test(this.state.discount_percentage))
      {
        this.setState({messages: "Discount Percentage not valid"});
        return false;
      }
    }
    if(this.state.start_end_date=='')
    {
      this.setState({messages: "Start and End date Required"});
      return false; 
    }  
      
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData.offer_title= this.state.offer_title;
      reqData.offer_description= this.state.offer_description;
      reqData.discount_code= this.state.discount_code;
      reqData.discount_percentage= this.state.discount_percentage;
      reqData.start_date= this.state.start_date;
      reqData.expire_date=this.state.expire_date;
      reqData.offer_status= this.state.offer_status;
      reqData.category_id= this.state.cat_id;
      reqData.user_id=this.state.admin_info._id;
      var admin_data=this.state.admin_info;

      if(this.state.access_data!=2)
      {
        reqData.admin_id=admin_data._id;
      }
      else
      {
        reqData.admin_id="";
      }
      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/add-offer";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            hashHistory.push('/categories_management/offers?category_id='+reqData.category_id);
          }
          else if(response.status==3)
          {
             hashHistory.push('/categories_management');
          }
          
      });
  }
  updateOffer() {
      
      if(this.state.offer_title=='')
      {
        this.setState({messages: "Offer title Required"});
        return false;
      }
      if(this.state.offer_description=='')
      {
        this.setState({messages: "Offer Description Required"});
        return false;
      }
      if(this.state.discount_code=='')
      {
        this.setState({messages: "Discount Code Required"});
        return false;
      }
      if(this.state.discount_percentage=='')
      {
        this.setState({messages: "Discount Percentage Required"});
        return false;
      }
      else if(this.state.discount_percentage!='')
      {
        var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if(!digit.test(this.state.discount_percentage))
        {
          this.setState({messages: "Discount Percentage not valid"});
          return false;
        }
      }
      if(this.state.start_end_date=='')
      {
        this.setState({messages: "Start and End date Required"});
        return false; 
      }
      //console.log("this.state",this.state);
      var reqData=new Object();
      reqData.offer_title= this.state.offer_title;
      reqData.offer_description= this.state.offer_description;
      reqData.discount_code= this.state.discount_code;
      reqData.discount_percentage= this.state.discount_percentage;
      reqData.start_date= this.state.start_date;
      reqData.expire_date= this.state.expire_date;
      reqData.offer_status= this.state.offer_status;
      reqData.offer_id= this.state.offer_id;

      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/update-offer";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            //hashHistory.push('/categories_management');
            hashHistory.push('/categories_management/offers?category_id='+that.state.cat_id);
          }
      });
  }
  render() {
    const messages = this.state.messages;
    const offer_id = this.state.offer_id;
    console.log("state",this.state);
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
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Offer Title</label>
                    <div className="col-md-9">
                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="Offer Title" value={this.state.offer_title} onChange={this.handleFieldChanged("offer_title")}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Offer Description</label>
                    <div className="col-md-9">
                      <textarea id="textarea-input" name="textarea-input" rows="9" className="form-control" placeholder="Offer Description" value={this.state.offer_description}  onChange={this.handleFieldChanged("offer_description")}></textarea>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Discount Code</label>
                    <div className="col-md-9">
                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="Discount Code" value={this.state.discount_code} onChange={this.handleFieldChanged("discount_code")}/>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Discount Percentage</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="number" min="0" id="input2-group1" name="input2-group1" className="form-control" value={this.state.discount_percentage} placeholder="Discount Percentage" onChange={this.handleFieldChanged("discount_percentage")} />
                        <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Start Date - End Date</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="text" min="0" id="input2-group1" name="input2-group1" className="form-control" placeholder="Start Date - End Date" value={this.state.start_end_date} onClick={this.selectdate.bind(this)} readOnly/>
                        <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                      </div>
                      <div className="datePicker">
                        {this.state.showDatePicker && 
                        <InfiniteCalendar height={300} Component={withRange(Calendar)} minDate={new Date()} onSelect={this.handleDateChange.bind(this)} selected={{start: this.state.start_date,end: this.state.expire_date,}} />
                        }
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Offer Status</label>
                    <div className="col-md-9">
                      <select id="text-input" name="text-input" className="form-control" value={this.state.offer_status}  onChange={this.handleFieldChanged("offer_status")}>
                        <option value="0">Inactive</option>
                        <option value="1">Active</option>
                      </select>
                    </div>
                  </div>
              </div>
              <div className="card-footer">
                  {offer_id !='' &&
                    <button type="button" onClick={this.updateOffer.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                  {offer_id =='' &&
                    <button type="button" onClick={this.addOffer.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                  }
                <Link to={'/categories_management'} className="btn btn-sm btn-danger" activeClassName="active"><i className="fa fa-ban"></i> Cancel</Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      );
  }
}
export default OffersManagement;
