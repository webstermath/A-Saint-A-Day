function doGet() {
    var template=HtmlService.createTemplateFromFile('Index');
    var html=template.evaluate();
    html.setTitle('A Saint A Day');
    //html.setFaviconUrl('http://www.iconj.com/ico/2/7/27anu1ckqt.ico');
    return html;

  
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}