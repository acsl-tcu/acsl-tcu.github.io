import { Messages } from '@/types/i18n';

const messages: Messages = {
  title: "Advanced Control Systems Lab.",
  hello: {
    title: 'english hello page',
    greeting: (name: string) => `hello!,${name}`,
    aboutUs: "Collision avoidance or tracking of traffic lane for automobiles, autopilot for airplanes, and navigation control for spacecraft, etc. Up to the present, technology has been achieved tremendous development by control engineering. In our laboratory, we study the following cutting edge control engineering topics. By predicting future motion, obstacle avoidance or suppression of side slip for mobile robots are achieved, and autonomous driving for automobiles is studied. Sophisticated combination of hardware and software is required to enhance control performance. For this purpose, we develop some our own robots by designing electric circuit and mechanism, assembling circuits, sensors and actuators. For example, we have made an omni-directional vehicle with coaxial steering mechanism and a leg-wheel mobile robot which has legs with wheel on the tip. We verify and modify our control algorithms via experiments with these robots. In this manner, our laboratory challenges to the frontier of control technology from both hardware and software."
  }
  // 省略
}
export default messages;