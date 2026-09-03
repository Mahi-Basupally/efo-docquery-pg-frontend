function userMessages(msg, Title)
{
	$("#dialog-confirm").html(msg);
	$("#dialog-confirm").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    open: hideX,
	    title: Title,
	    buttons:
	    {
	    	"OK": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}

function legalNoticeDialog()
{
	$("#legalNotice").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:'auto',
	    width:'auto',
	    maxwidth:'auto',
	    maxheight:200,
	    margin:30,
	    title: "Security Notification",
	    open: legalNtsettings,
	    buttons:
	    {
	    	"DECLINE & EXIT": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "CONSENT & CONTINUE": function()
	        {
	        	$(this).dialog('close');
	        	submitButtonClick('cIdForm');
	        }
	    }
	});	
}

//processing busy msg
var $busyMsg;
$(document).ready(function ()
{ 
	$busyMsg = $('<div></div>')
	.html('<div style="text-align:center;"><img src="/img/loading--primary.gif" alt="loading..."/><div style="margin-top:10px; color:#112e51; font-family: "Verdana", Arial, sans-serif;"><b>Busy! &nbsp;Please wait...</b></div></div>')
	.dialog({
        autoOpen: false,
        draggable: false,
        title: 'Loading...',
        modal: true,
        resizable: false,
        closeOnEscape: false,
        open: busyDialogOpen
    });
});

function busyDialogOpen(event, ui) {
    // Hide the close button (X) on the dialog
    $(this).parent().find('.ui-dialog-titlebar-close').hide();
}

function goingBack(url)
{
	$("#dialog-confirm").html("Are you sure you will like to go back to the previous view?");
	$("#dialog-confirm").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "Going Back?",
	    open: hideX,
	    buttons:
	    {
	    	"Yes": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = url;
	        },
	        "No": function()
	        {
	        	$(this).dialog('close');
	        }
	    }
	});	
}

function treasurerApproval()
{
	$("#treasurerApprovalDialog").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "Password Request",
	    open: hideX,
	    buttons:
	    {
	    	"Yes": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = "index.htm";
	        },
	        "No": function()
	        {
	        	$("#spaceHolder").css("display", "none");
	        	$("#" + "NO").css("display", "block");
	        	$(this).dialog('close');
	        }
	    }
	});	
}

function newEnrollment()
{
	$("#newCommitteeDialog").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "New Enrollment",
	    open: hideX,
	    buttons:
	    {
	    	"Cancel": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = "index.htm";
	        },
	        "Enroll": function()
	        {
	        	$("#spaceHolder").css("display", "none");
	        	$("#" + "NO").css("display", "block");
	        	$(this).dialog('close');
	        }
	    }
	});	
}


function emailAddressChangedEnrollment()
{
	$("#committeeEmailChangeDialog").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "Re-Enrollment",
	    open: hideX,
	    buttons:
	    {
	    	"Cancel": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = "index.htm";
	        },
	        "Enroll": function()
	        {
	        	$("#spaceHolder").css("display", "none");
	        	$("#" + "NO").css("display", "block");
	        	$(this).dialog('close');
	        }
	    }
	});	
}

function missingInfo(msg)
{
	$("#msMsg").html(msg);
	$("#missingInfoDialog").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "Missing Information",
	    open: hideX,
	    buttons:
	    {
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = "index.htm";
	        },
	        "Yes": function()
	        {
	        	$(this).dialog('close');
	        	window.location = "eprl.htm?from=update";
	        }
	    }
	});	
}

function confirmPKMsg()
{
	$("#dialog-confirm").html("Do you want a new Personal Key? <br /><br /> <b>Continue?</b>");
	$("#dialog-confirm").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    open: hideX,
	    minWidth:450,
	    title: "New Personal Key Request",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');
	        	getAnotherPersonalKey();
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}

function getCarrierForAnotherSms(smsOrVoice)
{
	$("#dialog-confirm").html();	
	$("#dialog-confirm").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    open: hideX,
	    title: "New One-time Security Code",	    
	    buttons:
	    {
	        "Send": function()
	        {
	        	$(this).dialog('close');	        	
	        	resendTextMsg(smsOrVoice);
            },
	    	"Cancel": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function resendSecurityCode()
{
	//commented by Mahi/Satheesh $("#dialog-confirm2").html();		
	$("#dialog-confirm2").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    open: hideX,
	    title: "New One-time Security Code",	    
	    buttons:
	    {
	        "Send": function()
	        {
	        	$(this).dialog('close');	        	
	        	resendTextMsg($("#codeMethod").val());
            },
	    	"Cancel": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}

function changeDefaultSms(newDefault)
{
	$("#newDefault").html( $("#" + newDefault).val() );
	var number = $("#" + newDefault).val();
	
	$("#changeDefault").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Change Default Telephone Number",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');
	        	UpdateTelePhoneDefault(number);
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}

function changePassword()
{		
	$("#updatePwd").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Password Update",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	var isValid = updatePswd();
	        	if (isValid){
	        		$(this).dialog('close');
	        	}
            }
	    }
	});
}

function changeEmailAddress()
{	
	$("#changeEmailAddress").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,	    
	    minWidth:550,
	    open: hideX,
	    title: "Change Email Address",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	$(this).dialog('close');
	        	ChangeVerifiedEmailAddress();
            }
	    }
	});
}

function updateTelephoneNum()
{
	$("#phoneUpdate").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Telephone Number Update",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	$(this).dialog('close');
	        	UpdateTelePhoneNm();
            }
	    }
	});
}

function GetANewPersonalKey()
{
	$("#personalKeyUpdate").dialog({
		resizable: false,
	    modal: false,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    width:729,
	    maxwidth:650,
	    maxheight:400,
	    margin:30,
	    open: hideX,
	    title: "New Personal Key",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Print This Page": function()
	        {
	        	printPKey();
            }
	    }
	});
}

function wrongEmail()
{
	$("#wrongEmail").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Incorrect Email Address",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	$(this).dialog('close');
	        	wrongEmailGotoEprl();
            }
	    }
	});
}

function wrongCommitteeDetails() {
	$("#wrongCommitteeDetails").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Incorrect Committee Details",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	$(this).dialog('close');
	        	wrongCommitteeDetailsGotoEprl();
            }
	    }
	});
}


function missingPhoneNumber()
{
	$("#missingPhoneNumber").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Missing Phone Number",
	    buttons:
	    {
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        },
	        "Submit": function()
	        {
	        	$(this).dialog('close');
	        	missingPhoneNumberGotoEprl();
            }
	    }
	});
}


function eprlRequestApprove(eprlRequestId,eprlRequestCmteId)
{ 	

	$("#approvingCmteId").html("Select what you are <b>APPROVING</b> for "+eprlRequestCmteId+" ?");	
	$("#updateEPRLRequestApprove").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Update Password Request",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	if ($("#eprlApprovalFor").val()==""){
	        		$("#eprlApprovalFor").css("border-color", "#961A16");
	    			$("#eprlApprovalFor").focus
	        	}
	        	else{
	        	 $(this).dialog('close');
	        	
	        	  UpdateEPRLRequest(eprlRequestId,'APPROVED',$("#eprlApprovalFor").val());
	        	}
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function eprlRequestReject(eprlRequestId,eprlRequestCmteId)
{ 		
	$("#updateEPRLRequestReject").html("<span>Are you sure you want to <b>REJECT</b> password request for <b>"+eprlRequestCmteId+"</b>?</span>");
	$("#updateEPRLRequestReject").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Update Password Request",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');
	        	UpdateEPRLRequest(eprlRequestId,'REJECTED','');
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}

function eprlTempAllowF1(eprlRequestId,eprlRequestCmteId)
{ 		
	$("#assignTempF1Password").html("<span>Are you sure you want to <b>ASSIGN</b> temporary F1 password request for <b>"+eprlRequestCmteId+"</b>?</span>");
	$("#assignTempF1Password").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Update Password Request",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');
	        	UpdateEPRLRequest(eprlRequestId,'ASSIGNED TEMP F1 PASSWORD','');
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function eprlTreasurerApproval(eprlTokenId,eprlAction,eprlRequester)
{ 			
	$("#treasurerApprovalDialog").html("<span>Are you sure you want to <b>"+eprlAction+"</b> password request for <b>"+eprlRequester+"</b>?</span>");
	$("#treasurerApprovalDialog").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Password Request",
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');	        	
	        	UpdateTreasurerAction(eprlTokenId,eprlAction);	        	
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function committeePasswordStatus(committeeId)
{  
	//If committee id is null we are getting it from ajax call for auto complete.
	if(committeeId == '') {
		committeeId = _committeeId;	
	}
	GetCommitteePasswordStatus(committeeId);
	$("#cmtePasswordStatus").dialog({
		resizable: false,
	    modal: true,
	    draggable: true,
	    closeOnEscape: false,
	    minWidth:550,
	    open: hideX,
	    title: "Password Request",
	    buttons:
	    {	         
	    	"Close": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function ackPrintSavePersonalKey()
{
	 $("#dialog-confirm").html("Did you save or print a copy of the personal key? You will be asked to enter the personal key in the next screen.");		
	$("#dialog-confirm").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    open: hideX,
	    title: "Attention!",	    
	    buttons:
	    {
	        "Yes": function()
	        {
	        	$(this).dialog('close');	        	
	        	window.location ="confirmpersonalkey.htm?pk=confirm";
            },
	    	"No": function()
	    	{
	    		$(this).dialog('close');
	        }
	    }
	});
}


function eprlByAuthorizedPerson()
{
	$("#newEprlByAuthorizedPerson").dialog({
		resizable: false,
	    modal: true,
	    draggable: false,
	    closeOnEscape: false,
	    minWidth:450,
	    title: "Attention",
	    open: hideX,
	    buttons:
	    {
	    	"Cancel": function()
	    	{
	    		$(this).dialog('close');
	    		window.location = "eprl.htm";
	        },
	        "Ok": function()
	        {
	        	$(this).dialog('close');
	        }
	    }
	});	
}