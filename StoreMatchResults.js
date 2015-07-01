//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       StoreMatchResults.js
//  Purpose:    Javascript functions for the StoreMatchResults.aspx page and
//              StoreMatchResultsFilter.aspx page
//****************************************************************************

//****************************************************************************
//  Author:     Victor Romero (v1romer)
//  Name:       unique
//  Purpose:    Takes a sorted array and computes a unique array of elements
//  Parameters: A sorted array duplicates possible
//****************************************************************************
function unique(ar) {
 for ( i=0 ; i<ar.length-1 ; i++ ) {
    for ( j=i+1 ; j<ar.length ; j++ ) {
      if ( ar[i] == ar[j] ) {
        ar.splice(j,1);
        j--;
      }
    }
  }
}

//****************************************************************************
//  Author:     Victor Romero (v1romer)
//  Name:       compare
//  Purpose:    Used internally for the sort function below
//  Parameters: Two stores as strings
//****************************************************************************
function compare(a, b) {
  if ( parseInt(a) < parseInt(b) )
    return -1;
  if ( parseInt(a) > parseInt(b) )
    return 1;
  return 0;
}

//****************************************************************************
//  Author:     Victor Romero (v1romer) with John Oliver (jolive7)
//  Name:       StoreDetais_Callback
//  Purpose:    Callback for Ajax function StoreDetails
//  Parameters: The server response
//****************************************************************************
var THRESHOLD = 3;
var counter = 0;
function StoreDetails_Callback(response) {
  response = response.value;
  if (response.search(/timed[-]out/) == -1 && response.search(/Error/) == -1) {
    //var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    //xmlDoc.async="false";
    //xmlDoc.loadXML(response);
	  var srcTree = loadXMLString(response);
	  var srcRows = srcTree.getElementsByTagName("Row");
	  var retValue = control_store_testing.StoreMatchResults.getFilterArray(srcTree.getElementsByTagName("xsd:schema")[0].xml);
	  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async="false";
    xmlDoc.loadXML(retValue.value);
	  var filterTree = xmlDoc;
	  var filterRows = filterTree.getElementsByTagName("filter");
	  var html = "";
	  var storeNbr = 0;
	  var displayElem = "";
    //create the filters
    for (i=0;i<srcRows.length;i++) {
      html = "";
      for (x=0;x<filterRows.length;x++) {
        if (srcRows[i].selectSingleNode(filterRows[x].selectSingleNode("tag").text) != null) {
          html += "<div style='width: 100%' id='" + filterRows[x].selectSingleNode("tag").text + "'>";
          html += filterRows[x].selectSingleNode("name").text + ": " + srcRows[i].selectSingleNode(filterRows[x].selectSingleNode("tag").text).text
          html += "</div>";
        }
      }
      //get the stores and attach the divs to it
	    storeNbr = srcRows[i].selectSingleNode("Column0").text
      document.getElementById("s"+storeNbr).innerHTML = html;
    }
    //create the display filters box
    createBox(filterTree);
    
	  document.getElementById("storeFields").disabled = false;
	} else {
	  //alert(response);
	  counter++;
	  if (counter < THRESHOLD) { 
	    getStoreDetails();
	  }
	}
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       makeTable
//  Purpose:    Design the datagrid and populate
//  Parameters: testid (The test to show results for)
//****************************************************************************
function makeTable(testid, testVersion) {
 
  var retValue = control_store_testing.StoreMatchResults.StoreMatchSearch(testid, testVersion);
  
  if (retValue.value.indexOf("Exception") < 0) {
    var HTML = document.getElementById("configurePanels");
    
    if(testVersion != '') {
		document.getElementById("storeFields").disabled = true;
		HTML.innerHTML = "<div id='waitPanel' style='DISPLAY: block;BACKGROUND: url(/styles/img/skins/default/loader_blue_34x34.gif) #fff no-repeat center 50%;WIDTH: 100%;POSITION: absolute;HEIGHT: 100%'></div>" + retValue.value;
    }
    else {
		HTML.innerHTML = HTML.innerHTML + retValue.value;
    }
    setHeight(HTML);
    getStoreDetails();
    showWaitDiv(false);
  } else {
  
    var HTML = document.getElementById("configurePanels");
    HTML.innerHTML = "<div id='waitPanel' style='DISPLAY: block;BACKGROUND: url(/styles/img/skins/default/loader_blue_34x34.gif) #fff no-repeat center 50%;WIDTH: 100%;POSITION: absolute;HEIGHT: 100%'></div><div id='resultTable' class='scroll-port' style='display: block;'><table><tbody><tr><td colspan='9'>No results are available for this version.</td></tr></tbody></table></div>";
    showWaitDiv(false);
    document.getElementById("storeFields").disabled = true;
  }
}

function populateSelectBox() {
	var selBox = document.getElementById("versionSel");
	for (i=1;i<maxTestVersion;i++) {
		if (i == maxTestVersion - 1) {
		addOption(selBox,"Version "+i,i,true);
		}
		else {
		addOption(selBox,"Version "+i,i,false);
		}	
	}
}

//sets the height of the box
function setHeight(div) {
  var MAXH = 500;
  var h = 0;
  //set the height to 0 to correctly get the clientHeight
  div.style.height = 0;
  if (div.clientHeight > MAXH) {
    h = MAXH;
  } else {
    h = div.clientHeight;
  }
  div.style.height = h + "px";
}

function getStoreDetails() {
  var tstores = document.getElementsByName('test_store');
  var cstores = document.getElementsByName('cntl_store');
  var stores = new Array(tstores.length + cstores.length);
  
  for ( i=0 ; i<tstores.length ; i++ ) stores[i] = tstores[i].innerText;
  for ( j=0 ; j<cstores.length ; j++,i++ ) stores[i] = cstores[j].innerText;

  stores.sort(compare);
  unique(stores);
  //StoreDetails_Callback(FILTERXML);
  control_store_testing.StoreMatchResults.StoreDetails( "(" + stores.join(",") + ")", StoreDetails_Callback );
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       selectAll()
//  Purpose:    Select all of the checkboxes on the results grid
//  Parameters: element (array of checkbox elements)
//              state (either selected [true] or unselected [false])
//****************************************************************************
/*function toggleCheckbox(state) {
  //get the checkboxs
  var element = document.getElementsByTagName("input");
  for (i=0;i<element.length;i++)
    element[i].checked = state;
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       viewSelected()
//  Purpose:    Show only selected rows
//  Parameters: None
//****************************************************************************
function viewSelected() {
  var countCheck = 0; //counter of checkboxes enabled
  var rowClass = "";  //variable to hold the class name
  //get a list of all the TR elements within the id resultTable
  var dataTable = document.getElementById("resultTable");
  var dataRow   = dataTable.getElementsByTagName("tr");
  //loop through the list of TR elements
  for (i=0;i<dataRow.length;i++) {
    //don't loop every TR tag - only every other one
    if (i%2 == 0) {
      //get the checkbox with the row
      var checkbox = dataRow[i].getElementsByTagName("input");
      dataRow[i].setAttribute((document.all) ? "className" : "class","scroll-row RowHide ");   //row with checkbox
      dataRow[i+1].setAttribute((document.all) ? "className" : "class","scroll-row RowHide "); //filters for row
      //test if the checkbox is not checked
      if (checkbox[0].checked) {
        if (countCheck%2 == 1)
          rowClass = "odd";
        else 
          rowClass = "even";
        rowClass = dataRow[i].getAttribute((document.all) ? "className" : "class").replace(/Hide/,"Show") + rowClass;
        dataRow[i].setAttribute((document.all) ? "className" : "class",rowClass);
        dataRow[i+1].setAttribute((document.all) ? "className" : "class",rowClass);
        countCheck++;
      }
    }
  }
}*/

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       showBox()
//  Purpose:    Open the filter window
//  Parameters: None
//****************************************************************************
function showBox() {
  //create the window
  //window.open('/control_store_testing/StoreMatchResultsFilter.aspx','resultsFilter','menubar=0,toolbar=0,location=0,directories=0,status=0,scrollbars=0,resizable=0,width=500,height=300');
  document.getElementById("filterBox").style.display = "block";
  //set the left and top (middle)
  filterBox.style.top = (document.body.clientHeight - filterBox.clientHeight) /2
  filterBox.style.left = (document.body.clientWidth - filterBox.clientWidth) / 2
  //add a mouse listener to tell for the mouseup event
  document.onmouseup = hideBox;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        hideBox
// Purpose:     Tells if the mouse click was within the boundaries of the div
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function hideBox() {
  var isBox = false;   //boolean to tell if what was click on was the search box or not
  var obj = event.srcElement;
  //loop through all the elements until you hit the top element 
  while (obj.parentElement != null) {
    //if you come accross the element id "searchbox" then we need to stay open
    if (obj.getAttribute("id") == "filterBox") {
      isBox = true;
    }
    obj = obj.parentNode;
  }
  //did we not come across the searchbox?
  if (!isBox)
    closeBox();
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       closeBox()
//  Purpose:    Closes the filter box
//  Parameters: Nothing
//  Return:     Nothing
//****************************************************************************
function closeBox() {
  document.getElementById("filterBox").style.display = "none";
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       createBox()
//  Purpose:    Creates a filter coluumn of checkboxes
//  Parameters: object (the xml to transform)
//  Returns:    Nothing
//****************************************************************************
function createBox(filterTree) {
  var COLNBR   = 3; //nbr of columns in the display fields box
  var filterBox = document.getElementById("filterBox");
  //transform the box
  filterBox.innerHTML = transformDisplayXML(filterTree.xml);
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       saveBox()
//  Purpose:    Saves the filter selections and shows the appropriate display
//              field on the results pane
//  Parameters: None
//****************************************************************************
function saveBox() {
  //this is a flag to indicate if there is atleast one shown display field
  var showDisplay = false;
  //variable to hold the rows to show
  var displayRow = "";
  var showClass = "";
  var fullClass = "";
  var re = /scroll-row (even|odd) (RowShow|RowHide)/;
  //get the inputs and loop through them
  var input = document.getElementsByTagName("input");
  for (i=0;i<input.length;i++) {
    if (input[i].getAttribute("type") == "checkbox") {
      displayRow = document.getElementsByName(input[i].nextSibling.getAttribute("value"));
      showClass = "RowHide";
      //is the input checked
      if (input[i].checked == true) {
        showDisplay = true;
        showClass = "RowShow";
      } 
      for (x=0;x<displayRow.length;x++) {
        displayRow[x].setAttribute((document.all) ? "className" : "class",showClass);
      }
    }
  }
  //get the rows of the display fields to either show or hide it
  displayRow = document.getElementsByName('filterRow');
  showClass = "RowHide";
  if (showDisplay)
    showClass = "RowShow";
  for (i=0;i<displayRow.length;i++) {
    fullClass = displayRow[i].getAttribute((document.all) ? "className" : "class");
    fullClass = fullClass.replace(re,"scroll-row $1 " + showClass);
    displayRow[i].setAttribute((document.all) ? "className" : "class",fullClass);
  }
  setHeight(document.getElementById("configurePanels"));
  closeBox();
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       showWaitDiv()
//  Purpose:    Decides to either show or hide the wait div
//  Parameters: show (boolean on whether to show the wait div or not)
//****************************************************************************
function showWaitDiv(show) {
  var WAIT = 0;
  var RESULT = 1;
  var target = (document.getElementById("configurePanels")) ? self : opener; //detrmine the target
  var myDiv = new Array();
  myDiv[0] = target.document.getElementById("waitPanel").style;
  myDiv[1] = target.document.getElementById("resultTable").style;
  if (show) {
    //show the wait div
    myDiv[WAIT].display = "block";
    myDiv[RESULT].display = "none";
  } else {
    //hide the wait div
    myDiv[WAIT].display = "none";
    myDiv[RESULT].display = "block";
  }
}

//****************************************************************************
//  Author:     John Oliver (jolive7)
//  Name:       insertEndDate()
//  Purpose:    Calculates and inserts the end date into the database
//  Parameters: None
//****************************************************************************
function insertEndDate() {
  if (!objValue.error && (elem.id == "createTextTimingTestNbrOfWks")) {
    //add the number of weeks to the date
    var sDate = new Date(userValue[i-1].value);   //the previous value is the start date
    var nbrWeeks = parseInt(objValue.value * 7);  //seven days in a week
    var eDate = new Date();
    eDate.setDate(sDate.getDate() + nbrWeeks);    //set the date
    //format the date
    var newDate = ((eDate.getMonth() < 10) ? "0" : "") + (eDate.getMonth()+1) + "/" +
                  ((eDate.getDate() < 10) ? "0" : "") + (eDate.getDate()+1) + "/" +
                    eDate.getFullYear();
    //set the date on the input
    document.getElementById(userValue[i+1].id).value = newDate;
  }
}


function showChart(test, control) {
    var versionNbrx = document.getElementById('versionSel');
	var versionNbr = versionNbrx.selectedIndex + 1;
	var urlString = "GenerateReport.aspx?test=" + testID + "&t=" + test + "&c=" + control + "&vers=" + versionNbr;
	//alert("Url is: " + urlString);
	window.open('' + urlString,'DataGraphs','menubar=0,toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=1,width=800,height=600');
}