import React, { Component } from 'react';
import $ from 'jquery'; 
import { instanceOf } from 'prop-types';
import Cookies from 'cookies-js';
export const serverUri = "http://192.168.1.12:2500";
//export const serverUri = "http://52.26.20.233:2500";
module.exports = {
	apiCall(methodInfo,reqData,is_image,callback) {
		//console.log("reqdata",reqData);
		$('.page-loader').css('display','block');
		if(is_image==1)
		{
			var data = new FormData();
			var request=new Object();
		  	for(var key in reqData) {
		  		//console.log("reqdata",reqData[key]['name']);
		  		if( reqData[key] != null && typeof reqData[key] === 'object')
		  		{
		  			//var image_object=reqData[key];
		  			//console.log("inside",image_object.name);
			  		//if(image_object.hasOwnProperty("name"))
		  			if("name" in reqData[key] && "size" in reqData[key])
			  		{
			  			//console.log("inside image",[key]);
			  			data.append([key],reqData[key]);
			  		}
			  		else
			  		{
			  			request[key]=reqData[key];	
			  		}
		  		}
		  		else
		  		{
		  			request[key]=reqData[key];	
		  		}
		  		//console.log("key",key);
		  		//console.log("value",reqData[key]);
		  		
				//request.push({[key]:reqData[key]});
			}
			//console.log("request",request);
			data.append('data',JSON.stringify(request));
			$.ajax({
			    url: serverUri+methodInfo.url,
			    type : methodInfo.methodName,
			    data:data,
			    dataType: 'json',
			    cache: false,
			    contentType: false,
			    processData: false,
			    success : function(data) 
			    {
			      	//console.log("response",data);
			      	$('.page-loader').css('display','none');
			      	callback(data)
			    }
			});
		}
		else
		{
			var data=reqData;
			$.ajax({
			    url: serverUri+methodInfo.url,
			    type : methodInfo.methodName,
			    data:data,
			    dataType: 'json',
			    success : function(data) 
			    {
			      	//console.log("response",data);
			      	$('.page-loader').css('display','none');
			      	callback(data)
			    }
			});
		}
		/*$.ajax({
		    url: serverUri+methodInfo.url,
		    type : methodInfo.methodName,
		    data:data,
		    dataType: 'json',
		    cache: false,
		    contentType: false,
		    processData: false,
		    success : function(data) 
		    {
		      	//console.log("response",data);
		      	callback(data)
		    }
		});*/
	},
	setLogin(admin_data){
		Cookies.set('mender_admin', 1);
		Cookies.set('admin_info', btoa(JSON.stringify(admin_data)));
		//localStorage.setItem("mender_admin", 1);
		//localStorage.setItem("admin_info", JSON.stringify(admin_data));
	},
	logout(){
		//localStorage.removeItem("mender_admin");
		Cookies.set('mender_admin', null);
		Cookies.set('admin_info', null);
	},
	checkLogin(){
		if(Cookies.get('mender_admin') && Cookies.get('mender_admin')==1)
		{
			//callback({status:1});
			return true;
		}
		else
		{
			//callback({status:0});
			return false;
		}
	},
	getAdminInfo(){
		var admin_info=Cookies.get("admin_info");
		//console.log("admin_info",admin_info);
		if(admin_info && admin_info!='null')
		{
			admin_info=atob(Cookies.get("admin_info"));
			
			if(admin_info)
			{
				return JSON.parse(admin_info);
			}
			else
			{
				return admin_info;
			}	
		}
		else
		{
			return false;
		}
	},
	checkCurrentUriAccess(uri){
		var current_path=uri;
      	current_path=current_path.substring(current_path.lastIndexOf('/')  + 1);
      	//console.log("current_path in common",current_path);
      	var admin_info=Cookies.get("admin_info");
      	if(admin_info && admin_info!='null')
		{
			admin_info=JSON.parse(atob(Cookies.get("admin_info")));
			//console.log("info",admin_info.role_id.all_access);
			var permissions=admin_info.role_id.permissions;
			var access_check=[];
			permissions.map(function(permission) { 
				if(permission.name==current_path)
				{
					access_check.push(permission);
					return false;
				}
			});
			//console.log("all_access",access_check);
			if(access_check.length>0)
			{
				if(access_check[0].value>0)
				{
					if("all_access" in admin_info.role_id && admin_info.role_id.all_access==1)
					{
						return 2;
					}
					else if(access_check[0].value==1)
					{
						return 1;
					}
				}
				else
				{
					return 0;
				}
			}

			//console.log("permissions",permissions);
		}
      	return current_path;
	},
	categoryImageBaseUri : "http://52.26.20.233:2500/category_image/",
	cancelIMageUrl : "http://192.168.1.12/maulik_proj/mender/resources/cancel_image/",
	//categoryImageBaseUri : "http://192.168.1.23:2500/images/category_image/",
}
