//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        StoreMatchEdit.js
// Purpose:     Javascript functions for the StoreMatch.aspx page (when editing)
//****************************************************************************
//to keep track of the current version
var currVersion = 0;

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        doEdit
// Purpose:     This function executes when the page is in edit mode
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function doEdit() {
  var tabID = "";
  var checked = "";
  var tbl, hidden = "";
  var text = new Array();
  var val  = new Array();
  var filterCounter = 0;
  var filterType = 0;
  var testStoreXML = "";
  var ctrlStoreXML = "";
  if (tv == 'no good') {
    alert("There was a problem with the Edit");
    menuNavigate("./StoreMatch.aspx");
  } else {
    //Clear out all the current XML
    //alert("Current XML: " + testTabDivFilters.xml.length);
    testTabDivFilters.loadXML("<filters/>");
    ctrlTabDivFilters.loadXML("<filters/>");
    filtersOrig.loadXML("<filters/>");
    for (k=0;k<tv.length;k++) {
      //alert(tv[k]);
      //the first value in the array is always Store,AddStore,Filter,FilterValues,AddFilter
      switch (tv[k][0]) {
        case 'Store':
          //this is to get the tab name and whether the item was checked or not
          if (tv[k][2] <= 2) {
            tabID = div[0]["name"];
            if (tv[k][2] == 1)
              checked = "false";
            else
              checked = "true";
            testStoreXML += addSingleStore(tv[k][1],checked);  
          } else {
            tabID = div[1]["name"];
            if (tv[k][2] == 3)
              checked = "false";
            else
              checked = "true";
            ctrlStoreXML += addSingleStore(tv[k][1],checked);  
          }
          //alert("nbr: " + tv[k][1] + " | checked: " + checked);
          break;
        case 'Error':
          switch (tv[k][1]) {
			  case "ErrorCode":
				  document.getElementById("errorCode").value = tv[k][2];
  				 
				  break;
			  case "ResultStatus":
				  document.getElementById("resultStatus").value = tv[k][2];
				  break;
			  case "ErrorDesc":
				  document.getElementById("errorDesc").value = tv[k][2];
  				
				  break;	
		  }		
        break;  
        case 'Filter':
          switch (tv[k][1]) {
            case "TestTypeCode":
              if (tv[k][2] <= 2) {
                tabID = div[0]["name"];
              } else {
                tabID = div[1]["name"];
              }
              break;
            case "Group":
              text[filterCounter] = tv[k][2];
              val[filterCounter] = tv[k][3];
              filterCounter++;
              //get the filter XML from BI
              var retValue = control_store_testing.StoreMatch.getFilterOptions(val[0])
              filtersOrig.loadXML(retValue.value);
              break;
            case "Filter":
            case "Oper":
              text[filterCounter] = tv[k][2];
              val[filterCounter] = tv[k][3];
              filterCounter++;
              break;
            case "Values":
              filterType = getFilterType(val[1]);
              switch (parseInt(filterType.text)) {
                case 1:
                  val[filterCounter]  = tv[k][2];
                  text[filterCounter] = tv[k][2];
                  break;
                case 2:
                  if (val[2] == 7) {
                    val[filterCounter]  = tv[k][3];
                    text[filterCounter] = tv[k][3];
                    filterCounter++;
                    val[filterCounter]  = tv[k][4];
                    text[filterCounter] = tv[k][4];
                  } else {
                    val[filterCounter]  = tv[k][2];
                    text[filterCounter] = tv[k][2];
                  }
                  break;
                case 3:
                  if (val[2] == 7) {
                    val[filterCounter]  = tv[k][5];
                    text[filterCounter] = tv[k][5];
                    filterCounter++;
                    val[filterCounter]  = tv[k][6];
                    text[filterCounter] = tv[k][6];
                  } else {
                    val[filterCounter]  = tv[k][2];
                    text[filterCounter] = tv[k][2];
                  }
                  break;
                case 4:
                  text.splice(2,1);
                  val.splice(2,1);
                  break;
              }
              addFilter(val,text,tabID,"",document.getElementById(tabID + "FilterShow"));
              val = new Array();
              text = new Array();
              filterCounter = 0;
              break;
          }
          break;
      }
    }
    //Transform the test store XML
    tbl = document.getElementById(div[0]["name"] + "StoreTable");
    hidden = document.getElementById(div[0]["name"] + "XML");
    transformStoreTable(tbl,hidden,"<rowset>"+testStoreXML+"</rowset>");
    //Transform the control Store XML
    tbl = document.getElementById(div[1]["name"] + "StoreTable");
    hidden = document.getElementById(div[1]["name"] + "XML");
    transformStoreTable(tbl,hidden,"<rowset>"+ctrlStoreXML+"</rowset>");
          
    var msg = "";
    switch (document.getElementById("resultStatus").value) {
  	
	  case "1":
	    msg = "Match is processing.";
	    break;
	  case "0":
	  case "2":  
	    msg = "Match has not been processed yet.";
	    break;
	  case "5":
	  case "3":
	  case "4":
	  case "6":
	  case "8":
	  case "10":
	  case "11":
	  case "13":
	    msg = "The match completed successfully.";
	    break;  
	  case "7":  
	  case "9":
	  case "14":
	    if(document.getElementById("errorCode").value == 0) {
		  msg = "There was an error processing the match.  Please try again.";
	    }
	    else {
	      msg = "There was a problem with your request.  The error was: " + document.getElementById("errorDesc").value + " Please try your request again.";
	    }    
	    break;
	  case "15": 
		  msg = "Too many test stores had no data for the requested information.  Please increase your test stores and resubmit.";    
		  break;
	  case "16": 
		  msg = "Too many control stores had no data for the requested information.  Please increase your control stores and resubmit."; 	
		  break;
	  default:
      //jolive7 added 10/29/2008 to error for insufficient levels
      if (document.getElementById("resultStatus").value > 16) {
        msg = "There was a problem with your request.  Level " + parseInt(parseInt(document.getElementById("resultStatus").value) - 16) + " did not have all the data for the time period selected."
      } else {
  		  msg = "There was a problem processing your request.  Please resubmit."
      }
      //jolive7 added 10/29/2008
		  break;	
    }
    if (msg != "") {
	  alert(msg);
    }
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        getFilterType
// Purpose:     Gets the filtertype from the filter XML
// Parameters:  integer (the filter ID we need to find)
// Returns:     Nothing
//****************************************************************************
function getFilterType(nbr) {
  var origXML  = loadXMLString(filtersOrig.xml).selectSingleNode("filters");
  var origList = origXML.getElementsByTagName("filter");
  for (i=0;i<origList.length;i++) {
    origNode = origList[i].selectSingleNode("filterId");
    if (origNode.text == nbr) {
      return origList[i].selectSingleNode("filterType");
    } 
  }
  return -1;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        getPreviousVersion
// Purpose:     Gets the previous version of the store match from the 
//              database
// Parameters:  int (the version number)
// Returns:     Nothing
//****************************************************************************
function getPreviousVersion(version) {
  if (currVersion != version) {
    var retValue = control_store_testing.StoreMatch.getPreviousVersion(testID,version);
    if (retValue.value != null) {
      eval(retValue.value);
      //remove the from both pages
      for (i=0;i<div.length;i++) {
        document.getElementById(div[i]["name"] + "FilterShow").innerHTML = noFilterText;
      }
      doEdit();
      currVersion = version;
    } else {
      alert("Can't pull back version");
    }
  }
}