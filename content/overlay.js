// the Search All Tabs Object
// used as a namespace, so that we don't create global variables
var SATO = {
  debug: function(str) {
    window.dump(str + "\n");
  },

  // entry point 
  performSearch: function() {
    var searchStr = document.getElementById("search-tabs-text-box").value;
    // 1. SATO.getTabIndicesWithSearchTerms will give an array of indices
    var searchTabs = SATO.getTabIndicesWithSearchTerms(searchStr);
    SATO.debug(searchTabs);
    
    // 2. getGBrowser().getBrowserAtIndex(..) for each of those numbers will give browser elements
    //    Display all the result tabs
    for(var iter = 0; iter < searchTabs.length; ++iter) {
      //document.getElementById("search-contents").textContent += SATO.getTabResultCard(iter) + "<br>";
      SATO.setTabResultCard(iter);
      SATO.debug("iter : " + iter);
    }
    
    //    one can call .contentDocument.title/location etc to get information about that tab
    // 3. getGBrowser().selectTabAtIndex(..) will go to that tab 
   
  },

// (wmsuman) TODO: This is too bulky. Fix this 
  setTabResultCard : function(tabIndex) {
    var gBrowserContent = SATO.getGBrowser().getBrowserAtIndex(tabIndex+1).contentDocument;
    var searchContentsContainer = document.getElementById("search-contents");

    // Create a container around each tab result card
    var tabResultContainer = gBrowserContent.createElement("vbox");
    tabResultContainer.setAttribute("class", "tab-result-container");
    searchContentsContainer.appendChild(tabResultContainer);

    // Create the DOM element for title
    var titleP = gBrowserContent.createElement("description");
    titleP.setAttribute("class","resultTabTitle");
    titleP.textContent = gBrowserContent.title;
    SATO.debug("p : " + titleP.textContent);
    tabResultContainer.appendChild(titleP);

    // Create the DOM element for location
    var locationP = gBrowserContent.createElement("a");
    locationP.setAttribute("class","resultTabLocation");
    locationP.setAttribute("target","_blank"); // (wmsuman) TODO : figure out why anchor is not working.
    locationP.textContent = gBrowserContent.location;
    SATO.debug("lp : " + locationP.textContent);
    tabResultContainer.appendChild(locationP);  

    // Container for sharing options
    var tabResultOptions = gBrowserContent.createElement("vbox");
    tabResultOptions.setAttribute("class", "options-container");
    tabResultContainer.appendChild(tabResultOptions);

    // Create the DOM element for sharing using Evernote
    var addToEvernoteImg = gBrowserContent.createElement("img");
    addToEvernoteImg.setAttribute("src","images/add_20x20.png");
    tabResultOptions.appendChild(addToEvernoteImg);

   // Create the DOM element for sharing using 
    var emailImg = gBrowserContent.createElement("img");
    emailImg.setAttribute("src","images/email_20x20.png");
    tabResultOptions.appendChild(emailImg);

    // Create the DOM element for 
    var headToTabImg = gBrowserContent.createElement("img");
    headToTabImg.setAttribute("src","images/arrow_right_20x20.png");
    tabResultOptions.appendChild(headToTabImg); 
  },

  // returns a gBrowser
  getGBrowser: function() {
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
                       .getInterface(Components.interfaces.nsIWebNavigation)  
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)  
                       .rootTreeItem  
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
                       .getInterface(Components.interfaces.nsIDOMWindow);
    return mainWindow.gBrowser;
  },

  // not to be used for now, perhaps later if we change our mind 
  getAllTabTitles: function() {
    var titles = [];
    var gBrowser = SATO.getGBrowser();
    for (var iter = 0; iter < gBrowser.browsers.length; ++iter) {
      titles.push(gBrowser.getBrowserAtIndex(iter).contentDocument.title); 
    }
    return titles;
  },

  // returns an array of integers
  // when these integers are plugged into gBrowser.getBrowserAtIndex()
  // one gets the browser element of a tab that has the searchStr
  getTabIndicesWithSearchTerms: function(searchStr) {
    var successTabs = [];
    var gBrowser = SATO.getGBrowser();
    for (var iter = 0; iter < gBrowser.browsers.length; ++iter) {
      if (SATO.hasSearchItem(gBrowser.getBrowserAtIndex(iter).contentDocument, searchStr)) {
        successTabs.push(iter);
      }
    }
    return successTabs;
  },
  
  // code modifed from this source:
  // http://www.borngeek.com/2011/10/03/using-the-nsifind-interface/
  hasSearchItem: function(doc, searchStr) {
    var body = doc.body; // Get a reference to the body element
    var term = searchStr;
    
    // Create a highlighted span element which we will clone
    // var span = doc.createElement("span");
    // span.setAttribute("style", "background: #FF0; color: #000; " +
    //                  "display: inline !important; font-size: inherit !important;");
    
    // Create our search range
    var searchRange = doc.createRange();
    searchRange.selectNodeContents(body);
    
    // Create the start point
    var start = searchRange.cloneRange();
    start.collapse(true); // Collapse to the beginning
    
    // Create the end point
    var end = searchRange.cloneRange();
    end.collapse(false); // Collapse to the end
    
    // Create the finder instance
    var finder = Components.classes['@mozilla.org/embedcomp/rangefind;1']
            .createInstance(Components.interfaces.nsIFind);
    
    if (finder.Find(term, searchRange, start, end)) {
      return true;
    }
    else return false;

    // Perform the find operation
    // while((start = finder.Find(term, searchRange, start, end)))
    // {
    //     window.dump(start + "\n");
    //     // Clone the highlighter node and surround our search results with it
    //     var hilitenode = span.cloneNode(true);
    //     start.surroundContents(hilitenode);
    // 
    //     // Collapse the starting range to its end point, so we don't find this
    //     // instance again the next time around the loop
    //     start.collapse(false);
    // 
    //     // Workaround for Firefox bug #488427
    //     body.offsetWidth;
    // }

  }
};

