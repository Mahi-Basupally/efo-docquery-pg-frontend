var _committeeId = '';
$(document).ready(function()
{
	$("#committeeIdAutofill").autocomplete({
	  	source: function(request, response) 
	  	{
	  		var cid = $("#committeeIdAutofill").val();
	  		$.ajax({
	            url: "committeelookup.htm",
	            data: {committeeId:  cid},
	            contentType: "application/json; charset=utf-8",
	           	dataType: "json", 
	            type: "get",
	            success: function(data)
	            {
	                response(data);
	            }
	        });
	    },
		minLength: 2,
		select: function( event, ui ) 
		{
			//alert(ui.item.value);
			var committeeIdName = ui.item.value;
			if(committeeIdName.indexOf("-") != -1) 
			{
				ui.item.value = committeeIdName.substring(0,committeeIdName.indexOf("-"));
				_committeeId = ui.item.value;				
			}
		}
	});
});

function resendEmail()
{
	var l_statusCode = "EmailResend";
	var l_email      = $("#emailAddress").val();
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId:  l_cmteId,
			emailAddress: l_email,
			statusCode:   l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    		  userMessages("Email was successfully re-sent to: " + l_email, " Success: Email Re-Sent");
	    	else
	    		userMessages("Unknown Error occurred in the email re-sending process.", "Error: Email Re-send Fail");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in the email re-sending process.", "Error: Email Re-send Fail");
		}	
	});
}

function resendForgotEmail()
{
	var l_statusCode = "resendForgotEmail";
	var l_email      = $("#emailAddress").val();
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId:  l_cmteId,
			emailAddress: l_email,
			statusCode:   l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    		  userMessages("Email was successfully re-send to: " + l_email, " Success: Email Re-Send");
	    	else
	    		userMessages("Unknown Error occurred in the email re-sending process.", "Error: Email Re-send Fail");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in the email re-sending process.", "Error: Email Re-send Fail");
		}	
	});
}

function resendTextMsg(smsOrVoice)
{
	var l_statusCode = "TextMsgResend";
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: l_cmteId,
			mode:        smsOrVoice,
			statusCode:  l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    	{
	    		if(smsOrVoice == "VOICE")
	    			userMessages("You will receive a call shortly with your security code", "Success: Security Code Message");
	    		else if(smsOrVoice == "EMAIL")
	    			userMessages("You will receive a email shortly with your security code", "Success: Security Code Message");
	    		else
	    		  userMessages("Your security code was successfully re-sent.", "Success: Security Code Re-Sent");	    		
	    	}
	    	else
	    		userMessages("Unknown Error occurred in the SMS re-sending process.", "Error: Security Code Re-send Fail");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in the Security code re-sending process.", "Error: Security Code Re-send Fail");
		}	
	});
}

function getAnotherPersonalKey()
{
	var l_statusCode = "AnotherPKey";
	var l_cmteId     = $("#committeeId").val();
	var loc          = window.location.href;
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: l_cmteId,
			statusCode:  l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) != "" )
	    	{
	    		$("#personalKey").val( $.trim(result) );
	    		
	    		if(loc.indexOf("passwordmanagement") !== -1)
	    			$("#showPkBtn").click();
	    		else
	    		  userMessages("<b>Your Personal Key has been changed. <br/><br/>Your new key is: <mark>" + result + "</mark><br/><br/>Please copy, print and save your new key in a secure place.</b>", "Success: Personal Renew");
	    	}
	    	else
	    		userMessages("Unknown error occurred in generating a Personal Key.", "Error: SMS Re-send Fail");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown error occurred in generating a Personal Key.", "Error: SMS Re-send Fail");
		}	
	});
}

function UpdatePwd()
{	
	var l_statusCode = "updatePwd";
	var l_pwd        = $("#password").val();
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: l_cmteId,
			pwd:         l_pwd,
			statusCode:  l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    		  userMessages("Your password was successfully changed.", "Password Update Message");
	    	else
	    		userMessages("Unknown Error occurred in attempting to change your password.", "Password Update Message");
	    	$("#password").val("");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			$("#password").val("");
			userMessages("Unknown Error occurred in attempting to change your password.", "Password Update Message");
		}	
	});
}



function ChangeVerifiedEmailAddress()
{	
	
	var l_statusCode = "changeVerifiedEmailAddress";
	var l_emailId    = $("#emailAddress").val();
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: 	l_cmteId,
			emailAddress:	l_emailId,
			statusCode:		l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    	{
	    		  userMessages("We sent an email to "+l_emailId+" containing a link to confirm your email address. Click the link and confirm your email address", "Email Address Change");
	    		  $("#emailOne").html(l_emailId);
	    		  $("#changeEmailLabel").html("Email Verification Pending");
	    		  
	    	}	  
	    	else
	    		userMessages("Unknown Error occurred in attempting to change your email address.", "Password Update Message");	    	
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');			
			userMessages("Unknown Error occurred in attempting to change your email address.", "Email Address Change");
		}	
	});
}

function UpdateTelePhoneNm()
{
	var l_statusCode = "updatePhoneNum";
	var l_carrier    = $("#carrier").val();
	var l_cmteId     = $("#committeeId").val();
	var l_number     = $("#telephoneNew").val();
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: l_cmteId,
			number:      l_number,
			statusCode:  l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    	{
	    		  userMessages("Successfully updated your telephone number.", "Telephone Update Message");
	    	      $("#telephone").val(l_number);
	    	}
	    	else
	    		userMessages("Unknown Error occurred in attempting to change your telephone number.", "Telephone Update Message");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in attempting to change your telephone number.", "Telephone Update Message");
		}	
	});
}

function UpdateTelePhoneDefault(number)
{
	var l_statusCode = "updateDefaultPhoneNum";
	var l_number     = number;
	var l_cmteId     = $("#committeeId").val();
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			committeeId: l_cmteId,
			number:      l_number,
			statusCode:  l_statusCode
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if(data && data.length > 0)
	    	{
			     /*var len       = data.length;
			     var phoneList = "";
	    		 var result    = "";
	    		 
				 for(var i = 0; i < len; i++)
				 {
					 phoneList +="<label style='width:100%;float:none;padding-right:0px;' class='desc' id='phone_" + i + "Lbl' for='phone_" + i + "'>Telephone Number " +  i + ":</label>";
					 phoneList +="<div style='width:70%;'>";                                                    
				     phoneList +="<input value='" + data[i].phoneNumber + "' type='text' id='phone_'" + i + "' style='width:70%;' class='form-control' readonly />";
				     if($.trim(data[i].isDefault) == "NO")
				    	 phoneList +="<span style='text-indent:255px;'><a onclick='changeDefaultSms('phone_" + i + "');' href='javascript:void(0)' style='color:#112e51;font-weight:bold;text-decoration:underline;'>Make Default</a></span>";	                  
				     else if($.trim(data[i].isDefault) == "YES")
				    	 phoneList +="<span style='text-indent:255px;'>Default</span>";                    
				     phoneList +="</div>";
				 }
				 result = phoneList;
				 alert(result);
				 document.getElementById("phone_List").innerHTML = result;*/	    		 
	    		 window.location.reload();
	    		// userMessages("Your default telephone number was successfully changed.", "Default Telephone Change Message");
	    	}
	    	else
	    	{
	    		userMessages("Unknown Error occurred in attempting to update your default telephone number.", "Telephone Update Message");
	    	}
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in attempting to update your default telephone number.", "Telephone Update Message");
		}	
	});
}


 


function UpdateEPRLRequest(eprlRequestId,eprlStatus,eprlUpdateFor)
{	
	var l_statusCode 		= "updateEPRLRequest";
	var l_eprlRequestId  	= eprlRequestId;
	var l_eprlStatus  		= eprlStatus;
	var l_eprlUpdateFor  	= eprlUpdateFor;
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			eprlRequestId:	l_eprlRequestId,
			eprlStatus: 	l_eprlStatus,
			eprlUpdateFor: 	l_eprlUpdateFor,
			statusCode:  l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "json", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = "";
			$busyMsg.dialog('close');
	    	if( data && data.length > 0 )
	    	{
	    		GetEPRLRequestPerPage('1');	/* Takes to first page*/    		  			    			    			    			 
	    	}
	    	else
	    		userMessages("Unknown Error occurred in attempting to update Password Request.", "Password Request");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in attempting to update Password Request.", "Password request");
		}	
	});
}


function UpdateTreasurerAction(eprlTokenId,eprlAction)
{
	var l_statusCode 	= "updateTreasurerAction";
	var l_eprlTokenId   = eprlTokenId;
	var l_eprlAction    = eprlAction;
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			eprlTokenId:	l_eprlTokenId,
			eprlStatus: 	l_eprlAction,			
			statusCode:  	l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = data.toString();
			$busyMsg.dialog('close');
	    	if( $.trim(result.toUpperCase() ) == "SUCCESS" )
	    		{
		    		if(l_eprlAction == "APPROVE") 
		    			userMessages("Successfully Approved the request.", "Password Request");
		    		else 
		    			userMessages("Successfully Rejected the request.", "Password Request");
		    		
		    		$("#treasurerApprovalButton").css("display", "none");
	    		}
	    	else
	    		userMessages("Unknown Error occurred in attempting to approve Password Request.", "Password Request");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unknown Error occurred in attempting to approve Password Request.12312", "Password Request");
		}	
	});
}


function GetEPRLRequestPerPage(page,queryString)
{	
	
	var l_statusCode 		= "getEPRLSPerPage";
	var l_ttlEPRLTrans     	= $("#ttlEPRLTransId").val();
	var rlID  				= document.getElementById("results-length");	
	var l_perPage 			= rlID.options[rlID.selectedIndex].value;
	var l_page 				= page;	
	var l_ttlPages 			= Math.ceil(l_ttlEPRLTrans/l_perPage);
	var next 				= parseInt(l_page)+1;
	var previous 			= parseInt(l_page)-1;
	var l_queryString 		= queryString;
	var eprlQuery  			=  document.getElementById("eprlQuery").value;	
	
	if (eprlQuery.length>0)
	{
		l_queryString= eprlQuery;
		}
	
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{
			perPage:			l_perPage,
			page: 				l_page,
			queryString: 		l_queryString,
			statusCode:  		l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "json", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = "";
			$busyMsg.dialog('close');
	    	if( data && data.length > 0 )
	    	{
	    		 var len       = data.length;	    		 
			     var eprRequest = "";
			     var tableInfo = "";
			     var paginationInfo = "";
	    		 var result    = "";
	    		 
				 for(var i = 0; i < len; i++)
				 {	 
					 if(i==0){
					 l_ttlEPRLTrans=data[i].ttlEPRLTrans;				
					 l_ttlPages = data[i].ttlEPRLPages;
					 }					 
				     eprRequest += "<tr class='items' style='text-align:left;' id="+ data[i].eprlRequestId +">";
				     eprRequest += "<td><a onClick=\"committeePasswordStatus('"+data[i].eprlCmteId+"')\"; id=\"cmtePasswordStatusBtn\">"+data[i].eprlCmteId+"</a></td>";
				     eprRequest += "<td>"+data[i].eprlRequesterName+"</td>";
				     eprRequest += "<td style=\"word-wrap: break-word; !important\">"+data[i].eprlEmailID+"</td>";
				     eprRequest += "<td style=\"word-wrap: break-word; !important\">"+data[i].eprlPhoneNumber+"</td>";
				     eprRequest += "<td>"+data[i].eprlRequestDate+"</td>";
				     eprRequest += "<td>"+data[i].eprlReason+"</td>";
				     eprRequest += "<td>"+data[i].eprlStatus+"</td>";
				                                               
				     if(data[i].eprlStatus =='PENDING') {
				     eprRequest += "<td>";				    	 
				     eprRequest += "<button id='approveButton' onclick='eprlRequestApprove("+data[i].eprlRequestId+");' type='button' class='button--cta'>Approve</button>";
				     eprRequest += "</td>";
				     eprRequest += "<td>";	
				     eprRequest += "<button id='rejectButton' onclick='eprlRequestReject("+data[i].eprlRequestId+");' type='button' class='button--cta'>Reject</button>";
				     eprRequest += "</td>";
				     eprRequest += "<td><button id='tempAllowF1Button' onclick='eprlTempAllowF1('${dt.eprlRequestId}','${dt.eprlCmteId}');' type='button' class='button--cta'>Temp F1 Password</button></td>";
				     }				     
				                                                                                                                                                                                       
				     eprRequest += "</tr>";				     				    
				 }
				 result = eprRequest;				 	    		 	    					 				
	    		document.getElementById("ddTableBody").innerHTML = result;
	    		
	    		/*Setting Navigation buttons for Pagination Next and Previous */
	    		 if (l_ttlPages == 1){
	    			 paginationInfo += "<a class=\"paginate_button previous disable\" aria-controls=\"results\" data-dt-idx=\"0\" tabindex=\"0\" id=\"results_previous\">Previous</a>";			          
	    			 paginationInfo += "<a class=\"paginate_button next disable\" aria-controls=\"results\" data-dt-idx=\"1\" tabindex=\"0\" id=\"results_next\">Next</a>";
	    		 }
	    		 else
	    		 {
	    			 /*On Page 1*/	    			 
	    			 if (l_page == 1) 	    			 
	    				 paginationInfo += "<a class=\"paginate_button previous disable\" aria-controls=\"results\" data-dt-idx=\"0\" tabindex=\"0\" id=\"results_previous\">Previous</a>"; 
	    			 else
	    				 paginationInfo += "<a class=\"paginate_button previous enable\" aria-controls=\"results\" data-dt-idx=\"0\" tabindex=\"0\" id=\"results_previous\" onclick=\"GetEPRLRequestPerPage('"+previous+"');\">Previous</a>";

	    			 /*On Last Page*/
	    			 if (l_page < l_ttlPages)
	    				 paginationInfo +="<a class=\"paginate_button next enable\" aria-controls=\"results\" data-dt-idx=\"1\" tabindex=\"0\" id=\"results_next\" onclick=\"GetEPRLRequestPerPage('"+next+"');\">Next</a>";	    				 
	    			 else
	    				 paginationInfo +="<a class=\"paginate_button next disable\" aria-controls=\"results\" data-dt-idx=\"1\" tabindex=\"0\" id=\"results_next\">Next</a>";	    			 	    			 	    				 	    				 	
	    		 }	    		 	    		
	    		 document.getElementById("results_paginate").innerHTML = paginationInfo;
	    		 
	    		/* Setting the information*/
	    		if (l_ttlPages == 1)
	    		{ 
	    			tableInfo ="<span>Showing 1 to "+len+ " of "+l_ttlEPRLTrans+" entries</span> <input type='hidden' id='ttlEPRLTransId' value="+l_ttlEPRLTrans+" />";
	    		}
	    		else
	    			{
	    			 var transStart = (parseInt(l_page)-1)*l_perPage;
	    			 var transTo = parseInt(transStart)+parseInt(len);
	    			 var transFrom = parseInt(transStart)+1;
	    			 tableInfo ="<span>Showing "+transFrom+" to "+transTo+ " of "+l_ttlEPRLTrans+" entries</span> <input type='hidden' id='ttlEPRLTransId' value="+l_ttlEPRLTrans+" />";
	    			}
	    		document.getElementById("DataTables_Table_0_info").innerHTML = tableInfo;	    		
	    	}
	    	else
	    		userMessages("Unable to get data", "Pagination Error 1");
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			userMessages("Unable to get data.", "Pagination Error 2");
		}	
	});
}



function GetCommitteePasswordStatus(committeeId)
{		
	
	var l_statusCode 		  = "getCommitteePasswordStatus";	
	var l_committeeId    = committeeId;
	$.ajax({
		url: "statuscmd.htm",
		data: 
		{			
			psaCommitteeId: 		l_committeeId,
			statusCode:  			l_statusCode
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "json", 
		type: "get",
		cache: false,
	    beforeSend: function()
	    {
	    	busyMsgOpen();
	    },
		success: function(data)
		{
			var result = "";
			$busyMsg.dialog('close');
	    	if( data && data.length > 0 )
	    	{
	    		 var len       = data.length;	    		 
			     var eprRequest = "";
			     var tableInfo = "";
			     var paginationInfo = "";
	    		 var result    = "";
	    		 eprRequest += "<table class=\"simple-table\">";
				 for(var i = 0; i < len; i++)
				 {					   				
					 eprRequest += "<tr class=\"simple-table__row level--3\">";
					 eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Committee Id:</b></td>";
				     eprRequest += "<td>"+data[i].committeeId+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Committee Name:</b></td>";
				     eprRequest += "<td>"+data[i].committeeName+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Treasurer Name:</b></td>";
				     eprRequest += "<td>"+data[i].treasurerName+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Form 1- Email Id 1:</b></td>";
				     eprRequest += "<td>"+data[i].emailAddress+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Form 1 - Email Id 2:</b></td>";
				     eprRequest += "<td>"+data[i].emailAddressTwo+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Form 1 - Phone Number:</b></td>";
				     eprRequest += "<td>"+data[i].telePhone+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>PSA Email Id:</b></td>";
				     eprRequest += "<td>"+data[i].psaEmailAddress+"</td>";
				     eprRequest += "</tr>";	
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>2FA Phone Number:</b></td>";
				     eprRequest += "<td>"+data[i].psaPhonenumber+"</td>";
				     eprRequest += "</tr>";
				     eprRequest += "<tr class=\"simple-table__row level--3\">";
				     eprRequest += "<td style=\"width: 30% !important\" class=\"simple-table__cell\"><b>Enrollment Completed At:</b></td>";
				     eprRequest += "<td>"+data[i].enrollmentCompletedDate+"</td>";
				     eprRequest += "</tr>";	
				     
				 }
				 eprRequest +="</table>";
				 result = eprRequest;				 	    		 	    					 				
	    		document.getElementById("cmtePasswordStatus").innerHTML = result;	    			    	 	    		 	    		    
	    	}
	    	 
		},
		error:function(data, status, xhr)
		{
			$busyMsg.dialog('close');
			result= "Unable to get data.";
			document.getElementById("cmtePasswordStatus").innerHTML = result;
		}	
	});

}