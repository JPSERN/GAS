function run() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var tplSheet = book.getSheetByName("テンプレ");
  var sheetName = _generateSheetName();

  if(tplSheet == null) {
    return;
  }

  if(book.getSheetByName(sheetName) == null) {
    book.setActiveSheet(tplSheet);
    book.moveActiveSheet(0);
    book.insertSheet(sheetName, 0, {template: tplSheet});
  }
}

function _generateSheetName() {
  var week = ["日","月","火","水","木","金","土"];
  var date = new Date();
  return Utilities.formatDate(date, "Asia/Tokyo", "M/d ") + week[date.getDay()];
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
  deleteTriggers("run"); //実行済みの定時実行用トリガーを削除
  var setTime = new Date();
  setTime.setHours(7);
  setTime.setMinutes(0);
  ScriptApp.newTrigger("run").timeBased().at(setTime).create();
}

function deleteTriggers(target) {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trg) {
    if (trg.getHandlerFunction() == target) {
      ScriptApp.deleteTrigger(trg);
    }
  });
}
