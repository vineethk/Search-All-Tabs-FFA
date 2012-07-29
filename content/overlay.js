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

    
    // 2. getGBrowser().getBrowserAtIndex(..) for each of those numbers will give browser elements
    //    Display all the result tabs
    for(var iter = 0; iter < searchTabs.length; ++iter) {
      document.getElementById("search-contents").textContent += SATO.getTabResultCard(iter) + "<br>";
      SATO.getTabResultCard(iter);

    }
    
    //    one can call .contentDocument.title/location etc to get information about that tab
    // 3. getGBrowser().selectTabAtIndex(..) will go to that tab 
   
  },

  getTabResultCard : function(tabIndex) {
    var gBrowserContent = SATO.getGBrowser().getBrowserAtIndex(tabIndex+1).contentDocument;

    return gBrowserContent.title + " | " + gBrowserContent.domain + " | " + gBrowserContent.location;    
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

