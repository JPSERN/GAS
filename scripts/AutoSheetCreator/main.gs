function run() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var template = spreadsheet.getSheetByName("テンプレ");
  var nameStr = _generateSheetName();

  if(template == null) {
    return;
  }

  if(spreadsheet.getSheetByName(nameStr) == null) {
    spreadsheet.setActiveSheet(template);
    spreadsheet.moveActiveSheet(0);
    spreadsheet.insertSheet(nameStr, 0, {template: template});
  }
}

function _generateSheetName() {
  var week = ["日","月","火","水","木","金","土"];
  var date = new Date();
  return Utilities.formatDate(date, "GMT", "M/d ") + week[date.getDay()];
}
