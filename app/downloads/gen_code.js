import QRCode from 'qrcode';
// GoogleカレンダーのイベントURLを生成
// 使い方
// node --experimental-modules app/downloads/gen_code.js

// const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=第69回自動制御連合講演会&dates=20261107T000000Z/20261109T000000Z&location=東京都市大学世田谷キャンパス〒158-8557東京都世田谷区玉堤１丁目２８−１&description=https://rengo69.sice.jp/&trp=false';
const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=第69回自動制御連合講演会&dates=20261107/20261109&location=東京都市大学世田谷キャンパス〒158-8557東京都世田谷区玉堤１丁目２８−１&description=https://rengo69.sice.jp/&trp=false';

// QRCode.toDataURL(googleCalendarUrl, (err, url) => {
//   if (err) console.error(err);
//   else console.log(url);  // 画像のDataURLが得られるので、imgタグのsrcにセット可能
// });

QRCode.toFile('calendar_event_qr.png', googleCalendarUrl, {
  errorCorrectionLevel: 'L'  // L, M, Q, H から選択
}, err => {
  if (err) {
    console.error('QRコード生成失敗:', err);
  } else {
    console.log('QRコード画像 calendar_event_qr.png が生成されました');
  }
});