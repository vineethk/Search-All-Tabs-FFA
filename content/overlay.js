// the Search All Tabs Object
// used as a namespace, so that we don't create global variables

// UI inspired by: https://abcdefu.wordpress.com/2008/07/25/writing-beautiful-ui-with-xul/
var SATO = {
  
  debug: function(str) {
    window.dump(str + "\n");
  },

  inspect: function(obj) {
    for (var i in obj) {
      SATO.debug(i + ": " + obj[i]);
    }
  },
  
  getLeftTop: function(w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return [left, top];
  },

  getCenter: function(w, h) {
    var x = (screen.width/2)-(w/2);
    var y = (screen.height/2)-(h/2);
    return [x, y];
  },

  showPanel: function() {
    // Position at the center of the screen
    // TODO : Figure out a better way to send the height and width of the panel
    var coordinates = SATO.getCenter(450, 250);
    document.getElementById('log-panel').openPopupAtScreen(coordinates[0], coordinates[1]);
    document.getElementById('log-textbox').focus();
  },

  keyPressed: function(evt) {
    if (evt.keyCode === 13) {
      SATO.performSearch();
    }  
  },
  
  clearAllEntries: function(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  },
  
  createEntry: function(node, str, i, url, domain) {
    var entry = document.createElement("button");
    entry.setAttribute("id", "found-title");
    entry.setAttribute("label", str);
    entry.setAttribute("image","http://"+domain+"/favicon.ico");
    entry.onclick = function() { 
      gBrowser.selectTabAtIndex(i);
      document.getElementById('log-panel').hidePopup();
    };
    // TODO: have the tooltip include number of instances of searchstr found
    entry.setAttribute("tooltiptext", url);
    node.appendChild(entry);  
  },
  
  // entry point 
  performSearch: function() {
    
    var searchStr = document.getElementById("log-textbox").mInputField.value;
    var searchTabs = SATO.getTabIndicesWithSearchTerms(searchStr);
    var searchParentUI = document.getElementById("search-results");
    SATO.clearAllEntries(searchParentUI);
    
    for(var iter = 0; iter < searchTabs.length; ++iter) {
      var curDoc = gBrowser.getBrowserAtIndex(searchTabs[iter]).contentDocument;
      SATO.createEntry(searchParentUI, curDoc.title, searchTabs[iter], curDoc.location.href, curDoc.domain);
    }   
  },

  // returns a gBrowser: keeping it for legacy
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
    for (var iter = 0; iter < gBrowser.browsers.length; ++iter) {
      var curBrowser = gBrowser.getBrowserAtIndex(iter);
       
      if (curBrowser.contentDocument.title.indexOf(searchStr) != -1 ||
          curBrowser.contentDocument.location.href.indexOf(searchStr) != -1 ||
          SATO.hasSearchItem(gBrowser.getBrowserAtIndex(iter), searchStr)) {
        successTabs.push(iter);
      }
    }
    return successTabs;
  },
  
  // code modifed from this source:
  // http://www.borngeek.com/2011/10/03/using-the-nsifind-interface/
  hasSearchItem: function(b, searchStr) {
    
    var doc = b.contentDocument;
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

