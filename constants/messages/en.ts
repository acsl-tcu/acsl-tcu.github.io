import { Messages } from '@/types/i18n';

const messages: Messages = {
  title: "Advanced Control Systems Lab.",
  slogan:"We challenges to the frontier of control technology from both hardware and software.",
  hello: {
    title: 'english hello page',
    greeting: (name: string) => `hello!,${name}`,
    aboutUs: "Collision avoidance or tracking of traffic lane for automobiles, autopilot for airplanes, and navigation control for spacecraft, etc. Up to the present, technology has been achieved tremendous development by control engineering. In our laboratory, we study the following cutting edge control engineering topics. By predicting future motion, obstacle avoidance or suppression of side slip for mobile robots are achieved, and autonomous driving for automobiles is studied. Sophisticated combination of hardware and software is required to enhance control performance. For this purpose, we develop some our own robots by designing electric circuit and mechanism, assembling circuits, sensors and actuators. For example, we have made an omni-directional vehicle with coaxial steering mechanism and a leg-wheel mobile robot which has legs with wheel on the tip. We verify and modify our control algorithms via experiments with these robots. In this manner, our laboratory challenges to the frontier of control technology from both hardware and software."
  },
  forApplicantTab: {
    title: "To Prospective Members",
    text: "Collision avoidance or tracking of traffic lane for automobiles, autopilot for airplanes, and navigation control for spacecraft, etc. Up to the present, technology has been achieved tremendous development by control engineering. In our laboratory, we study the following cutting edge control engineering topics. By predicting future motion, obstacle avoidance or suppression of side slip for mobile robots are achieved, and autonomous driving for automobiles is studied. Sophisticated combination of hardware and software is required to enhance control performance. For this purpose, we develop some our own robots by designing electric circuit and mechanism, assembling circuits, sensors and actuators. For example, we have made an omni-directional vehicle with coaxial steering mechanism and a leg-wheel mobile robot which has legs with wheel on the tip. We verify and modify our control algorithms via experiments with these robots. In this manner, our laboratory challenges to the frontier of control technology from both hardware and software. <br> We welcome students who are eager to grow via activities in laboratory."
  },
  accessTab: {
    setagayaCampus: "Setagaya Campus",
    yokohamaCampus: "Yokohama Campus",
    setagayaCampusAddressStr: "Setagaya Campus Building 10 : 401-405\n 1-28-1 Tamazutsumi Setagaya-ku Tokyo\n 402 : Prof. Kenichiro Nonaka and Prof. Kazuma Sekiguchi",
    yokohamaCampusAddressStr: "3-3-1 Ushikubo-nishi Tsuzuki-ku Yokohama-shi Kanagawa",
    sec_address: "Address",
    sec_toSetagayaCampus: "Access to Setagaya Campus",
    sec_toYokohamaCampus: "Access to Yokohama Campus",
    link: "https://www.tcu.ac.jp/english/about/access/"
  },
  publicationTab: {
    journal: "Journal",
    international: "International Conference",
    domestic: "Domestic Conference"
  },
  lectureTab: {
    sec_bachelor: "Undergraduate",
    sec_graduate: "Graduate",
  },
  header: {
    tcu: "TCU",
    faculty: "Faculty",
    department: "Department",
  },
  footer: {
    copyright: "ACSLab All Rights Reserved."
  }
  // 省略
}
export default messages;