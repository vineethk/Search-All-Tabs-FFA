
var bwindow = {
  num: 0,
  
  cur: 0,

  bfind: null, 

  next: function() {
    bwindow.num = gBrowser.browsers.length; 
    dump("calling next with: " + bwindow.cur + "of " + bwindow.num + "\n");
    if (bwindow.cur >= bwindow.num) {
      dump("resetting\n");
      bwindow.cur = 0; // reset
    }
    if (!bwindow.bfind) {
      dump("no bwindow.bfind\n");
      var b =  gBrowser.getBrowserAtIndex(bwindow.cur);  
      b.focus();
      bwindow.bfind = b.webBrowserFind;
      bwindow.bfind.searchString = document.getElementById("search-tabs-text-box").value;
      dump(document.getElementById("search-tabs-text-box").value);
    }
    try {
    var result = bwindow.bfind.findNext();
    } catch (e) {
      result = false;
    }
    dump(result + "\n")
    if (!result) {
      dump("not found\n");
      bwindow.cur += 1;
      bwindow.bfind = null;
    }
  }
}


// function runner(evt) {
//  if (evt.charCode === 97) { //a
//    bwindow.next();
//  }
//}

//window.addEventListener("keypress", runner, false);
