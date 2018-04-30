import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
class GlobalSettings extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
      //hashHistory.push('/categories_management');
    }
    this.state = {categories: [],messages:'',commission_rate:'',search_radius:'',tasker_cancellation_policy:'',address_change_in_year:'',tasker_cancellation_amount:''};
    //this.getSettings = this.getSettings.bind(this);
    this.getSettings();
  }
  handleCommissionChange(e){
    this.setState({commission_rate: e.target.value});
  }
  handleDistanceChange(e){
    this.setState({search_radius: e.target.value});
  }
  handleCancellationPolicyChange(e){
    this.setState({tasker_cancellation_policy: e.target.value});
  }
  handleCancellationChargeChange(e){
    this.setState({tasker_cancellation_amount: e.target.value});
  }
  handleAddressChange(e){
    this.setState({address_change_in_year: e.target.value});
  }
  updateSettings()
  {
      //console.log("value",this.state);
      if(this.state.commission_rate=='')
      {
        this.setState({messages: "Commission Rate Required"});
        return false;
      }
      else if(this.state.commission_rate!='')
      {
        var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if(!digit.test(this.state.commission_rate))
        {
          this.setState({messages: "Commission Rate is not valid"});
          return false;
        }
      }
      else if(this.state.search_radius=='')
      {
        this.setState({messages: "Tasker Distance Required"});
        return false;
      }
      else if(this.state.search_radius!='')
      {
        var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if(!digit.test(this.state.search_radius))
        {
          this.setState({messages: "Tasker Distance is not valid"});
          return false;
        }
      }
      else if(this.state.address_change_in_year=='')
      {
        this.setState({messages: "Address change value Required"});
        return false;
      }
      else if(this.state.address_change_in_year!='')
      {
        var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if(!digit.test(this.state.address_change_in_year))
        {
          this.setState({messages: "Address change value not valid"});
          return false;
        }
      }
      else if(this.state.tasker_cancellation_amount=='')
      {
        this.setState({messages: "Cancellation amount Required"});
        return false;
      }
      else if(this.state.tasker_cancellation_amount!='')
      {
        var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
        if(!digit.test(this.state.tasker_cancellation_amount))
        {
          this.setState({messages: "Cancellation amount is not valid"});
          return false;
        }
      }
      else if(this.state.tasker_cancellation_policy=='')
      {
        this.setState({messages: "Cancellation Policy Required"});
        return false;
      }
      
      
      var reqData=new Object();
      reqData.commission_rate= this.state.commission_rate;
      reqData.search_radius= this.state.search_radius;
      reqData.address_change_in_year= this.state.address_change_in_year;
      reqData.tasker_cancellation_amount= this.state.tasker_cancellation_amount;
      reqData.tasker_cancellation_policy= this.state.tasker_cancellation_policy;

      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/update-global-settings";
      methodInfo.methodName="post";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          alert(response.message);
          if(response.status==1)
          {
            //hashHistory.push('/categories_management');
          }
      });
  }
  getSettings() {
    
      var reqData=new Object();
      

      //console.log("reqData",reqData);
      var methodInfo=new Object();
      methodInfo.url="/get-admin-settings";
      methodInfo.methodName="get";
      var that=this;

      commonMethods.apiCall(methodInfo,reqData,0,function(response){
        //console.log("response data",response.status);
        //console.log("response categories",response.data);
          //alert(response.message);
          if(response.status==1)
          {
            that.setState({commission_rate: response.data[0].commission_rate});
            that.setState({search_radius: response.data[0].search_radius});
            that.setState({tasker_cancellation_policy: response.data[0].tasker_cancellation_policy});
            that.setState({tasker_cancellation_amount: response.data[0].tasker_cancellation_amount});
            that.setState({address_change_in_year: response.data[0].address_change_in_year});
            //hashHistory.push('/categories_management');
          }
          else
          {
            alert(response.message);
          }
      });
  }
  render() {
    const messages = this.state.messages;
    return (
      <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <strong>Global Settings</strong>
              </div>
              <div className="card-block">
                <form action="" method="post" className="form-horizontal ">
                  {messages !='' &&
                    <div className="alert alert-danger">{messages}</div>
                  }
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="email-input">Commission rate</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="number" min="0" id="input2-group1" name="input2-group1" className="form-control" value={this.state.commission_rate} placeholder="Commission rate" onChange={this.handleCommissionChange.bind(this)}/>
                        <span className="input-group-addon"><i className="fa fa-percent"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="email-input">Tasker Distance</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="number" min="0" id="input2-group1" name="input2-group1" className="form-control" placeholder="Tasker Distance" value={this.state.search_radius} onChange={this.handleDistanceChange.bind(this)}/>
                        <span className="input-group-addon">miles</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Change Address in Year</label>
                    <div className="col-md-9">
                      <input type="number" id="text-input"  min="0" name="text-input" className="form-control" placeholder="value" value={this.state.address_change_in_year} onChange={this.handleAddressChange.bind(this)}/>
                      <span className="help-block">How many times allow to change address in year</span>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="email-input">Cancellation Charge</label>
                    <div className="col-md-9">
                      <div className="input-group">
                        <input type="number" min="0" id="input2-group1" name="input2-group1" className="form-control" placeholder="Cancellation Charge" value={this.state.tasker_cancellation_amount} onChange={this.handleCancellationChargeChange.bind(this)}/>
                        <span className="input-group-addon"><i className="fa fa-money fa-lg"></i></span>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="textarea-input">Cancellation Policy</label>
                    <div className="col-md-9">
                      <textarea id="textarea-input" name="textarea-input" rows="9" className="form-control" placeholder="Cancellation Policy" value={this.state.tasker_cancellation_policy} onChange={this.handleCancellationPolicyChange.bind(this)}></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-sm btn-primary" onClick={this.updateSettings.bind(this)}><i className="fa fa-dot-circle-o"></i> Submit</button>
              </div>
            </div>
          </div>
        </div>
      );
  }
}


export default GlobalSettings;
