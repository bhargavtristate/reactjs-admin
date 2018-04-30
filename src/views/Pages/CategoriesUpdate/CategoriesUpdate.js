import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
var sortType=[0,0];
var sortFieldName=[];

class CategoriesUpdate extends Component {
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
	    this.state = {arabic_name: '',english_name:'',image:'',messages:'',cat_id:'',image_url:'',admin_info:admin_info,timeRate:[],hour:'00',minute:'00',access_data:access_data};
	    this.addCategory = this.addCategory.bind(this);
	    this.updateCategory = this.updateCategory.bind(this);
	    //this.getCategories();
	    //console.log("this.props",this.props.location.query);
	    if(typeof this.props.location.query._id !='undefined')
	    {
	      //console.log("inside");
	      var category_id=this.props.location.query._id;
	      this.getCategoryDetail(category_id);
	    }
    }
  }
  	handleEnglishChange(e){
     	this.setState({english_name: e.target.value});
  	}
  	handleArabicChange(e){
     	this.setState({arabic_name: e.target.value});
  	}
  	handleImageChange(e){
    	this.setState({image: e.target.value});
 	}
 	/*handleTimeFieldChanged(field) {
	    //console.log("Speciality",field);
	    return (e) => {
	    	timeAndRate.push({time:field,rate:e.target.value})
			this.setState({timeRate:timeAndRate});
		}
	}	*/
  	getCategoryDetail(cate_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      	reqData._id= cate_id;
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
      methodInfo.url="/get-category-detail";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          console.log("response",response);
          if(response.status==1)
          {
	          	/*if(admin_data.role_id!=1)
		    	{
		    		if(admin_data._id!=response.data[0].admin_id)
		    		{
		    			return false;
		    		}

		    	}*/
	            //$('#file-input').val(response.data[0].category_image);
	            that.setState({english_name: response.data[0].category_name_english});
	            that.setState({arabic_name: response.data[0].category_name_arabic});
	            that.setState({image_url: response.data[0].category_image});
	            that.setState({cat_id: response.data[0]._id});
	            for(var i=0;i<response.data[0].interval_charge.length; i++)
	            {
	            	//console.log("key",response.data[0].interval_charge[i].time_slot);
	            	//console.log("value",response.data[0].interval_charge[i].rate);
	            	$('[data-time="'+response.data[0].interval_charge[i].time_slot+'"]').val(response.data[0].interval_charge[i].rate)
	            	//time_data[response.data[0].interval_charge[i].time_slot]=response.data[0].interval_charge[i].rate;
	            }
	            for(var i=0;i<response.data[0].hour_charge.length; i++)
	            {
	            	//console.log("key",response.data[0].interval_charge[i].time_slot);
	            	//console.log("value",response.data[0].interval_charge[i].rate);
	            	$('[data-min_rate="'+response.data[0].hour_charge[i].time_slot+'"]').val(response.data[0].hour_charge[i].rate)
	            	//time_data[response.data[0].interval_charge[i].time_slot]=response.data[0].interval_charge[i].rate;
	            }
           		//console.log("timedta",time_data);
          }
          else
          {
            alert(response.message);
            hashHistory.push('/categories_management');
          }
      });
  	}
	addCategory() {
			var timeAndRate=[];
			var minRate=[];
	     	var imageData=document.querySelector('input[type="file"]').files[0];
			if(this.state.english_name=='')
			{
				this.setState({messages: "English Name Required"});
			}
			else if(this.state.arabic_name=='')
			{
				this.setState({messages: "Arabic Name Required"});
			}
			if($('input[type="file"]').val()=='')
			{
				alert("Please select image");
				return false;
			}
			else if($('input[type="file"]').val()!='')
			{
				var ext = $('input[type="file"]').val().split('.').pop().toLowerCase();
				if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
				    alert('invalid extension!');
				    $('input[type="file"]').val('');
				    return false;
				}
			}
	     	 var reqData=new Object();
	      	$("input.time-rate").each(function() {
	      		var time=$(this).data('time');
	      		var rate=$(this).val();
	      		$(this).css("border","1px solid lightgray");
	      		if(rate=='')
	      		{
	      			timeAndRate.push({time:time,rate:0});
	      		}
	      		else
	      		{
		      		var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
					if(!digit.test(rate))
				    {
				        //this.setState({messages: "Rate is not valid"});
				        $(this).val('').css("border","1px solid red").focus();
				        return false;
				    }
				    else
				    {
				    	timeAndRate.push({time:time,rate:rate});
				    }
	      		}

			});
	      	$("input.min-rate").each(function() {
	      		var time=$(this).data('min_rate');
	      		var rate=$(this).val();
	      		$(this).css("border","1px solid lightgray");
	      		if(rate=='')
	      		{
	      			minRate.push({time:time,rate:0});
	      		}
	      		else
	      		{
		      		var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
					if(!digit.test(rate))
				    {
				        //this.setState({messages: "Rate is not valid"});
				        $(this).val('').css("border","1px solid red").focus();
				        return false;
				    }
				    else
				    {
				    	minRate.push({time:time,rate:rate});
				    }
	      		}
			});
			if(timeAndRate.length==48 && minRate.length==24)
			{
		      	//console.log("imageData",imageData);
		      	reqData.arabic_name= this.state.arabic_name;
		      	reqData.english_name= this.state.english_name;
				reqData.time_and_rate= timeAndRate;
				reqData.min_rate= minRate;
		      	//reqData.english_name= ['Hi','Hello'];
		      	reqData.image=imageData;
		      	//console.log("reqData",reqData);
				var methodInfo=new Object();
				methodInfo.url="/add-category";
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
				var that=this;
				commonMethods.apiCall(methodInfo,reqData,1,function(response){
				//console.log("response data",response.status);
				//console.log("response categories",response.data);
				  alert(response.message);
				  if(response.status==1)
				  {
				    hashHistory.push('/categories_management');
				  }
				  
				});
			}
			else
			{
				alert("Please fill valid values.");
			}
	}
	updateCategory() {
			var timeAndRate=[];
			var minRate=[];
	     	console.log("state",this.state);
			if(this.state.english_name=='')
			{
				this.setState({messages: "English Name Required"});
			}
			else if(this.state.arabic_name=='')
			{
				this.setState({messages: "Arabic Name Required"});
			}
			if($('input[type="file"]').val()!='')
			{
				var ext = $('input[type="file"]').val().split('.').pop().toLowerCase();
				if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
				alert('invalid extension!');
				$('input[type="file"]').val('');
				return false;
			}
				var imageData=document.querySelector('input[type="file"]').files[0];
			}

	      	$("input.time-rate").each(function() {
	      		var time=$(this).data('time');
	      		var rate=$(this).val();
	      		$(this).css("border","1px solid lightgray");
	      		if(rate=='')
	      		{
	      			timeAndRate.push({time:time,rate:0});
	      		}
	      		else
	      		{
		      		var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
					if(!digit.test(rate))
				    {
				        //this.setState({messages: "Rate is not valid"});
				        $(this).val('').css("border","1px solid red").focus();
				        return false;
				    }
				    else
				    {
				    	timeAndRate.push({time:time,rate:rate});
				    }
	      		}
			});
			$("input.min-rate").each(function() {
	      		var time=$(this).data('min_rate');
	      		var rate=$(this).val();
	      		$(this).css("border","1px solid lightgray");
	      		if(rate=='')
	      		{
	      			minRate.push({time:time,rate:0});
	      		}
	      		else
	      		{
		      		var digit=/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
					if(!digit.test(rate))
				    {
				        //this.setState({messages: "Rate is not valid"});
				        $(this).val('').css("border","1px solid red").focus();
				        return false;
				    }
				    else
				    {
				    	minRate.push({time:time,rate:rate});
				    }
	      		}
			});
			//console.log("legth",timeAndRate.length);
			if(timeAndRate.length==48 && minRate.length==24)
			{
				//console.log("imagedata",imageData);
				var reqData=new Object();
				reqData.arabic_name= this.state.arabic_name;
				reqData.english_name= this.state.english_name;
				reqData.time_and_rate= timeAndRate;
				reqData.min_rate= minRate;
				reqData.category_id= this.state.cat_id;
				var admin_data=this.state.admin_info;
			    if(admin_data.role_id!=1)
			    {
			      reqData.user_id=admin_data._id;
			    }
			    else
			    {
			      reqData.user_id="";
			    }
				//var is_image=1;
				if(typeof imageData !='undefined' && imageData.name!='')
				{
				reqData.image=imageData;
				reqData.image_name=this.state.image_url;
				//is_image=1;
				}
				else
				{
				reqData.image_name=this.state.image_url;
				}
				//console.log("reqData",reqData);
				var methodInfo=new Object();
				methodInfo.url="/update-category";
				methodInfo.methodName="post";
				var that=this;

				commonMethods.apiCall(methodInfo,reqData,1,function(response){
				//console.log("response data",response.status);
				//console.log("response categories",response.data);
				  alert(response.message);
				  if(response.status==1)
				  {
				    hashHistory.push('/categories_management');
				  }
				});
			}
			else
			{
				alert("Please fill valid values.");
			}
	}
	/*saveTimeRate(){
		
		
		var time=this.state.hour+":"+this.state.minute;
		var rate=this.state.rate;
		if(!rate)
		{
			this.setState({messages:"Please select rate."});
			return false;
		}
		else
		{
			var timeShow = 0;
			timeAndRate.some(function (el,index) {
				//console.log("index",index);
			    if(el.time===time)
			    {
			    	//console.log("inside if");
			    	var retVal = confirm("Same time already selected, you want to overwrite it?");
		            if( retVal == true ){
		            	timeAndRate.splice(index, 1);
		            	timeAndRate.push({time:time,rate:rate});
		            	timeShow=1;
		            	return 1;
		            }
			    }
			    
			});
			if(!timeShow)
		    {
		    	timeAndRate.push({time:time,rate:rate});
		    }
			this.setState({timeRate:timeAndRate});

		}
	}*/
  render() {
    const messages = this.state.messages;
    const category_id = this.state.cat_id;
    var hours = [];
    for(var i=0; i<24;i++){
    	if(i<10)
    	{
    		let j=0+""+i;
			hours.push(<option value={j} key={i} >{j}</option>);
    	}
    	else
    	{
	    	hours.push(<option value={i} key={i} >{i}</option>);
    	}
    	
	}
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
	                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="English Name" onChange={this.handleEnglishChange.bind(this)} value={this.state.english_name}/>
	                    </div>
                  	</div>
	                <div className="form-group row">
	                    <label className="col-md-3 form-control-label" htmlFor="text-input">Arabic Name</label>
	                    <div className="col-md-9">
	                      <input type="text" id="text-input" name="text-input" className="form-control" placeholder="Arabic Name" onChange={this.handleArabicChange.bind(this)} value={this.state.arabic_name}/>
	                    </div>
	                </div>
                  	<div className="form-group row">
	                    <label className="col-md-3 form-control-label" htmlFor="file-input">Image</label>
	                    <div className="col-md-9">
	                      <input type="file" id="file-input" name="file-input" value={this.state.image} accept="image/*" onChange={this.handleImageChange.bind(this)} />
	                      {category_id !='' &&
	                        <img className="category_image"  src={commonMethods.categoryImageBaseUri+ this.state.image_url} />
	                      }
	                    </div>
                  	</div>
                  	<div className="form-group row">
	                    <label className="col-md-3 form-control-label" htmlFor="text-input">Time and Rate</label>
                  	</div>
                  	<div className="form-group row">
                  		<div className="col-md-6">
		                    <strong className="pull-left">00:00 to 00:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="00:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">00:31 to 00:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="00:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">01:00 to 01:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="01:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">01:31 to 01:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="01:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">02:00 to 02:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="02:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">02:31 to 02:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="02:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">03:00 to 03:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="03:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">03:31 to 03:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="03:31"/>
		                    </div>
                  		</div>


                  		<div className="col-md-6">
		                    <strong className="pull-left">04:00 to 04:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="04:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">04:31 to 04:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="04:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">05:00 to 05:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="05:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">05:31 to 05:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="05:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">06:00 to 06:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="06:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">06:31 to 06:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="06:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">07:00 to 07:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="07:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">07:31 to 07:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="07:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">08:00 to 08:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="08:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">08:31 to 08:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="08:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">09:00 to 09:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="09:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">09:31 to 09:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="09:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">10:00 to 10:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="10:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">10:31 to 10:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="10:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">11:00 to 11:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="11:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">11:31 to 11:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="11:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">12:00 to 12:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="12:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">12:31 to 12:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="12:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">13:00 to 13:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="13:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">13:31 to 13:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="13:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">14:00 to 14:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="14:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">14:31 to 14:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="14:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">15:00 to 15:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="15:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">15:31 to 15:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="15:31"/>
		                    </div>
                  		</div>

                  		<div className="col-md-6">
		                    <strong className="pull-left">16:00 to 16:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="16:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">16:31 to 16:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="16:31"/>
		                    </div>
                  		</div>

                  		<div className="col-md-6">
		                    <strong className="pull-left">17:00 to 17:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="17:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">17:31 to 17:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="17:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">18:00 to 18:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="18:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">18:31 to 18:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="18:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">19:00 to 19:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="19:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">19:31 to 19:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="19:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">20:00 to 20:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="20:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">20:31 to 20:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="20:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">21:00 to 21:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="21:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">21:31 to 21:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="21:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">22:00 to 22:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="22:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">22:31 to 22:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="22:31"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">23:00 to 23:30</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="23:00"/>
		                    </div>
                  		</div>
                  		<div className="col-md-6">
		                    <strong className="pull-left">23:31 to 23:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control time-rate" placeholder="Rate" min="0" data-time="23:31"/>
		                    </div>
                  		</div>
                  	</div>
                  	<div className="form-group row">
	                    <label className="col-md-3 form-control-label" htmlFor="text-input">Minimum Rate</label>
                  	</div>
                  	<div className="form-group row">
                  								<div className="col-md-6">
		                    <strong className="pull-left">00:00 to 00:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="00:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">01:00 to 01:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="01:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">02:00 to 02:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="02:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">03:00 to 03:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="03:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">04:00 to 04:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="04:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">05:00 to 05:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="05:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">06:00 to 06:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="06:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">07:00 to 07:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="07:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">08:00 to 08:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="08:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">09:00 to 09:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="09:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">10:00 to 10:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="10:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">11:00 to 11:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="11:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">12:00 to 12:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="12:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">13:00 to 13:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="13:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">14:00 to 14:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="14:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">15:00 to 15:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="15:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">16:00 to 16:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="16:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">17:00 to 17:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="17:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">18:00 to 18:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="18:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">19:00 to 19:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="19:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">20:00 to 20:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="20:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">21:00 to 21:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="21:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">22:00 to 22:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="22:00"/>
		                    </div>
                  		</div>
						<div className="col-md-6">
		                    <strong className="pull-left">23:00 to 23:59</strong>
		                    <div className="col-md-5 pull-left">
		                      <input type="number" id="text-input" name="text-input" className="form-control min-rate" placeholder="Rate" min="0" data-min_rate="23:00"/>
		                    </div>
                  		</div>
                  	</div>

                  
              </div>
              <div className="card-footer">
                  {category_id !='' &&
                    <button type="button" onClick={this.updateCategory.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Update</button>
                  }
                  {category_id =='' &&
                    <button type="button" onClick={this.addCategory.bind(this)} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
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
class TableRow extends Component {
   render() {
      return (
         <tr>
            <td>{this.props.data.time}</td>
            <td>{this.props.data.rate}</td>
         </tr>
      );
   }
}
export default CategoriesUpdate;
