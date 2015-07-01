//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        TestCreation.js
// Purpose:     Javascript functions for the TestCreation.aspx page
//****************************************************************************
// ** Variable Initiation **
//array of divs
//  name = name of the div
//  link = name of link for tab
var DIV_INPUT = 5;
var div = new Array(DIV_INPUT);
for (i=0;i<div.length;i++)
  div[i] = new Array();
div[0]["name"] = 'createDivGeneral';
div[0]["link"] = 'General Information';
div[1]["name"] = 'createDivKey';
div[1]["link"] = 'Key Information';
div[2]["name"] = 'createDivTiming';
div[2]["link"] = 'Timing Information';
div[3]["name"] = 'createDivDesign';
div[3]["link"] = 'Design Criteria';
div[4]["name"] = 'createDivSubmit';
div[4]["link"] = 'Submit';
//array of levels ids for design criteria page
//  id = the id of the element
//  text = the header text for the column
//  type = type of the box
//  name = name of the input, values separated by :
//    split(":")[0] = what kind of filed this is
//    split(":")[1] = the minimum value
//    split(":")[2] = the minimum value
//    split(":")[3] = the amount of precision
//  size = width of the input box
var PGB_INPUT = 10;
var pgb = new Array(PGB_INPUT);
for (i=0;i<pgb.length;i++)
  pgb[i] = new Array();
pgb[0]["id"]   = 'name';                  //drop down of options
pgb[0]["tag"]  = 'select';
pgb[0]["text"] = 'Name';
pgb[0]["name"] = 'txt';
pgb[0]["size"] = '100%';
pgb[1]["id"]   = 'salesWeight';
pgb[1]["tag"]  = 'input';
pgb[1]["type"] = 'text';
pgb[1]["text"] = 'Dollar (% weight)';
pgb[1]["name"] = 'pct:0:100:2';
pgb[1]["size"] = '100%';
pgb[2]["id"]   = 'salesLift';
pgb[2]["tag"]  = 'input';
pgb[2]["type"] = 'text';
pgb[2]["text"] = 'Expected Dollar Lift';
pgb[2]["name"] = 'pct:0:100:2';
pgb[2]["size"] = '100%';
pgb[3]["id"]   = 'unitWeight';
pgb[3]["tag"]  = 'input';
pgb[3]["type"] = 'text';
pgb[3]["text"] = 'Units (% weight)';
pgb[3]["name"] = 'pct:0:100:2';
pgb[3]["size"] = '100%';
pgb[4]["id"]   = 'unitLift';
pgb[4]["tag"]  = 'input';
pgb[4]["type"] = 'text';
pgb[4]["text"] = 'Expected Unit Lift';
pgb[4]["name"] = 'pct:0:100:2';
pgb[4]["size"] = '100%';
pgb[5]["id"]   = 'nbr';
pgb[5]["tag"]  = 'input';
pgb[5]["type"] = 'text';
pgb[5]["text"] = 'Value';
pgb[5]["name"] = 'int:0:-1';              //-1 means that it can be infinite big, will be checked later
pgb[5]["size"] = '30px';
pgb[6]["id"]   = 'nbrDeptHideFineline';
pgb[6]["tag"]  = 'input';
pgb[6]["type"] = 'hidden';
pgb[6]["text"] = 'Department';
pgb[6]["name"] = 'int:0:-1';
pgb[6]["size"] = '100px';
pgb[7]["id"]   = 'nbrSubclassHideFineline';
pgb[7]["tag"]  = 'input';
pgb[7]["type"] = 'hidden';
pgb[7]["text"] = 'Subclass';
pgb[7]["name"] = 'int:0:-1';
pgb[7]["size"] = '100px';
pgb[8]["id"]   = 'nbrSequenceHide';
pgb[8]["tag"]  = 'input';
pgb[8]["type"] = 'hidden';
pgb[8]["text"] = 'Sequence';
pgb[8]["name"] = 'int:0:100';
pgb[8]["size"] = '100px';
pgb[9]["id"]   = 'nbrCategoryHide';
pgb[9]["tag"]  = 'input';
pgb[9]["type"] = 'hidden';
pgb[9]["text"] = 'Category';
pgb[9]["name"] = 'int:0:-1';
pgb[9]["size"] = '100px';
                
//constants
var NBRLEVELS = 6;                //the number of levels for the product group box
var DELIMETER = ":";              //the delimiter for the split of the name attribut on inputs
var MAXPBG = 4;                   //the maximum number of pbg text boxes shown on the screen

//global variables
var userValue = new Array();      //an array of validation objects (main inputs)
var userOrig  = 0;                //variable to hold the original size of the array before adding the pgb
var pgbValue  = new Array();      //an array of validation objects (pgb only)
var isWMUser = false;             //a boolean to indicate if the user is a Walmart employee or not
var xml = "";                     //variable to hold the xml for the search box
var deptOptions = "";             //the department nuumbers and names for the fineline
var searchLast = "";              //to store the object of the last search box open
var testManagerWinNbr = 0;        //test manager win nbr

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        createDivLinks
// Purpose:     Create the links to show the different "screens"
// Parameters:  string (container for tabs)
// Returns:     Nothing
//****************************************************************************
function createDivLinks(container) {
  //create the div
  var linkDiv = document.createElement("div");
  linkDiv.setAttribute((document.all) ? "className" : "class","tabs brdr-primary-bottom");
  linkDiv.setAttribute("id","tabs");
  var link = "";
  for (i=0;i<div.length;i++) {
    //create the link
    link = document.createElement("a");
    link.setAttribute("href","javascript:showDiv('" + div[i]["name"] + "')");
    link.innerHTML = div[i]["link"];
    //add the link to the div
    linkDiv.insertBefore(link);
  }
  //add the div to the page at the top
  var mainDiv = document.getElementById(container).parentNode;
  mainDiv.insertBefore(linkDiv,mainDiv.firstChild);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        showDiv
// Purpose:     Show the div according to the parameter.
// Parameters:  string (the div to show)
// Returns:     Nothing
//****************************************************************************
function showDiv(divParm) {
  for (i=0;i<div.length;i++) {
    document.getElementById(div[i]["name"]).style.display = "none";
  }
  //get the div style
  document.getElementById(divParm).style.display = "block";
  //get the link object
  var links = document.getElementById("tabs").getElementsByTagName("a");
  //loop through all the links
  var myLink = "";
  for (i=0;i<links.length;i++) {
    //change the link class to disabled
    links[i].setAttribute((document.all) ? "className" : "class","brdr-primary");
    //get the current link
    if (links[i].innerHTML.indexOf(divParm.substring(9,divParm.length)) >= 0) {
      var myLink = links[i];
    }
  }
  //change the current link
  myLink.setAttribute((document.all) ? "className" : "class","tab-active brdr-primary");
  //validate all fields if the submit div is acitve
  if (divParm == div[div.length-1]["name"]) { //last div is always submit
    var button = document.getElementById("submitButton");
    //disable the submit button
    button.disabled = true;
    //add the product group box inputs to the array
    addPGBElements();
    //validate
    if (validateAll()) {
      button.disabled = false;
    }
    //document.write(document.getElementById(divParm).innerHTML);
  } else {
    //remove the product group box elements
    removePBGElements(userOrig);
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        loadPage
// Purpose:     Initially load the page and call the functions on pageload
// Parameters:  object (the body of the page)
// Returns:     Nothing
//****************************************************************************
function loadPage(elem) {
  //load the tabs
  createDivLinks('createDivContent');
  showDiv('createDivGeneral');
	//make the Product Group Box
	productGroupOutline();
	//setup the validation array
	validateSkeleton();
	//call the doAJAX function
	doAJAX();
}

//the startup AJAX function
function doAJAX() {
  //call an AJAX function to see if the user is a wal-mart user or not
  var retValue = control_store_testing.TestCreation.isWMUser();
  isWMUser = retValue.value;
  //set the project contact name to be a search if this is a wm user
  var obj = document.getElementById("contactName");
  if (isWMUser) {
    obj.onclick = function () { openSearch('Project Contact Name',this,true); }
    obj.onfocus = function () { openSearch('Project Contact Name',this,true); }
    obj.readOnly = true;
  } else {
    obj.onclick = "";
  }
  //get the departments (remove the option)
	control_store_testing.TestCreation.getDepartments(getDepartments_Callback);
	//get the list of users
	control_store_testing.TestCreation.populateUserDropDown(isWMUser,populateUser_Callback);
}

//the callback function for the departments
function getDepartments_Callback(response) {
	deptOptions = response.value;
}

function populateUser_Callback(response) {
  var obj = document.getElementById("manager");
  eval(response.value);
  //jolive7 added 10/29/2008 to put the proper test manager
  var index = 0;
  if (testManagerWinNbr > 0) {
    for (j=0;j<obj.length;j++) {
      if (obj.options[j].value == testManagerWinNbr) {
        index = obj.options[j].index;
        j = obj.length;
      }
    }
    obj.selectedIndex = index;
  }
  //jolive7 added 10/29/2008 to put the proper test manager
  obj.disabled = false;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        productGroupOutline
// Purpose:     Design the skeleton for the product group box and the submit
//              div
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function productGroupOutline() {
  //fill the xml boxes
  rowPGB.loadXML("<body></body>");
  rowPGBVerify.loadXML("<body></body>");
  createHeaders();   //the header
  addProductRow();   //the rows for the box
  transformProductXML(NBRLEVELS,0);
  //alert(document.getElementById("pgBox").innerHTML);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        createHeaders
// Purpose:     Design the headers for the product group box
// Parameters:  Nothing
// Retunrs:     string (the XML for the header)
//****************************************************************************
function createHeaders() {
  var ASCII = 66;           //ASCII char for B
  var head = "<head>";      //to hold the xml for the header
  for (i=0;i<pgb.length;i++) {
    //start the header column
    head += "<header>";
    //the id
    head += "<id>TH" + pgb[i]["id"] + "</id>";
    //the class (for TH)
    head += "<class>" + ((pgb[i]["id"].indexOf("Hide") > -1) ? "hideCol" : "showCol") + "</class>";
    //the class (for DIV)
    head += "<divClass>col col_" + String.fromCharCode(i+ASCII) + "</divClass>";
    //the text
    head += "<text>" + pgb[i]["text"] + "</text>";
    //end the header column
    head += "</header>";
  }
  head += "</head>";
  headPGB.loadXML(head);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        addProductRow
// Purpose:     Add a row to the product group box (creates HTML) and the
//              submit page (creates HTML)
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function addProductRow() {
  var rows = loadXMLString(rowPGB.xml);
  var body = rows.selectSingleNode("body");
  var ASCII = 66;                 //ASCII char for B
  var myRow = "<row>\n";
  for (x=0;x<pgb.length;x++) {
    myRow += "<col>";
    //the ID of the TD
    myRow += "<cellID>TD" + pgb[x]["id"] + "</cellID>";
    //the ID of the box
    myRow += "<id>" + pgb[x]["id"] + "</id>";
    //the tag
    myRow += "<tag>" + pgb[x]["tag"] + "</tag>";
    //the type (only applies to text boxes)
    myRow += (typeof(pgb[x]["type"]) == 'undefined') ? "" : "<type>" + pgb[x]["type"] + "</type>";
    //the name of the box
    myRow += (typeof(pgb[x]["name"]) == 'undefined') ? "" : "<name>" + pgb[x]["name"] + "</name>";
    //the width of the box
    myRow += "<size>" + pgb[x]["size"] + "</size>";
    //the value
    myRow += "<value></value>"
    //the class (TD Element)
    myRow += "<class>" + ((pgb[x]["id"].indexOf("nbr") > -1) ? "hideCol" : "showCol") + "</class>";
    //the class (DIV Element)
    myRow += "<divClass>col col_" + String.fromCharCode(x+ASCII) + "</divClass>";
    myRow += "</col>\n";
  }
  myRow += "</row>\n";
  body.appendChild(loadXMLString(myRow).selectSingleNode("row"));
  //add the row to the XML
  rowPGB.loadXML(rows.xml);
  //create the verify tags on the submit page
  addPGBVerify();
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        updateAllProductRow
// Purpose:     Loops through all the rows present and updates the XML
// Parameters:  object (the xml to update)
//              int (the last row in the table)
//              string (the id prefix)
// Returns:     string (the updated xml)
//****************************************************************************
function updateAllProductRow(myXML,lastRow,id) {
  for (i=1;i<=lastRow;i++) {
    updateProductRow(myXML,id + i,i - 1);
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        updateProductRow
// Purpose:     Updates the previous row in the XML
// Parameters:  object (the xml to update)
//              string (the id of the row)
//              int (the corresponding row in the xml)
// Returns:     Nothing
//****************************************************************************
function updateProductRow(myXML,id,thisRow) {
  //get a list of the columns
  var row = myXML.selectSingleNode("body").selectNodes("row");
  var col = row[thisRow].getElementsByTagName("col");
  var elem, colID, val, valClass; //other variables used in making the row
  for (x=0;x<pgb.length;x++) {
    //switch on the tag name
    valClass = "hideCol";
    //column Id and the element
    colID = pgb[x]["id"] + id;
    elem = document.getElementById(colID);
    switch (pgb[x]["tag"]) {
      case "input":
        val = elem.getAttribute("value");
        if (pgb[x]["text"] == "Value") {
          valClass = elem.getAttribute((document.all) ? "className" : "class").split(" ")[1];
        }
        break;
      case "select":
        val = elem.selectedIndex;
        break;
    }
    //the value (for the input or innerHTML
    col[x].selectSingleNode("value").text = val;
    //the class (TD Element)
    valClass = ((pgb[x]["id"].indexOf("nbr") > -1) ? ((pgb[x]["id"] == "nbr") ? valClass : "hideCol") : "showCol");
    col[x].selectSingleNode("class").text = valClass;
  }
  //add the row to the XML
  rowPGB.loadXML(myXML.xml);
  updatePGBVerify(loadXMLString(rowPGBVerify.xml),id,thisRow);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        addPGBVerify
// Purpose:     Creates the verify tags on the submit div for the PGB
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function addPGBVerify() {
  //create the starting XML
  var rows = loadXMLString(rowPGBVerify.xml);
  var body = rows.selectSingleNode("body");
  var myRow = "<row>\n";
  for (x=0;x<pgb.length;x++) {
    //start the row
    myRow += "<col>";
    //the ID of the div
    myRow += "<id>" + pgb[x]["id"] + "</id>";
    //the text
    myRow += "<text>" + pgb[x]["text"] + ":</text>";
    //the class (TD Element)
    myRow += "<class>" + ((pgb[x]["id"].indexOf("nbr") > -1) ? "hideCol" : "showCol") + "</class>";
    myRow += "</col>\n";
  }
  myRow += "</row>\n";
  body.appendChild(loadXMLString(myRow).getElementsByTagName("row")[0]);
  //add the row to the XML
  rowPGBVerify.loadXML(rows.xml);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        updatePGBVerify
// Purpose:     Updates the verify tags on the submit div for the PGB
// Parameters:  object (the xml to update)
//              string (the id of the row)
//              int (the corresponding row in the xml)
// Returns:     string (the updated xml)
//****************************************************************************
function updatePGBVerify(myXML,id,thisRow) {
  //get a list of the columns
  var row = myXML.selectSingleNode("body").selectNodes("row");
  var col = row[thisRow].getElementsByTagName("col");
  var valClass = "";
  for (x=0;x<pgb.length;x++) {
    //column Id and the element
    colID = pgb[x]["id"] + "Submit" + id;
    elem = document.getElementById(colID);
    //the class
    valClass = "hideCol";
    if (elem && elem.childNodes.length == 2) {
      //this will weed out the first row which is only for display
      elem = elem.lastChild;
      if (elem) {
        if (elem.getAttribute((document.all) ? "className" : "class").indexOf("hideCol") > -1) {
          valClass = "hideCol";
        } else {
          valClass = "showCol";
        }
      }
    }
    //the class (TD Element)
    valClass = ((pgb[x]["id"].indexOf("nbr") > -1) ? ((pgb[x]["id"] == "nbr") ? valClass : "hideCol" ) : "showCol");
    col[x].selectSingleNode("class").text = valClass;
  }
  //add the row to the XML
  rowPGBVerify.loadXML(myXML.xml);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateSkeleton
// Purpose:     Create the tags necessary from how many user inputs there are
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function validateSkeleton() {
  var NBR_SPAN   = 4;
  var SPAN_REQ   = 0;
  var SPAN_TITLE = 1;
  var SPAN_INPUT = 2;
  var SPAN_ERROR = 3;
  var isReq = false;
  var spanArray, myDiv, fieldset, lastChild;
  var objValue, subDiv, elem;
  var title, subSpan, parentStyle;
  //loop through the divs
  for (i=0;i<div.length-1;i++) {
    //spanArray is an array of all span tags on the div
    spanArray = document.getElementById(div[i]["name"]).getElementsByTagName("span");
    //the validation fieldset'
    myDiv = div[i]["name"].substring(9,div[i]["name"].length);
    fieldset = document.getElementById("validate" + myDiv);
    //if this is the div with the product group box
    lastChild = (div[i]["name"].indexOf("Design") > -1) ? fieldset.firstChild.nextSibling : null
    for (j=0;j<spanArray.length;j++) {
      if (j%NBR_SPAN == 0) {
        //create a new object for every input row
        objValue = new Object();
        //create the div for every input row
	      subDiv = document.createElement("div");
	      subDiv.setAttribute((document.all) ? "className" : "class","createFieldset");
      }
      //the element
      elem = spanArray[j];
      switch (j%NBR_SPAN) {
        case SPAN_REQ:
          if (elem.innerHTML == "*")
            isReq = true;
          else {
            isReq = false;
            if (elem.parentNode.getAttribute((document.all) ? "className" : "class") == "indent") {
              isReq = true;
            }
          }
          objValue.required = isReq;
          break;
        case SPAN_TITLE:
          //used for the title
          title = (elem.parentNode.getAttribute((document.all) ? "className" : "class") == "indent") ? elem.parentNode.parentNode.childNodes[1].innerHTML : "";
          title = (title.indexOf("<") > -1) ? "" : title; //cleans up the title variable to make sure we don't get junk
          title = title.substring(0, title.length-1); //removes the semicolon
          objValue.title = trimString(title + " " + elem.innerHTML);
          break;
        case SPAN_INPUT:
          elem = elem.firstChild;
          //used for the input
          objValue.id = elem.getAttribute("id");
          objValue.error = false;
          objValue.elem = elem;
          //elem.onkeypress = function () { return SuppressBadKey() }
          break;
        case SPAN_ERROR:
          //used for the error
          //save the span error into the object array
          objValue.spanError = elem
          //get the style of the parent tag for special tags like display: none
          parentStyle = elem.parentNode.style.display;
	        subSpan = document.createElement("span");
	        subSpan.setAttribute((document.all) ? "className" : "class","createLabel clearAll");
	        subSpan.innerHTML = objValue.title
	        subSpan.style.display = parentStyle;
	        subDiv.insertBefore(subSpan); //insert the label
	        subSpan = document.createElement("span");
	        subSpan.setAttribute((document.all) ? "className" : "class","createVerify");
          //save the span error into the object array
          objValue.spanText = subSpan;
	        subSpan.style.display = parentStyle;
	        subDiv.insertBefore(subSpan); //insert the verify
	        //add the div to the fieldset
	        fieldset.insertBefore(subDiv,lastChild);
          break;
      }
      //for every third one, push the object on the array
      if (j%NBR_SPAN == NBR_SPAN-1) {
        //userValue is an array of objects that will hold the users information
        userValue.push(objValue);
      }
    }
  }
  userOrig = userValue.length-1;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        addPGBElements
// Purpose:     Validate the divs
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function addPGBElements() {
  var nbrHead = 0;              //used to properly get the div after the Level X heading
  //get the input and select elements from the product group box
  var pgInput = document.getElementById("pgTable").getElementsByTagName("div");
  var pgSpan  = document.getElementById("pgVerify").getElementsByTagName("span");
  var elem, objValue;
  //loop through how many input boxes there are
  for (i=0;i<pgInput.length;i++) {
    nbrHead = (i==nbrHead*(pgb.length+1)) ? nbrHead+1 : nbrHead;
    //the first element is not valid
    if (i != (nbrHead-1)*(pgb.length+1)) {
      //get the element
      elem = pgInput[i].firstChild;
      //create a new object for every input row
      objValue = new Object();
      //used for the input
      objValue.required = true;
      objValue.id = elem.getAttribute("id");
      objValue.error = false;
      objValue.elem = elem;
      objValue.title = trimString(pgSpan[(nbrHead-1)*(pgb.length-1)].innerHTML + " " + pgSpan[((2*i)-(nbrHead-1))-1].innerHTML);
      //the actual error place is every other span
      objValue.spanText = pgSpan[((nbrHead-1)+(2*i))-((nbrHead-1)*2)];
      //userValue is an array of objects that will hold the users information
      userValue.push(objValue);
    }
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        removePGBElements
// Purpose:     Validate the divs
// Parameters:  int (number of original elements in array before)
// Returns:     Nothing
//****************************************************************************
function removePBGElements(orig) {
  for (i=userValue.length-1;i>orig;i--) {
    userValue.pop();
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateAll
// Purpose:     Validate the divs
// Parameters:  Nothing
// Returns:     boolean (true if validation was a success)
//****************************************************************************
function validateAll() {
  var returnValue = true;         //a boolean value that returns true if it all validated
  var totalDec = 0.0;             //to add up all the decimal values to make sure it's 100%
  var lastLevel = "";             //get the name of the last level of the product group box
  var levelName = "";             //to hold the level name
  var startDate, endDate = "";    //start and end date variables to compare dates
  var pgbArray = new Array();     //array of the elements that are supposed to equal to 100%
  var dateArray = new Array();    //an array of dates from the timing page to hold the integer value for the userValue index
  var dateError = false;          //to tell if there is an error with the dates
  var scoreArray = new Array();   //array to hold the indexes for the weights
  var scoreError = false;         //to tell if there is a problem with the weights
  var realValue, value = "";      //to mark down the value to display and for the database
  var output = "<table>";         //a test variable used to see the output of the validation
  //other variables
  var objValue, elem, dec, input; //objects
  var id, errClass, tmpValue;     //strings
  var total;                      //double
  //loop through the userValue array
  for (i=0;i<userValue.length;i++) {
    objValue = new Object();
    elem = userValue[i].elem;
    //get the value
    switch (elem.nodeName.toLowerCase()) {
      case "textarea":
      case "input":
        value = trimString(stripTags(elem.getAttribute("value")));
        if (typeof(userValue[i].specialValue) == "undefined") {
          realValue = value;
        } else {
          realValue = userValue[i].specialValue;
        }
        elem.setAttribute("value",value);
        //get the true value if applicable
        break;
      case "select":
        value = trimString(stripTags(elem[elem.selectedIndex].innerHTML));
        realValue = elem[elem.selectedIndex].value;
        break;
    }
    //switch on first 3 characters
    switch (elem.getAttribute("name").substring(0,3)) {
      case "pct": //percent
        //the validation function
        objValue = validateNbr(value,elem.getAttribute("name"));
        //determine if it's part of the pgb or not
        if (elem.getAttribute("id").search(/[lL]evel[0-9]/) > -1 && elem.getAttribute("id").indexOf("Weight") > -1) {
          totalDec += parseFloat(objValue.value);
          dec = new Object();
          dec = objValue;
          dec.nbr = i;
          //push the value into the array
          pgbArray.push(dec);
        } else if (elem.getAttribute("id").indexOf("Weight") > -1) {
          scoreArray.push(i);
          scoreError = objValue.error;
        }
        break;
      case "cur":
      case "int": //integer
        objValue = validateNbr(value,elem.getAttribute("name"));
        //turn the error off for both the hidden fields only if finline is not the level name
        //is this level id a hidden element
        if (elem.getAttribute("id").search(/[Ll]evel[0-9]/) > -1) {
          //is the level name something other than "Fineline"
          if (levelName != "Fineline" && elem.getAttribute("id").indexOf("Fineline") > -1) {
            objValue.value = "";
            objValue.error = false; 
          }
          if (levelName != "Subcategory" && elem.getAttribute("id").indexOf("Category") > -1) {
			      objValue.value = "";
			      objValue.error = false;
		      }
          
          //disable the value flag if store
          if (levelName == "Store" && elem.getAttribute("id").indexOf("nbr") > -1) {
            if (elem.getAttribute("id").indexOf("Sequence") == -1) {
              objValue.value = "";
              objValue.error = false;
            }
          }
        } else if (!objValue.error) {
          realValue = objValue.value;
          //the minimum value is always before the maximum
          if (elem.getAttribute("id").search(/[Mm]ax/) > -1) {
            if (!userValue[i-1].error && (parseInt(userValue[i-1].value) > parseInt(objValue.value))) {
              objValue.value = "The minimum value can not be greater than the maximum";
              objValue.error = true;
            }
          }
        }
        break;
      case "cal": //date
        //commented out due to wm_yr_wk validation
        /*
        objValue = validateDate(value);
        //if not an error with validation
        if (!objValue.error) {
          //get the id the input box
          id = userValue[i].id;
          //***Test if end is before start date
          //get the start and end days
          if      (id.toLowerCase().indexOf("start") > -1)  { startDate = new Date(value); } //start date
          else if (id.toLowerCase().indexOf("end") > -1)    { endDate = new Date(value);   } //end date
          if (startDate != "" && endDate != "") {
            //we have both a start and end date so compare the two
            if (startDate > endDate) {
              //turn this and the last value to error
              objValue.value = "The Start date must not be before the End date";
              //turn the errors on
              objValue.error = true;
            }
            startDate, endDate = "";
          }
          //***Test other requirments
          //gather the indexes in an array to test later
          //to use: userValue[dateArray["testStart"]] = test start date userValue object
          switch (id) {
            //get the test start date
            case "testStartDt":
              dateArray["testDate"] = new Object();
              dateArray["testDate"].index = i;
              dateArray["testDate"].date = new Date(value);
              break;
            //get the base end date
            case "baseEndDt":  
              dateArray["baseEnd"] = new Object();
              dateArray["baseEnd"].index = i;
              dateArray["baseEnd"].date = new Date(value);
              break;
            case "storeSetDt":
              dateArray["setDate"] = new Object();
              dateArray["setDate"].index = i;
              dateArray["setDate"].date = new Date(value);
              break;
          }
        }
        */
        //get the first day of the wm_yr_wk
        retValue = control_store_testing.TestCreation.getDateforWeek(value,"first");
        if (retValue.value != null && retValue.value.indexOf("Exception") == -1) {
          objValue.value = value;
          objValue.error = false;
          realValue = retValue.value;
        } else {
          objValue.value = "Not a valid Wal-Mart week"
          objValue.error = true;
        }
        //if not an error with validation
        if (!objValue.error) {
          //get the id the input box
          id = userValue[i].id;
          //***Test if end is before start date
          //get the start and end days
          if      (id.toLowerCase().indexOf("start") > -1)  { startDate = value; } //start date
          else if (id.toLowerCase().indexOf("end") > -1)    { endDate = value;   } //end date
          if (startDate != "" && endDate != "") {
            //we have both a start and end date so compare the two
            if (startDate > endDate) {
              //turn this and the last value to error
              objValue.value = "The Start date must not be before the End date";
              //turn the errors on
              objValue.error = true;
            }
            startDate, endDate = "";
          }
          //***Test other requirments
          //gather the indexes in an array to test later
          //to use: userValue[dateArray["testStart"]] = test start date userValue object
          switch (id) {
            //get the test start date
            case "testStartDt":
              dateArray["testDate"] = new Object();
              dateArray["testDate"].index = i;
              dateArray["testDate"].date = value;
              break;
            //get the base end date
            case "baseEndDt":  
              dateArray["baseEnd"] = new Object();
              dateArray["baseEnd"].index = i;
              dateArray["baseEnd"].date = value;
              break;
            case "storeSetDt":
              dateArray["setDate"] = new Object();
              dateArray["setDate"].index = i;
              dateArray["setDate"].date = value;
              break;
          }
        }
        break;
      case "txt": //text
        objValue = validateText(value,elem.getAttribute("name"));
        if (elem.getAttribute("id").search(/nameLevel[0-9]/) > -1 && elem.getAttribute("id") != lastLevel) {
          levelName = elem.getAttribute("value");
          if (levelName == "Choose a Level") { //if the level name is the first option
            objValue.error = true;
            objValue.value = "Please choose a level";
          }
        }
        break;
    }
    if (!userValue[i].required) {
      if (objValue.error && value == "") {
        value = "N/A";
        realValue = "N/A";
        objValue.error = false;
        objValue.value = value;
      }
    }
    //add the value and error to the userValue array
    userValue[i].value = objValue.value;
    userValue[i].error = objValue.error;
    userValue[i].realValue = realValue;
    //the following is used for testing purposes
    output += "<tr><td>" + userValue[i].id + "</td>" +
          "<td>" + i+ "</td>" +
          "<td>" + userValue[i].title + "</td>" +
          "<td>" + userValue[i].realValue + "</td>" +
          "<td>" + elem.getAttribute("name").substring(0,3) + "</td></tr>\n";
  }
  output += "</table>";
  //******************************************************
  //uncomment to look at all the fields and their associated place in the array
  //document.write(output);
  //******************************************************
  //***start cleanup validation
  //check if the totalDec != 100% (for the product group box)
  if (totalDec != 100.0) {
    //put the error flag to true
    userValue[pgbArray[pgbArray.length-1].nbr].error = true;
    userValue[pgbArray[pgbArray.length-1].nbr].value = "The sum of the percent weights must equal 100%";
  }
  //check for the dates if they line up accordingly
  //baseEnd should be before setDate
  //setDate should be before testStart
  if ((dateArray["baseEnd"] != null && dateArray["setDate"] != null) && dateArray["baseEnd"].date > dateArray["setDate"].date) {
    userValue[dateArray["baseEnd"].index].error = true;
    userValue[dateArray["baseEnd"].index].value = "The "+userValue[dateArray["baseEnd"].index].title.substring(0,userValue[dateArray["baseEnd"].index].title.length-1)+
      " must be before the "+userValue[dateArray["setDate"].index].title.substring(0,userValue[dateArray["setDate"].index].title.length-1);
  }
  //already tested setDate above so no need again
  if ((dateArray["testDate"] != null && dateArray["setDate"] != null) && dateArray["setDate"].date > dateArray["testDate"].date) {
    userValue[dateArray["setDate"].index].error = true;
    userValue[dateArray["setDate"].index].value = "The "+userValue[dateArray["setDate"].index].title.substring(0,userValue[dateArray["setDate"].index].title.length-1) +
      " must be before the "+userValue[dateArray["testDate"].index].title.substring(0,userValue[dateArray["testDate"].index].title.length-1);
  }
  //check if the score weights add up to 100%
  if (!scoreError) {
    total = 0.0;
    for (j=0;j<scoreArray.length;j++)
      total += parseFloat(userValue[scoreArray[j]].value);  //add up the values
    if (total != 100.0) {
      userValue[scoreArray[scoreArray.length-1]].value = "The sum of the score weights must equal 100%";
      userValue[scoreArray[scoreArray.length-1]].error = true;
    }
  }
  //***end cleanup validation
  //get rid of the nodes that we pushed on the array during this fuction
  for (i=0;i<userValue.length;i++) {
    //color the text red if there is an error
    elem = userValue[i].spanText;
    if (userValue[i].error) {
      returnValue = false;
      errClass = elem.getAttribute((document.all) ? "className" : "class") + " errMsgSml";
      elem.setAttribute((document.all) ? "className" : "class",errClass);
    } else {
      errClass = elem.getAttribute((document.all) ? "className" : "class").split("errMsgSml");
      elem.setAttribute((document.all) ? "className" : "class",errClass[0]);
    }
    //display the fields
    input = userValue[i].elem;
    elem = userValue[i].spanText;
    tmpValue = userValue[i].value;
    tmpValue = (input.getAttribute("name").substring(0,3) == "pct" && !userValue[i].error) ? userValue[i].value + "%" : userValue[i].value;
    if (input.getAttribute("name").substring(0,3) == "cur" && !userValue[i].error) {
      tmpValue = tmpValue.split(".");
      for (x=0;x<Math.floor((tmpValue[1].length-(1+x))/3); x++) {
        tmpValue = tmpValue[0].substring(0,tmpValue[0].length-(4*x+3)) + ',' +tmpValue[0].substring(tmpValue[0].length-(4*x+3));
      }
      tmpValue = "$" + tmpValue[0] + "." + tmpValue[1];
    }
    elem.innerHTML = tmpValue;
    if (typeof(userValue[i].spanError) == "object") {
      elem = userValue[i].spanError;
      elem.innerHTML = userValue[i].value;
      if (userValue[i].error)
        elem.style.display = "block";
      else
        elem.style.display = "none";
    }
  }
  return returnValue;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        stripTags
// Purpose:     Remove the HTML tags from a string
// Parameters:  string (the text to strip the tags from)
// Returns:     String
//****************************************************************************
function stripTags(value) {
  return value.replace(/<\S[^><]*>/g,"");
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateNbr
// Purpose:     Validate a text field
// Parameters:  int (the number)
//              string (the characteristics of the number)
// Returns:     Object
//****************************************************************************
function validateNbr(value,name) {
  //the name variable contains the following characteristics about the number:
  //  the type of the number (int or decimal)
  //  the min value
  //  the max value
  //  the precision (if decimal)
  var tmpValue = value;               //put the value to a temporary string
  var tmpType  = name.split(DELIMETER)[0];  //the type of the number (int or decimal)
  var tmpMin   = name.split(DELIMETER)[1];  //the minimum value for the field
  var tmpMax   = name.split(DELIMETER)[2];  //the maximum value for the field
  var tmpPerc  = name.split(DELIMETER)[3];  //the precision
  var tmpError = true;                //assume there is an error
  //if min, max, and precision are not present
  tmpMax  = (tmpMax != null) ? parseFloat(tmpMax) : 100;
  tmpMin  = (tmpMin != null) ? parseFloat(tmpMin) : 0;
  tmpPerc = (tmpPerc != null) ? parseFloat(tmpPerc) : 0;
  //is the value blank?
  if (tmpValue == '')         
    { tmpValue = "You did not enter a number"; }
  //is the value a number?
  if (isNaN(tmpValue))        
    { tmpValue = "You did not enter a number"; }
  //below minimum?
  else if (tmpValue < parseFloat(tmpMin)) { 
    tmpMin = (tmpPerc != 0) ? tmpMin.toFixed(tmpPerc) : tmpMin;
    //put a percentage symbol if percent
    tmpMin = (tmpType == "pct") ? tmpMin + "%" : tmpMin;
    tmpMin = (tmpType == "cur") ? "$" + tmpMin : tmpMin;
    tmpValue = "You cannot have a value lower than " + tmpMin;
  }
  //above maximum?
  else if (tmpMax != -1 && tmpValue > parseFloat(tmpMax)) { //-1 means it will be checked later
    tmpMax = (tmpPerc != 0) ? tmpMax.toFixed(tmpPerc) : tmpMax;
    //put a percentage symbol if percent
    tmpMax = (tmpType == "pct") ? tmpMax + "%" : tmpMax;
    tmpMax = (tmpType == "cur") ? "$" + tmpMax : tmpMax;
    tmpValue = "You cannot have a value greater than " + tmpMax; 
  }
  //nothing wrong?
  else { 
    tmpError = false;
    //convert to floating point value
    tmpValue = parseFloat(tmpValue);
    //add decimal places if percision is not 0
    tmpValue = (tmpPerc != 0) ? tmpValue.toFixed(tmpPerc) : tmpValue.toFixed(0);
  }
  //define a new object
  var objValue = new Object();
  objValue.value = tmpValue;
  objValue.error = tmpError;
  return objValue;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateText
// Purpose:     Validate a text field
// Parameters:  string (the value of the field)
//              string (the characteristics of the number)
// Returns:     Object
//****************************************************************************
function validateText(value,name) {
  var tmpValue = value;               //put the value to a temporary string
  var tmpError = true;                //assume there is an error
  var tmpMax   = name.split(DELIMETER)[1];  //the maximum number of characters allowed
  //is the value blank?
  if (tmpValue == '')   
    { tmpValue = "You did not enter a value"; }
  //too many characters
  else if (tmpValue.length > tmpMax)
    { tmpValue = "You had " + parseInt(tmpValue.length - tmpMax) + " characters more than the allowed " + tmpMax + " characters"; }
  //nothing wrong?
  else
    { tmpError = false; }
  //define a new object
  var objValue = new Object();
  objValue.value = tmpValue;
  objValue.error = tmpError;
  return objValue;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateDate
// Purpose:     Validate a date field
// Parameters:  string (the value of the field)
// Returns:     Object
//****************************************************************************
function validateDate(value) {
  var tmpValue = value;  //put the value to a temporary string
  var tmpError = true;   //assume there is an error
  var now = new Date();
  var m = tmpValue.split("/")[0];
  var d = tmpValue.split("/")[1];
  var y = tmpValue.split("/")[2];
  //regex format the date should be in
  var re = /[0-9][0-9]\/[0-9][0-9]\/[0-9]{4}/;
  //is the date in the proper format?
  if  (!tmpValue.match(re))
    { tmpValue = "Date must be in the format mm/dd/yyyy"; }
  //is the month wrong?
  else if (m < 1)
    { tmpValue = "Invalid Month"; }    
  else if (m > 12)
    { tmpValue = "Invalid Month"; }
  //day too small?
  else if (d < 1)
    { tmpValue = "Day can not be less than "+m+"/01/"+y; }
  //day too large?            
  else if (d > getDays(m,y))
    { tmpValue = "Day can not be greater than "+m+"/"+getDays(m,y)+"/"+y; }
  //is the day more than two years back
  else if (twoYearsBack(m,d,y)) 
    { tmpValue = "Day can not be more than two years back" }
  //nothing wrong?
  else
    { tmpError = false; }
  //define a new object
  var objValue = new Object();
  objValue.value = tmpValue;
  objValue.error = tmpError;
  return objValue;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        getDays
// Purpose:     Get the total number of days for a given month/year
// Parameters:  string (month)
//              string (year)
// Returns:     int (the last day of the month)
//****************************************************************************
function getDays(m,y) {
  var days = new Date(y,m,0);
  return days.getDate();
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        twoYearsBack
// Purpose:     Get the date two years back and send a boolean if the date
//              is in the range or not
// Parameters:  string (month)
//              string (day)
//              string (year)
// Returns:     int (the last day of the month)
//****************************************************************************
function twoYearsBack(m,d,y) {
  var oneDay=1000*60*60*24
  var myDate = new Date(y,m-1,d);
  var today = new Date();
  var twoYearsAgo = new Date(today.getFullYear()-2,today.getMonth(),today.getDate())
  return myDate < twoYearsAgo;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        submitForm
// Purpose:     Submits the form to database
// Parameters:  button (the button object that clicked on Submit)
// Returns:     Nothing
//****************************************************************************
function submitForm() {
  var seeArray = "";
  //dump the values of the userValue array into a temp array
  var valueArray = new Array(userValue.length);
  //other variables
  var name;
  var i=0;
  while (i<userValue.length && !userValue[i].error) {
  //while (i<userValue.length) {
    valueArray[i] = replaceTicks(userValue[i].realValue);
    //userValue[i].realValue = "";
    //change the values of the percents and currency / 100
    name = userValue[i].elem
    name = name.getAttribute("name").substring(0,3);
    valueArray[i] = (name == "pct") ? valueArray[i]/100 : valueArray[i];
    seeArray += "[" + i + "] " + userValue[i].title + " " + valueArray[i] + "\n";
    i++;
  }
  //alert(seeArray);
  //if no errors
  if (userValue.length == valueArray.length) {
    var retValue = control_store_testing.TestCreation.submitTest(valueArray,(isWMUser) ? 1 : 0,testID);
    if (retValue.value.indexOf("Exception") == -1) {
      if (testID == 0) {
        alert("Successfully created!");
        goToSpecifiedPage("./StoreMatch.aspx",retValue.value);
      } else {
        alert("Successfully updated!");
        menuNavigate("./StoreMatch.aspx");
      }
    } else {
      if (testID == 0) {
        alert("There was an error inserting the test information");
      } else {
        alert("There was an error updating the test information");
      }
      if (getCookie("cstdebug") == 2) {
        alert(retValue.value);
      }
    }
  } else {
    alert("There was a problem with one or more fields");
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        indexOf
// Purpose:     Gets the index of the element in an array with up to one
//              array association in it
// Parameters:  array (the array trying to search for)
//              string (the value trying to find)
//              string (the associated value trying to find)
// Returns:     int (index of value in the array)
//****************************************************************************
function indexOf(array,value,assoc) {
  var myValue;
  for (count=0;count<array.length;count++) {
    myValue = array[count][assoc];
    if (myValue == value) { return count; }
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        openSearch
// Purpose:     Shows the search box, sets the top and left values, and puts
//              the id of the calling input into a hidden field
// Parameters:  string (the title of the box)
//              object (the anchor calling the box)
//              boolean (to tell if the box is for an associate search or not)
// Returns:     Nothing
//****************************************************************************
function openSearch(title,obj,assocSearch) {
  var searchBox = ""; //the search box div
  if (obj.getAttribute("id").search(/Category/) >= 0)
    searchBox = document.getElementById("catSearchBox");
  else
    searchBox = document.getElementById("searchBox");
  //build the criteria
  search.loadXML("<search></search>");
  buildCriteria(title,obj.getAttribute("id"),searchBox);
  searchBox.style.display = "block";
  //position the box
  if (!assocSearch) {
    //set the left and top (middle)
    searchBox.style.top = (document.body.clientHeight - searchBox.clientHeight) /2
    searchBox.style.left = (document.body.clientWidth - searchBox.clientWidth) / 2
  } else {
    //set the left and top (to right of field)
    searchBox.style.top = getTop(obj);
    searchBox.style.left = getLeft(obj) + obj.clientWidth + 10; //10 is for padding
  }
  //add a mouse listener to tell for the mouseup event
  searchLast = searchBox;
  document.onmouseup = hideSearch;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        buildCriteria
// Purpose:     Build the elements that the user will search by
// Parameters:  string (the title of the box)
//              string (the anchor id)
//              object (the object to stick the transformed xml to)
// Returns:     Nothing
//****************************************************************************
function buildCriteria(title,anchor,obj) {
  //create the starting XML
  var searchXML = loadXMLString(search.xml).selectSingleNode("search");
  var strCrit = new Array();                                //array of titles and anchor ids to put for the inputs
  var nbrInputs = 2;                                        //the number of inputs that are needed
  var dept, sub = "";                                       //to hold the element and id of the department and subclass
  var row = "";                                             //the XML
  var index;
  var id;
  //create the XML
  searchXML.appendChild(loadXMLString("<title>" + title + "</title>").selectSingleNode("title"));
  //set up the main elements
  switch (title) {
    case 'Project Contact Name':
    case 'Test Manager':
      strCrit.push("User Id:");
      strCrit.push(anchor);
      nbrInputs = 1;
      break;
    case 'Subcategory':
      strCrit.push(pgb[pgb.length-1]["text"] + ":");
      strCrit.push(pgb[pgb.length-1]["id"] + anchor.substring(anchor.search(/[Ll]evel[0-9]/),anchor.length) + "Search");
      strCrit.push(title + " #:");
      strCrit.push(anchor);
      strCrit.push(title + " Desc:");
      strCrit.push("");
      nbrInputs = 3;
      break;
    case 'Fineline':
      //2 additional inputs for fineline
      for (i=0;i<2;i++) {
        strCrit.push(pgb[pgb.length-(4-i)]["text"] + ":");
        strCrit.push(pgb[pgb.length-(4-i)]["id"] + anchor.substring(anchor.search(/[Ll]evel[0-9]/),anchor.length));
      }
      //push the titles - a stack is fifo so push on according to what comes out first
      strCrit.push(title + " #:");
      strCrit.push(anchor);
      strCrit.push(title + " Desc:");
      strCrit.push("");
      nbrInputs = 4;
      break;
    default:
      strCrit.push(title + " #:");
      strCrit.push(anchor);
      strCrit.push(title + " Desc:");
      strCrit.push("");
      break;
  }
  //loop through the number of inputs needed
  for (i=1;i<=nbrInputs;i++) {
    //start the row
    row = "<row>";
    for (x=0;x<2;x++) {
      index = ((i-1)*2)+x;
      if (x==0) {
        //put the text
        row += "<text>" + strCrit[index] + "</text>"
      } else {
        id = strCrit[index];
        //put the id
        row += "<id>" + id + "</id>"
        //is this an element we should make a select box
        if (id.indexOf("Hide") > -1) {
          if (id.indexOf("Dept") > -1)
            dept = id + "Select";
          else if (id.indexOf("Subclass") > -1)
            sub = id + "Select";
        }
      }
    }
    row += "</row>";
    searchXML.appendChild(loadXMLString(row).selectSingleNode("row"));
  }
  search.loadXML(searchXML.xml);
  obj.innerHTML = transformSearchBoxXML(search.xml,nbrInputs);
  //alert(obj.innerHTML);
  if (title == "Fineline") {
    dept = document.getElementById(dept);
    sub  = document.getElementById(sub);
    dept.onchange = function() { setSubclass(sub,this[this.selectedIndex].value); }
    setDept(dept);
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        setDept
// Purpose:     Gets and sets the department information
// Parameters:  object (the element of the select box)
// Returns:     Nothing
//****************************************************************************
function setDept(elem) {
  if (deptOptions != "")
    eval(deptOptions)
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        setSubclass
// Purpose:     Gets and sets the subclass information
// Parameters:  object (the element of the select box)
//              int (the department choosen)
// Returns:     Nothing
//****************************************************************************
function setSubclass(elem,dept) {
  var record = control_store_testing.TestCreation.getSubclass(dept);
  //clear out the select box
  elem.length = 0;
  //add the first option
  addOption(elem,'Subclass...',elem.getAttribute("id"),true);
  eval(record.value);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        hideSearch
// Purpose:     Tells if the mouse click was within the boundaries of the div
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function hideSearch() {
  var isSearch = false;   //boolean to tell if what was click on was the search box or not
  var obj = event.srcElement;
  //loop through all the elements until you hit the top element 
  while (obj.parentElement != null) {
    //if you come accross the element id "searchbox" then we need to stay open
    if (obj == searchLast) {
      isSearch = true;
    }
    obj = obj.parentNode;
  }
  //did we not come across the searchbox?
  if (!isSearch)
    closeBox();
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        showWait
// Purpose:     Shows the wait screen in a given div (validate before)
// Parameters:  string (the id of the object)
// Returns:     Nothing
//****************************************************************************
function showWait(id) {
  var obj = findObjById("div",id);
  //let the user know that the program is working by putting a RL load GIF in the results box
	obj.innerHTML = "<div style='position: absolute;display: block;height: 100%;width: 100%;background: #fff url(/styles/img/skins/default/loader_blue_34x34.gif) no-repeat center;'></div>"
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateSearch
// Purpose:     Validate the search box
// Parameters:  Nothing
// Returns:     boolean (if there was an error)
//****************************************************************************
function validateSearch() {
  //validate the fields
  var objArr = new Array();
  var bError = false;   //to indicate if there was an error
  var nbrOrs = 0;       //to indicate if there was at least one "or" field
  var nbrErr = 0;       //to count the number of "or" errors
  var obj = "";         //the object that returns from the validateField function
  var errMsg = "";      //to hold the error message
  //first loop through all fields
  var input = searchLast.getElementsByTagName("input");
  //do quick validation
  for (x=0;x<input.length;x++) {
    if (input[x].getAttribute("type") == "text" && input[x].getAttribute("id") != "txtGoToPage") {
      obj = new Object();
      obj = validateField(input[x].getAttribute("value"),input[x].getAttribute("name"));
      obj.userValue = input[x].getAttribute("value");
      obj.bitwise = trimString(input[x].nextSibling.innerHTML);
      objArr.push(obj);
    }
  }
  //do further validation on only the inputs
  x = 0;
  while (!bError && x<objArr.length) {
    if (objArr[x].bitwise == "or") {
      nbrOrs++;
      if (nbrOrs == 1) {
        errMsg = objArr[x].value;
      }
      if (objArr[x].error) {
        nbrErr++;
      }
    } else {
      if (objArr[x].error) {
        bError = true;
        errMsg = objArr[x].value;
      }
    }
    x++;
  }
  //see if the number of "or" errors equal the number of "or"s
  if (nbrErr == nbrOrs) {
    bError = true;
  }
  if (bError) {
    alert(errMsg);
    return false;
  }
  return true;
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        validateField
// Purpose:     Call the specialized functions for validating a date, number,
//              and text field
// Parameters:  string (the value)
//              string (the name)
// Returns:     boolean (if there was an error)
//****************************************************************************
function validateField(value,name) {
  switch (name.substring(0,3)) {
    case "cur":
    case "pct":
    case "int":
      return validateNbr(value,name);
    case "cal":
      return validateDate(value);
    case "txt":
      return validateText(value,name);
  }
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        searchByUser
// Purpose:     Searches for an associate in the database
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function searchByUser() {
  //translation
  var transPhraseArr = new Array();
	transPhraseArr[0] = testCreateNoData;
	transPhraseArr[1] = testCreatePrevP;
	transPhraseArr[2] = testCreateNextP;
	transPhraseArr[3] = testCreateGoTo;

  //variables to pas to AJAX
  var currPage = searchLast.document.getElementById('txtCurrentPage').getAttribute("value");
  var pageSize = searchLast.document.getElementById('txtPageSize').getAttribute("value");
  var user = searchLast.getElementsByTagName("input")[0].getAttribute("value");
  //make a call to assocSearch AJAX function
  //alert(document.getElementById('txtCurrentPage').getAttribute("value"));
  control_store_testing.TestCreation.assocSearch(user,currPage,pageSize,transPhraseArr,searchByUser_Callback);
}

function searchByUser_Callback(response) {
  findObjById("div","searchResults").innerHTML = response.value
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        searchByPGB
// Purpose:     Searches by the title in the databse
// Parameters:  string (the title of the box)
// Returns:     Nothing
//****************************************************************************
function searchByPGB() {
  //variables
  var id;             //string
  var val;            //array
  var input, select;  //objects
  //test if there is already xml
  var retValue = (xml.indexOf("Row")) ? xml : "";
  if (retValue == "") {
    //temp array to send to the AJAX function
    val = new Array();
    //get the inputs from the screen
    input  = searchLast.getElementsByTagName("input");
    select = searchLast.getElementsByTagName("select");
    val["level"] = searchLast.getElementsByTagName("span")[0].innerHTML;
    //this is the loop for the inputs
    for (i=0;i<input.length-1;i++) {
      //if there is no id then the input is the description
      id = input[i].getAttribute("id");
      //get the level on first itteration
      id = (id != "") ? id.substring(0,id.search(/[Ll]evel[0-9]/)) : "desc";
      //chop off the other stuff if fineline off of dept and subclass
      if (id.match(/Cat/)) {
        if (val["level"].search(/Subcat/) >= 0)
          id = "cat";
        else
          id = "nbr";
      }
      val[id] = input[i].getAttribute("value");
    }
    //this is the loop for the selects
    for (i=0;i<select.length;i++) {
      //if there is no id then the input is the description
      id = select[i].getAttribute("id");
      //get the level on first itteration
      id = id.substring(3,id.search(/Hide/)).toLowerCase();
      val[id] = select[i][select[i].selectedIndex].value;
    }
    //make a call to pgbSearch AJAX function
    val["desc"] = "%" + val['desc'].toUpperCase() + "%";
    if (val["level"] == "Fineline") {
      control_store_testing.TestCreation.pgbSearch(val["level"],val["dept"],val["subclass"],val["nbr"],val["desc"],searchByPGB_Callback);
    } else if (val["level"] == "Subcategory") {
      control_store_testing.TestCreation.pgbSearch(val["level"],val["cat"],val["nbr"],val["desc"],null,searchByPGB_Callback);
    } else {
      //alert("Calling BI Service with values: " + val["nbr"] + "|" + val["desc"]);
      control_store_testing.TestCreation.pgbSearch(val["level"],val["nbr"],val["desc"],null,null,searchByPGB_Callback);
    }
  } else {
    searchByPGB_End(xml);
  }
}

function searchByPGB_Callback(response) {
  xml = response.value;
  if (xml == null) {
    alert("The BI Service is not working. Please contact ISD.");
    closeBox();
    return;
  } else {
    searchByPGB_End(xml);
  }
}

function searchByPGB_End(xml) {
  //translation
  var transPhraseArr = new Array();
	transPhraseArr[0] = testCreateNoData;
	transPhraseArr[1] = testCreatePrevP;
	transPhraseArr[2] = testCreateNextP;
	transPhraseArr[3] = testCreateGoTo;
  //variables to pass to XML
  var currPageObj = searchLast.document.getElementById('txtCurrentPage');
  var pageSizeObj = searchLast.document.getElementById('txtPageSize');
  var currPage = currPageObj.getAttribute("value");
  var pageSize = pageSizeObj.getAttribute("value");
  var maxPages = 0;
  //calculate the maximum number of pages
  var re = new RegExp("<Row>", "g")
  var count = 0;
  re.test(xml);
  while (re.lastIndex > 0) {
    count++;
    re.test(xml);
  }
  maxPages = Math.ceil((count * 1.0) / (pageSize * 1.0));
  currPage = (currPage > maxPages) ? maxPages : currPage;
  //insert the XML into the page after transforming it
  findObjById("div","searchResults").innerHTML = transformSearchXML(xml,currPage,pageSize,maxPages,transPhraseArr);
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        prepareSearch
// Purpose:     Searches for an associate in the database
// Parameters:  object (the control on the that is calling the box)
//              boolean (to tell if the box is for an associate search or not)
// Returns:     Nothing
//****************************************************************************
function prepareSearch(myCtrl,assocSearch) {
  xml = "";
  showWait("searchResults",myCtrl);
	if (myCtrl.style.cursor != "default") {
	  //this is the first page
		searchLast.document.getElementById('txtCurrentPage').setAttribute("value","1");
		if (assocSearch) {
		  //alert("searching by user");
		  searchByUser();
		} else {
		  //alert("searching by pgb");
		  searchByPGB();
		}
	}
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        returnUser
// Purpose:     Returns the name of the associate to the field
// Parameters:  string (the text to be displayed)
//              string (the win nbr)
// Returns:     Nothing
//****************************************************************************
function returnUser(text,val) {
  //get the inputs from the screen
  var input = searchLast.getElementsByTagName("input")[0];
  //get the anchor
  var anchor = document.getElementById(input.getAttribute("id"));
  anchor.setAttribute("value",text);
  //find the index of the anchor field in the array
  var i = indexOf(userValue,input.getAttribute("id"),"id");
  userValue[i].specialValue = val;
  //close and cleanup
  closeBox();
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        returnPGB
// Purpose:     Returns the PGB search to the screen
// Parameters:  string (the text to be displayed)
// Returns:     Nothing
//****************************************************************************
function returnPGB(val) {
  var elem;
  var id;
  //variables to hold the text and value
  var myVal = "";
  var cat = false;
  //get the inputs from the screen
  var input = searchLast.getElementsByTagName("span");
  //loop through the inputs - the last input is the button
  for (i=0;i<input.length-1;i++) {
    elem = input[i].firstChild;
    if (elem.nodeName.toLowerCase() == "input" || elem.nodeName.toLowerCase() == "select") {
      //don't bother if the input is blank
      if (elem.getAttribute("id") != "") {
        //the element to save the value into
        id = elem.getAttribute("id");
        if (id.search(/Select/) >= 0) {
          id = id.substring(0,id.search(/Select/));
        }
        if (findObjById("span","searchTitle").innerHTML.search(/Subcat/) >= 0 && id.search(/Search/) >= 0) {
          id = id.substring(0,id.search(/Search/));
          cat = true;
        }
        var anchor = document.getElementById(id);
        //remove the Select from the ends of the select boxes
        //get the value
        if (elem.nodeName.toLowerCase() == "input") {
          if (!cat)
            myVal = trimString(stripTags(val));
          else
            myVal = trimString(stripTags(elem.getAttribute("value")));
        } else if (elem.nodeName.toLowerCase() == "select") {
          myVal = trimString(stripTags(elem[elem.selectedIndex].value));
        }
        anchor.setAttribute("value",myVal);
        cat = false;
      }
    }
  }
  //close and cleanup
  closeBox();
}

//****************************************************************************
// Author:      John Oliver (jolive7)
// Name:        closeBox
// Purpose:     Cleanups and closes the search box
// Parameters:  Nothing
// Returns:     Nothing
//****************************************************************************
function closeBox() {
  //the search element
  var searchBox = searchLast;
  //delete the input fields
  searchBox.innerHTML = "";
  //hide the search box
  searchBox.style.display = "none";
  if (searchBox.getAttribute("id").search(/cat/) >= 0) {
    searchLast = document.getElementById("searchBox");
  }
}

//find the proper object
function findObjById(tagName,id) {
  var obj = searchLast.getElementsByTagName(tagName);
  for (n=0;n<obj.length;n++) {
    if (obj[n].getAttribute("id") == id) {
      return obj[n];
    }
  }
}

//Created by Chris Allen (cmallen)
function navPreviousPage(assocSearch)
{ 
	//searchByUser only if the title is test manager
	var currPage = searchLast.document.getElementById('txtCurrentPage').getAttribute("value");
	var maxPage = searchLast.document.getElementById('txtMaxPage').getAttribute("value");
	try
	{
		var currPageInt = parseInt(currPage);
		var maxPageInt = parseInt(maxPage);
		if(currPageInt>1)
		{
			currPageInt--;
			document.getElementById('txtCurrentPage').setAttribute("value",currPageInt);
			if (assocSearch) {
		    //alert("searching by user");
		    searchByUser();
		  } else {
		    //alert("searching by pgb");
		    searchByPGB();
		  }
		}
	}catch(e){}
}

//Created by Chris Allen (cmallen)
function navNextPage(assocSearch)
{
	//searchByUser only if the title is test manager
	var currPage = searchLast.document.getElementById('txtCurrentPage').getAttribute("value");
	var maxPage = searchLast.document.getElementById('txtMaxPage').getAttribute("value");
	try
	{
		var currPageInt = parseInt(currPage);
		var maxPageInt = parseInt(maxPage);
		if(currPageInt<maxPageInt)
		{
			currPageInt++;
			searchLast.document.getElementById('txtCurrentPage').setAttribute("value",currPageInt);
			if (assocSearch) {
		    //alert("searching by user");
		    searchByUser();
		  } else {
		    //alert("searching by pgb");
		    searchByPGB();
		  }
		}
	}catch(e){}
}

//Created by Chris Allen (cmallen)
function navGotoPage(newPage,assocSearch)
{
	//searchByUser only if the title is test manager
	var currPage = searchLast.document.getElementById('txtCurrentPage').getAttribute("value");
	if(newPage!=currPage)
	{
		searchLast.document.getElementById('txtCurrentPage').setAttribute("value",newPage);
		if (assocSearch) {
		  //alert("searching by user");
		  searchByUser();
		} else {
		  //alert("searching by pgb");
		  searchByPGB();
		}
	}
}

//Created by Chris Allen (cmallen)
function gotoPageClick(assocSearch)
{
	try{
		var newPageText = searchLast.document.getElementById('txtGoToPage').value;
		var maxPageText = searchLast.document.getElementById('txtMaxPage').value;
		var newPage = parseInt(newPageText);
		var maxPage = parseInt(maxPageText);
		if(newPage<=maxPage&&newPage>0)
		{
			navGotoPage(newPage,assocSearch);
		}
	}catch(e){}
}

//Checks key press for enter key, sets focus on passed in button when enter is detected---------------------
function CheckKeySearch(subButton)
{
	if (event.keyCode == 13) 
	{
	  if (validateSearch()) {
      showWait("searchResults");
	    waitIndicator(subButton,'on');
		  subButton.click();
		}
	}
}

//Check for ' and remove it
function SuppressBadKey()
{
  var key = event.keyCode;
  if (key == '\''.charCodeAt()) { return false; }
  return key;
}

//for the calendar
function showCalendar(target,anchor) {
  var cal = new CalendarPopup('calDiv');
  cal.select(target,anchor,'MM/dd/yyyy');
}

//for the hidden calendar input
function getWeekForDate(textbox,target) {
  var myDate = textbox.getAttribute("value");
  var retValue;
  var jsDate;
  var i;
  if (validateDate(myDate)) {
    retValue = control_store_testing.TestCreation.getWeekForDate(myDate);
    if (retValue.value != null && retValue.value.indexOf("Exception") == -1) {
      target.setAttribute("value",retValue.value);
    } else {
      alert(retValue.value);
    }
  }
}