// Google Apps Script 코드 - 방문자 로그 기록용
function doPost(e) {
  // CORS 헤더 설정
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // JSON 데이터 파싱
    var data = JSON.parse(e.postData.contents);
    
    // 스프레드시트 ID와 시트 이름 가져오기
    var sheetId = data.sheetId || '11DGFgaaSEThVp-Zl7Jc7WUOuunGV7UOSYQgdD79Cmo4';
    var sheetName = data.sheetName || 'visitor_logs';
    
    // 스프레드시트 열기
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    
    // 시트 존재 여부 확인 및 없으면 생성
    var sheet;
    try {
      sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        // 헤더 추가
        sheet.appendRow(['timestamp', 'page', 'url', 'userAgent', 'language', 'screenSize', 'referrer']);
      }
    } catch (err) {
      return output.setContent(JSON.stringify({
        'status': 'error',
        'message': '시트를 열 수 없습니다: ' + err.toString()
      }));
    }
    
    // 데이터 추가
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(), 
      data.page || '', 
      data.url || '', 
      data.userAgent || '', 
      data.language || '', 
      data.screenSize || '', 
      data.referrer || ''
    ]);
    
    return output.setContent(JSON.stringify({
      'status': 'success',
      'message': '방문 기록이 저장되었습니다.'
    }));
    
  } catch (err) {
    return output.setContent(JSON.stringify({
      'status': 'error',
      'message': err.toString()
    }));
  }
}

// GET 요청도 처리
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': '방문자 로그 API가 활성화되어 있습니다.'
  })).setMimeType(ContentService.MimeType.JSON);
} 