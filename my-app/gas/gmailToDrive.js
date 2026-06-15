 const LOG='1q41lwzs1Ron1oLLPwQkD8Svf5eDWVeK_';
 const GOOGLEDRIVE_FOLDER = '1RpDPvjujSevCbnJDYgXjjOQkXc8ul-Xj';

   // 選ばれたpdfファイルをひとつずつ要素に分けて抽出
function pdf_move() {
    const threads = GmailApp.search(
  'from:it-ops@pc2525.com has:attachment is:unread'
   );

  threads.forEach(thread => {
    thread.getMessages().forEach(message => {
      message.getAttachments().forEach(file => {
       
    if (/^monthly_report_.+\.pdf$/i.test(file.getName())) {
       uploadTosupabase(file,thread);
}
      });
    });

  });
 // 選ばれたpdfファイルをひとつずつ要素に分けて抽出


// メモ帳にログを書く
function logdescribe(file,result) {

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(
  today.getMonth() + 1
)
const fileName =
  `${yyyy}_${mm}log.txt`;

const folder = DriveApp.getFolderById(LOG);

const files = folder.getFilesByName(fileName);
let logFile;

if (files.hasNext()) {
  logFile = files.next();
} else {
  logFile = folder.createFile(fileName, "");
}

const currentText = logFile.getBlob().getDataAsString("UTF-8");

const now = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyy/MM/dd HH:mm:ss'
  );

const line = `${now}\n${file.getName()} ${result}`;

logFile.setContent(currentText + '\n' + line);
}
// メモ帳にログを書く


// supabaseにデータをアップロード
function uploadTosupabase(file, thread) {
  
const folder = DriveApp.getFolderById(GOOGLEDRIVE_FOLDER);

  try {
    // 同名ファイルが既に存在する場合はスキップ
    const existing = folder.getFilesByName(file.getName());
    if (existing.hasNext()) {
      logdescribe(file, 'スキップ（既存）');
      thread.markRead();
      return;
    }
    folder.createFile(file);
    thread.markRead();
    logdescribe(file, '保存成功');
  } catch (e) {
    try {
      logdescribe(file, '保存失敗: ' + e.message);
    } catch (e) {
      Logger.log('ログ書き込み失敗: ' + e.message);
    }
  }
}
}
// supabaseにデータをアップロード