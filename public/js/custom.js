
// src/main/webapp/WEB-INF/jsp/forms/custom.js

$(document).ready(function()
{
    $("#committeeId").autocomplete({
        source: function(request, response) 
        {
                $.ajax({
                    url: "getmatchedcommitteeids.htm",
                    data: {committeeId: $("#committeeId").val()},
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
                var committeeIdName = ui.item.value;
                if(committeeIdName.indexOf("-") != -1) 
                {
                    ui.item.value = committeeIdName.substring(0,committeeIdName.indexOf("-"));
                }
            }
    });

    hideSideMenu('navArea', 's');
    [].forEach.call(document.querySelectorAll('.scheduleMenu'), function (el) 
    {
        el.style.display = 'none';
    });

    $(document).keypress(function (e) 
    {
        if (e.which == 13) 
        {
            $('#goToBt').click();
        }
    }); 

    $('.numbersOnly').keyup(function () 
    { 
        this.value = this.value.replace(/[^0-9]/g,'');
    });
}); 

function showInfo(img, id)
{
    $("#" + id).show();
    $("#" + img.id).hide();
    $("#" + "minus" + id).show();
}

function hideInfo(img, id)
{
    $("#" + id).hide();
    $("#" + img.id).hide();
    $("#" + "plus" + id).show();
}

function toggleMenuItem(img, id)
{
    if($( "#" + id ).is( ":visible" ))
    {
        $("#plus" + img).show();
        $("#minus" + img).hide();
    }
    else
    {
        $("#minus" + img).show();
        $("#plus" + img).hide();       
    }
    $("#" + id).toggle('slow');
}

function validateCommitteeId(id)
{
    var isCommitteeIdValid = false;

    if(id.length == 9 && String(id).substr(0, 1).toUpperCase() === "C" && $.isNumeric(String(id).substr(1, 9)) == true)
        isCommitteeIdValid = true;

    return isCommitteeIdValid;
}

function validateCandidateId(id)
{
    var isCanIdValid = false;

    if(id.length == 9 && (String(id).substr(0, 1).toUpperCase() === "H" ||  String(id).substr(0, 1).toUpperCase() === "S" || String(id).substr(0, 1).toUpperCase() === "P") )
        isCanIdValid = true;

    return isCanIdValid;
}

function validateSearch()
{
    var l_committeeId = $("#committeeId").val();

    if( validateCommitteeId( $.trim(l_committeeId) ) == false && validateCandidateId(l_committeeId) == false )
        document.getElementById("committeeId").setAttribute("style", "background-color:#DB7093;");
    else
    {
        $loadingMsg.dialog('open');
        clearSearchError();
        getForms();  
    }
}

// For committee/candidate search
function clearSearchError()
{
    var l_committeeId = $("#committeeId").val();

    if( validateCommitteeId( $.trim(l_committeeId) ) == true )
        document.getElementById("committeeId").setAttribute("style", "background-color:none;");
}

// For contributor search
function clearContributorSearchError()
{
    if( $("#contribuorsName").val() != "" ||
        $("#StreetOneName").val()   != "" ||
        $("#cityName").val()        != "" ||
        $("#stateName").val()       != "" ||
        $("#zipName").val()         != "" ||
        $("#employerName").val()    != "" ||
        $("#occupationName").val()  != "" )
        $("#msgTd").html("");
}

function clearBtn()
{	
    document.getElementById("committeeId").setAttribute("style", "background-color:none;");
    $("#committeeId").val("");
}

$(document).click(function(e)
{
    if( e.target.id && e.target.id.substring(0, 5) == "ui-id" ) 
        clearSearchError();
});

function getForms()
{
    document.getElementById("cmteSearchForm").action = $("#committeeId").val(); 
    document.getElementById("cmteSearchForm").submit(); 
}

function formRoute(formType, reportId, committeeId, tableName, lineNum, lowerLimit, upperLimit)
{	
    var linesPerPage = 100; // use as itemsPerPage in paging
    var repid;

    if(reportId.substring(0, 4).toUpperCase() === "FEC-")
    {
        $("#repid").val( reportId.substring(4) );
        repid = reportId.substring(4)
    }
    else
    {
        $("#repid").val(reportId);
        repid = reportId;
    }

    $("#committeeId").val(committeeId);
    $("#tableName").val(tableName);
    $("#lineNum").val(lineNum);
    $("#lowerLimit").val("0");

    if( parseInt(upperLimit) > 1000)
        upperLimit = 1000;

    $("#upperLimit").val(upperLimit.toString());

    if(formType.toUpperCase() === "SCH" )
    {
        document.getElementById("formRouter").action ="/forms/" + committeeId+ "/" + repid + "/" + tableName + "/" + lineNum;
    }
    else
        document.getElementById("formRouter").action = committeeId + "/" + repid;

    $loadingMsg.dialog('open');
    document.getElementById("formRouter").submit();
}

function hideSideMenu(id, hideShow)
{
    if(hideShow === "h")
    {
        $("#" + id).hide(999, function(){ 
            $("#mainContent").animate({left:'250px'}, 'slow', document.getElementById("mainContent").setAttribute("style", " margin:36px 120px 0px 100px; clear:left;min-height:41vh;") );
        });
        $("#hideMenu").hide();
        $("#showMenu").show(); 
    }
    else if(hideShow === "s")
    {
        $("#" + id).show(999, function(){
            $("#mainContent").animate({left:'250px'}, 'slow', document.getElementById("mainContent").setAttribute("style", "margin:36px 120px 0px 380px; clear:left clear:left;min-height:41vh;") );
        });
        $("#hideMenu").show();
        $("#showMenu").hide();
    }
}

function getCurrentTransactions(lLimit, uLimit, pStart, pEnd, pNum) 
{
    // The following variables must be defined globally elsewhere: fecId, tableName, lineNum, numOfThs, NumOflines, linesPerPage
    var repid        = typeof fecId !== "undefined" ? fecId : "";
    var db           = "EFO";
    var lowerLimit   = lLimit;
    var upperLimit   = uLimit;
    var tableResults = document.getElementById("transactionTblBody");
    var results      = "";
    $.ajax(
    {
        url: "/forms/transactions.htm",
        data: 
        { 
            repid:      repid, 
            db:         db,
            tableName:  typeof tableName !== "undefined" ? tableName : "",
            lineNum:    typeof lineNum !== "undefined" ? lineNum : "",
            lowerLimit: lowerLimit,
            upperLimit: upperLimit
        },
        contentType: "application/json; charset=utf-8",
           dataType: "json", 
        type: "get",
        cache:false,
        async:true,
        beforeSend: function()
        {
            $("#transactionTblBody").html("<tr> <td colspan='" + (typeof numOfThs !== "undefined" ? numOfThs : 1) + "' style='text-align:center;'><img src='/img/hourglass.gif' alt='Loading table...' /></td></tr>");
            $("#pageNavPosition").hide();
        },
        complete: function () 
        { 
            var pager = new Pager('transactionTbl', linesPerPage, NumOflines, pStart, pEnd); 
            pager.init(); 
            pager.showPageNav('pager', 'pageNavPosition'); 
            pager.showPage(pNum);
            $("#pageNavPosition").show();
        },
        success:function(data) 
        {
            if(data.tableData.length > 0 )
            {
                for(var i = 0; i < data.tableData.length; i++)
                {
                    results +=  "<tr>";
                    for(var x = 1; x <= data.totalHeaderColumns; x++)
                    {
                        var tdName  = "TD" + x;
                        var tdValue = data.tableData[i][tdName];
                        results += "<td>" + tdValue + "</td>";
                    }
                    results +=  "</tr>";
                }
                tableResults.innerHTML = results;
            }
            else
            {
                results += "<tr><td style='text-align:center;' colspan='" + data.totalHeaderColumns + "'> No Data Found </td></tr>";
                tableResults.innerHTML = results;
            }
        },
        error:function(data, status, xhr)
        {
            results += "<tr><td style='text-align:center;' colspan='" + (data && data.totalHeaderColumns ? data.totalHeaderColumns : 1) + "'> An error has occurred. Try refreshing the page.</td></tr>";
            tableResults.innerHTML = results;
        }       
    });
}

var $loadingMsg;
$(document).ready(function (){ 
    $loadingMsg = $('<div id="loader1" style="position:fixed;top:45%;min-width:300px;min-height:85px;"></div>')
    .html('<div style="text-align:center;"><img src="/img/hourglass.gif" alt="loading..."/><div style="margin-top:10px; color:white; background-color:#112e51; font-family: "Verdana", Arial, sans-serif;"><b>Please wait...</b></div></div>')
    .dialog({
        autoOpen: false,
        draggable: false,
        title: 'Loading...',
        modal: true,
        resizable: false,
        closeOnEscape: false,
        open: loadingDialogOpen
    });
});

function userMessages(msg, Title)
{
    $("#dialog-confirm").html(msg);
    $("#dialog-confirm").dialog({
        resizable: true,
        modal: true,
        draggable: true,
        width: 700,
        closeOnEscape: false,
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

function showX()
{
    $(".ui-widget-header").css("background", "#112e51");
    $(".ui-dialog .ui-dialog-title ").css("color", "#fff");
    $('.ui-dialog-buttonpane').find('button').addClass('btn primary');
    $('.ui-dialog-buttonset').find('button').addClass('btn primary');
}

function hideX()
{
    $(".ui-widget-header").css("background", "#112e51");
    $(".ui-dialog .ui-dialog-title ").css("color", "#fff");
    $(".ui-dialog-titlebar-close", this.parentNode).hide();
    $('.ui-dialog-buttonpane').find('button').addClass('btn primary');
    $('.ui-dialog-buttonset').find('button').addClass('btn primary');
}

function loadingDialogOpen() 
{
    if(detectIE())
        document.getElementById("loader1").setAttribute("style", "top:45%;min-width:300px;min-height:85px;");
    $(".ui-dialog-titlebar", this.parentNode).hide();
    $(".ui-dialog .ui-dialog-content").css("background", "#fff");
    $(".ui-dialog .ui-dialog-content").css("height", "85px");
}

function sleep(delay) 
{
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function toggleSearch()
{
    if(detectIE())
    {
        $("#searchForm").css("top", "75px");
    }

    var display = $("#searchForm").css( "display" );
    if(display == "none")
        $("#searchForm").css({ 'display':''});
    $("#searchForm").toggle(999, "linear");
    $("#msgTd").html("");
}

function clearSearch()
{
    $("#contribuorsName").val("");
    $("#StreetOneName").val("");
    $("#cityName").val("");
    $("#stateName").val("");
    $("#zipName").val("");
    $("#employerName").val("");
    $("#occupationName").val("");
    $("#msgTd").html("");
}

function schSearch()
{
    if( $("#contribuorsName").val() == "" &&
        $("#StreetOneName").val()   == "" &&
        $("#cityName").val()        == "" &&
        $("#stateName").val()       == "" &&
        $("#zipName").val()         == "" &&
        $("#employerName").val()    == "" &&
        $("#occupationName").val()  == "" )
            $("#msgTd").html("<span style='color:red; font-weight:bold;'>No search criterion was entered. Enter a search criterion and try again.</span>");
    else
    {
        $("#msgTd").html("");
        clearSearch();
        $("#searchForm").toggle(999, "linear");        
    }
}

// Use the correct function for contributor search error clearing
// (call clearContributorSearchError() where needed)

function clearImgSearch()
{
    $("#imageNumber").val("");
    $("#msgTd").html("");
}

function clearSearchImgError()
{
    var imgNo = $("#imageNumber").val();

    if( $.isNumeric( imgNo ) == true && imgNo != "" && (imgNo.length == 11 || imgNo.length == 18) )
        $("#msgTd").html("");
}

function schImgSearch()
{
    var imgNo = $("#imageNumber").val();

    if( $.isNumeric( imgNo ) == false || imgNo == "" || (imgNo.length != 11 && imgNo.length != 18) )
        $("#msgTd").html("<span style='color:red; font-weight:bold;'>Invalid image number. Enter a valid image number and try again.</span>");
    else
    {
        $("#msgTd").html("");
        changeImageNumber();    
    }
}

function exportJsons(repid, tableName, lineNum, wh)
{
    var location     = window.location;
    var indexOfSlash = location.toString().lastIndexOf("/");
    var pgNum        = location.toString().substring(indexOfSlash + 1);
    var lowerLimit   = 0;
    var upperLimit   = 0;
    var st           = 0;
    var ed           = 0;
    var pg           = 0;

    if( $.isNumeric(pgNum) == false )
        pgNum = 1;

    if(wh == "sch")
    {
        st         = findNextOne(pgNum);
        ed         = st + 9;
        pg         = Math.ceil(NumOflines / linesPerPage);
        lowerLimit = (st / 10) * 1000;
        upperLimit = (ed / 10) * 1000;

        if(lowerLimit < 1000)
        {
            lowerLimit = 1;
            upperLimit = 1000;
        }

        if(upperLimit > NumOflines)
            upperLimit = (NumOflines / 10) * 1000;
    }

    $loadingMsg.dialog('open');
    var form    = document.forms['DownloadForm'];
    form.target = '_self';
    form.action = '/forms/export.htm?repid=' + repid + '&tableName=' + tableName + '&lineNum=' + lineNum + '&lowerLimit=' + lowerLimit + '&upperLimit=' + upperLimit + '&wh=' + wh;
    form.submit();
    window.onblur = function() { $loadingMsg.dialog('close'); }
}

function pdfPageCtrl(direction) 
{
    var paddedNewCur;
    var newUrl;

    if(direction == "first" && stringToNumber(newPageNum) != 1 )
    {   
        newPageNum   = 1;
        paddedNewCur = padPageNumber( newPageNum.toString() );
        $("#currentPageNumber").text(newPageNum.toString());
        loadPdf(baseUrl + paddedNewCur + ".pdf");
    }
    else if(direction == "prev" && stringToNumber(newPageNum) != 1 )
    {
        newPageNum   = stringToNumber(newPageNum) - 1;
        paddedNewCur = padPageNumber( newPageNum.toString() );
        $("#currentPageNumber").text(newPageNum.toString());
        loadPdf(baseUrl + paddedNewCur + ".pdf");
    }
    else if(direction == "next" && stringToNumber(newPageNum) != stringToNumber(totalPages) )
    {
        newPageNum   = stringToNumber(newPageNum) + 1;
        paddedNewCur = padPageNumber( newPageNum.toString() );
        $("#currentPageNumber").text(newPageNum.toString());
        loadPdf(baseUrl + paddedNewCur + ".pdf");
    }
    else if(direction == "last" && stringToNumber(newPageNum) != stringToNumber(totalPages) )
    {
        newPageNum   = totalPages;
        paddedNewCur = padPageNumber( newPageNum.toString() );
        $("#currentPageNumber").text(newPageNum.toString());
        loadPdf(baseUrl + paddedNewCur + ".pdf");
    }
    else if(direction == "goto")
    {
        var reqPageNum = stringToNumber( $("#goToPgNum").val() );
        if(reqPageNum > 0 && reqPageNum <= totalPages)
        {
            newPageNum   = stringToNumber( $("#goToPgNum").val() );
            paddedNewCur = padPageNumber( newPageNum.toString() );
            $("#currentPageNumber").text(newPageNum.toString());
            loadPdf(baseUrl + paddedNewCur + ".pdf");
            $("#goToPgNum").val("");
        }
        else
        {
            document.getElementById("goToPgNum").setAttribute("style", "background-color:red; height:21px;width:150px;");
            setTimeout(function()
            { 
                $("#goToPgNum").val("");
                document.getElementById("goToPgNum").setAttribute("style", "background-color:none; height:21px;width:150px;");
            }, 300);
        }
    }   
}

function changeImageNumber() 
{
    var imgNum = $("#imageNumber").val();
    $.ajax(
    {
        url: "/fecimg/newpdfimg.htm",
        data: 
        { 
            imageNumber: $("#imageNumber").val()
        },
        contentType: "application/json; charset=utf-8",
           dataType: "json",  
        type: "get",
        cache:false,
        async:true,
        beforeSend: function()
        {
            $("#PDFArea").html("<div style='height:500px;'><div>");
            $loadingMsg.dialog('open');
            $("#pageCtrl").hide();
        },
        success:function(data) 
        {
            newPageNum     = stringToNumber( data[0].currentPageNumber );
            baseUrl        = data[0].baseUrl;
            currentpageNum = data[0].currentPageNumber;   
            totalPages     = data[0].totalPages; 
            pageNumberlen  = data[0].pageNumberLength;
            fullUrl        = data[0].fullUrl;

            $("#headerOne").text(data[0].committeeName);
            $("#currentPageNumber").text( stringToNumber(currentpageNum) );
            $("#ttlPages").text(totalPages);
            history.pushState(null, null, "/fecimg/?" + imgNum);
            if(data[0].message != "")
                $("#messageArea").text(data[0].message);
            loadPdf(baseUrl + currentpageNum + ".pdf");
            $("#pageCtrl").show();

            $loadingMsg.dialog('close');
            clearImgSearch();
            $("#searchForm").toggle(999, "linear");
        },
        error:function(data, status, xhr)
        {
            $loadingMsg.dialog('close');
            clearImgSearch();
            $("#searchForm").toggle(999, "linear");
            loadPdf(baseUrl + currentpageNum + ".pdf");
            userMessages("An unknown error has occurred. Please verify the Image number and try again.", "Image Number Search Error");
        }       
    });
}

function padPageNumber(pageNumber)
{
    var paddedPageNumber = "";
    var l_pageNumlen     = pageNumber.length;

    if(l_pageNumlen < pageNumberlen )
        for(  x = 1; x <= ( pageNumberlen - l_pageNumlen ); x++ )
            paddedPageNumber += "0";

    return paddedPageNumber + pageNumber;
}

/**
 * copied from: https://codepen.io/gapcode/pen/vEJNZN
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() 
{
      var ua = window.navigator.userAgent;

      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      return false;
}

function formatPhoneNumber(phone)
{
    return phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6,4);
}

function stringToNumber(num)
{
    return Number(num);
}

function removeEndSlash()
{
    var loc     = window.location;
    var locLen  = loc.toString().length;
    var last    = loc.toString().slice(-1);
    var lastTwo = loc.toString().slice(-2);
    if(last == "/" || last == "#")
        window.location = loc.toString().substring(0, (locLen - 1) );
    else if(lastTwo == "/#")
        window.location = loc.toString().substring(0, (locLen - 2) );
}

function routingCmteSearch()
{
    var loc    = window.location;
    var locLen = loc.toString().length;
    var last   = loc.toString().slice(-5);

    if(last.toLowerCase() == "forms")
        window.location = loc.toString() + "/";
    else if(last.toLowerCase() == "uery/")
        window.location = loc.toString() + "forms/";
}

function goToPageNm(pageNum)
{
    $("#goToPageNum").val(pageNum);
    $('#goToBt').click();
}

function goBack(repid, cmteId, x)
{
    if(x == 1)
        window.location = "/forms/";
    else if(x == 2)
        window.location = "/forms/" + cmteId;
    else if(x == 3)
        window.location = "/forms/" + cmteId + "/" + repid;
}

function loadPdf(url)
{
    var options = {
            page: 1,
            pdfOpenParams: {
                navpanes: 1,
                view: "FitH",
                pagemode: "thumbs"
            }
        }; 
        PDFObject.embed(url, "#PDFArea", options);
}

function gotoFullUrl(url)
{
    window.open(url);
}
