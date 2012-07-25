
var SATO = {
  debug: function(str) {
    window.dump(str + "\n");
  },

  // total number of tabs
  num: 0,
  
  // current tab index
  cur: 0,
  
  // finder object
  finder: null, 

  // highlight the next element
  next: function() {
    // number of tabs might have changed, get the latest number
    SATO.num = gBrowser.browsers.length; 

    SATO.debug("calling next with: " + SATO.cur + "of " + SATO.num + "\n");
    // if the current tab is overflowing, reset to the left-most tab
    if (SATO.cur >= SATO.num) {
      SATO.debug("resetting\n");
      SATO.cur = 0; // reset
    }

    // cannot find a valid finder object
    // so get one, and set the search string from the textbox
    if (!SATO.finder) {
      SATO.debug("no SATO.finder\n");
      gBrowser.selectTabAtIndex(SATO.cur);
      var b =  gBrowser.getBrowserAtIndex(SATO.cur);  
      SATO.finder = b.webBrowserFind;
      SATO.finder.searchString = document.getElementById("search-tabs-text-box").value;
      SATO.debug(document.getElementById("search-tabs-text-box").value + " with " + SATO.finder);
    }
    try {
    var result = SATO.finder.findNext();
    } catch (e) {
      SATO.debug("Exception");
      SATO.finder = null;
      result = false;
    }
    SATO.debug(result + "\n")
    // could not find text, get the next one
    if (!result) {
      SATO.debug("not found\n");
      SATO.cur += 1;
      SATO.finder = null;
    }
  }
}

