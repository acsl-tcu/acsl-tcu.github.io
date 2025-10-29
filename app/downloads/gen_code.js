import QRCode from 'qrcode';

const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=第69回自動制御連合講演会&dates=20261107T000000Z/20261109T000000Z&location=東京都市大学世田谷キャンパス〒158-8557東京都世田谷区玉堤１丁目２８−１&trp=false';

QRCode.toDataURL(googleCalendarUrl, (err, url) => {
  if (err) console.error(err);
  else console.log(url);  // 画像のDataURLが得られるので、imgタグのsrcにセット可能
});
