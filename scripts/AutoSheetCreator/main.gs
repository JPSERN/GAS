function run() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var template = spreadsheet.getSheetByName("テンプレ");

  if(template != null) {
    template.copyTo(spreadsheet).setName("8/31 金");
    Logger.log("Create new sheet success.");
  } else {
    Logger.log("Failed.");
  }
}
