import React, { Component } from 'react';
import commonMethods from '../../../common'; 
import $ from 'jquery';
import { Router, Route, IndexRoute, hashHistory , Link } from 'react-router';
var sortType=[0,0];
var sortFieldName=[];
var timeAndRate=[];
class CategoriesUpdate extends Component {
  constructor(props) {
    super(props);
    var checkLoginResponse=commonMethods.checkLogin();
    //console.log("response",checkLoginResponse);
    if(!checkLoginResponse)
    {
      hashHistory.push('/pages/login');
    }
    
    this.state = {arabic_name: '',english_name:'',image:'',messages:'',cat_id:'',image_url:'',timeRate:[],hour:'00',minute:'00'};
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
  	handleEnglishChange(e){
     	this.setState({english_name: e.target.value});
  	}
  	handleArabicChange(e){
     	this.setState({arabic_name: e.target.value});
  	}
  	handleImageChange(e){
    	this.setState({image: e.target.value});
 	}
 	handleFieldChanged(field) {
	    //console.log("Speciality",field);
	    return (e) => {
			this.setState({[field]:e.target.value});
		}
	}	
  	getCategoryDetail(cate_id){
      var reqData=new Object();
      
      //console.log("imageData",imageData);
      reqData._id= cate_id;
      var methodInfo=new Object();
      methodInfo.url="/get-category-detail";
      methodInfo.methodName="post";
      var that=this;
      commonMethods.apiCall(methodInfo,reqData,0,function(response){
          //console.log("response",response);
          if(response.status==1)
          {
            //$('#file-input').val(response.data[0].category_image);
            that.setState({english_name: response.data[0].category_name_english});
            that.setState({arabic_name: response.data[0].category_name_arabic});
            that.setState({image_url: response.data[0].category_image});
            that.setState({cat_id: response.data[0]._id});
          }
          else
          {
            alert(response.message);
            hashHistory.push('/categories_management');
          }
      });
  	}
	addCategory() {

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
	      
	      //console.log("imageData",imageData);
	      reqData.arabic_name= this.state.arabic_name;
	      reqData.english_name= this.state.english_name;
	      //reqData.english_name= ['Hi','Hello'];
	      reqData.image=imageData;
	      //console.log("reqData",reqData);
	      var methodInfo=new Object();
	      methodInfo.url="/add-category";
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
	updateCategory() {

	      
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
	      console.log("imagedata",imageData);
	      var reqData=new Object();
	      reqData.arabic_name= this.state.arabic_name;
	      reqData.english_name= this.state.english_name;
	      reqData.category_id= this.state.cat_id;
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
	saveTimeRate(){
		
		/*console.log("hour",this.state.hour);
		console.log("minute",this.state.minute);
		console.log("rate",this.state.rate);*/
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
			//console.log("timeAndRate",timeAndRate);
		}
	}
	checkTimeExists(time,callback)
	{
		timeAndRate.some(function (el,index) {
			//console.log("index",index);
		    if(el.time===time)
		    {
		    	callback({status:1,index:index});
		    	return false;
		    }
		});
	}
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
                    <label className="col-md-3 form-control-label" htmlFor="text-input">Time & Rate</label>
                    <div className="col-md-9 rate-time-selection">
						<select name="hours" className="hours-selection pull-left" onChange={this.handleFieldChanged("hour")}>
						{hours}
						</select>   
						<select name="minutes" className="minute-selection pull-left" onChange={this.handleFieldChanged("minute")}>
							<option value="00" selected='selected'>00</option>
							<option value="30">30</option>
						</select>    
						<input type="number" id="text-input" name="text-input" className="form-control rate-box pull-left" placeholder="Rate" onChange={this.handleFieldChanged("rate")} value={this.state.rate}/>                
						<input type="button" value="Save" className="btn btn-m btn-success pull-left" onClick={this.saveTimeRate.bind(this)} />
                    </div>
                  </div>
                {this.state.timeRate !='' &&
                 <div className="time-rate-preview form-group row">
                 	<label className="col-md-3 form-control-label" htmlFor="text-input">Time & Rate Preview</label>
                 	<div className="col-md-9">
                 	<table border="1">
                 		<thead>
		                    <tr>
			                    <th>Time</th>
			                    <th>Rate</th>
		                    </tr>
		                </thead>
		                <tbody>
		                  {this.state.timeRate.map((person, i) => <TableRow key = {i} index = {i+1} data = {person} self={this} />)}
		                </tbody>
                 	</table>
                 	</div>
                 </div>
             	}
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
