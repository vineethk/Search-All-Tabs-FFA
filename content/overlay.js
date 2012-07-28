
var SATO = {
  debug: function(str) {
    window.dump(str + "\n");
  },

  fillWithTabTitles: function() {
    var searchElement = document.getElementById("search-tabs-text-box");
    var alltitles = SATO.getAllTabTitles().join("; ");
    window.dump("All titles = " + alltitles + "\n");
    var foundTitles = SATO.getTabWithSearchTerms(searchElement.value).join("; ")
    window.dump("Search found titles = " + foundTitles + "\n");
  },

  getGBrowser: function() {
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
                       .getInterface(Components.interfaces.nsIWebNavigation)  
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)  
                       .rootTreeItem  
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)  
                       .getInterface(Components.interfaces.nsIDOMWindow);
    return mainWindow.gBrowser;
  },

  getAllTabTitles: function() {
    var titles = [];
    var gBrowser = SATO.getGBrowser();
    window.dump("Get all tab titles\n");
    for (var iter = 0; iter < gBrowser.browsers.length; ++iter) {
      titles.push(gBrowser.getBrowserAtIndex(iter).contentDocument.title); 
    }
    return titles;
  },

  getTabWithSearchTerms: function(searchStr) {
    return SATO.getAllTabsWithSearchTerms(searchStr).map(function(e) { return e.title; });
  },

  getAllTabsWithSearchTerms: function(searchStr) {
    var successTabs = [];
    var gBrowser = SATO.getGBrowser();
    for (var iter = 0; iter < gBrowser.browsers.length; ++iter) {
      var cd = gBrowser.getBrowserAtIndex(iter).contentDocument; 
      if (SATO.hasSearchItem(cd, searchStr)) {
        successTabs.push(cd);
      }
    }
    return successTabs;
  },
  
  hasSearchItem: function(doc, searchStr) {
  // TODO: Note that in practice, we should do some error checking on
  // the following three variables to make sure they are really available
  

  var body = doc.body; // Get a reference to the body element
  
  var term = searchStr; // The term to find, hard-coded for this example
  
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

