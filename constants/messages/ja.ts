import { Messages } from '@/types/i18n';

const messages: Messages = {
  title: "高機能機械制御研究室",
  slogan: '理論を駆使してソフトとハードの両面から制御技術の限界にチャレンジ',
  hello: {
    title: '日本語ハローページ',
    greeting: (name: string) => `こんにちは!,${name}`,
    aboutUs: "自動車の衝突防止や車線追従，航空機のオートパイロット，宇宙機の誘導制御など，今日のテクノロジーは制御工学によって大きく発展しました．本研究室では，移動ロボットを対象として，未来の動きを予測することで，周囲の障害物回避，雪道など滑りやすい路面での車輪の横滑りの抑制，さらには車両の自動運転といった最先端の制御工学を研究しています．また，制御性能を高めるためには，ハードウェアをよく理解してソフトと有機的に結合させることも重要です．このために，あらゆる方向に移動可能な四輪独立操舵駆動ロボット・脚の先に車輪を備えた脚車輪型移動ロボットや，それらの回路基板なども研究室で設計・開発し，アルゴリズムの検証と改善に役立てています．このように本研究室では，ソフトとハードの両面から制御技術の限界にチャレンジしています．"
  },
  forApplicantTab: {
    title: "配属希望者へ",
    text: "本研究室の所属学生は様々なことを幅広く学ぶ積極性が求められる，卒論から高度な研究に携わることになります．研究室のモットーは研究を”楽しむ”ことです．研究室での活動を通じて自分を磨きたい人を待っています．"
  },
  accessTab: {
    setagayaCampus: "世田谷キャンパス",
    yokohamaCampus: "横浜キャンパス",
    setagayaCampusAddressStr: "〒158-8557 東京都 世田谷区 玉堤 1-28-1 10号館<br>4F : 401-405室 : 野中謙一郎 教授，関口和真 教授",
    yokohamaCampusAddressStr: "〒224-8551 神奈川県 横浜市 都筑区 牛久保西3-3-1",
    sec_address: "住所",
    sec_toSetagayaCampus: "世田谷キャンパスへのアクセス",
    sec_toYokohamaCampus: "横浜キャンパスへのアクセス"
  },
  lectureTab: {
    sec_bachelor: "学部",
    sec_graduate: "大学院",
  },
  header: {
    tcu: "東京都市大学",
    faculty: "理工学部",
    department: "機械システム工学科",
  },
  footer: {
    copyright: "ACSLab All Rights Reserved."
  }
}
export default messages;