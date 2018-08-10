function run() {
  deleteAllRunTrigger(); //実行済みの定時実行用トリガーを削除
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

function _isHoliday() {
  var today = new Date();

  //土日なら true
  var weekInt = today.getDay();
  if(weekInt <= 0 || 6 <= weekInt){
    return true;
  }

  //国民の祝日なら true
  if(!_isHoliday.cacheCalendar) {
    _isHoliday.cacheCalendar = CalendarApp.getCalendarById(
      "ja.japanese#holiday@group.v.calendar.google.com"
    );
  }
  var todayEvents = _isHoliday.cacheCalendar.getEventsForDay(today);
  if(todayEvents.length > 0){
    return true;
  }

  return false;
}

function setTrigger() {
  if (_isHoliday()) return;
  var setTime = new Date();
  setTime.setHours(7);
  ScriptApp.newTrigger("run").timeBased().at(setTime).create();
}

function deleteAllRunTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trg) {
    if (trg.getHandlerFunction() == "run") {
      ScriptApp.deleteTrigger(trg);
    }
  });
}
