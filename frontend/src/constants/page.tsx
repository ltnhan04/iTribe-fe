import blackImage from "../../public/assets/images/black.jpg";
import whiteImage from "../../public/assets/images/white.jpg";
import sandImage from "../../public/assets/images/blue.jpg";
import yellowImage from "../../public/assets/images/yellow.jpg";
import { videos } from "../../public/assets/videos/page";

export const footerLinks = ["About", "Github", "Contact"];

export const hightLightsSlides = [
  {
    id: 1,
    textLists: [
      "Thật nhanh. Thật mượt. Cảm nhận",
      "Điều Khiển Camera hoàn toàn mới.",
    ],
    video: videos[0],
    videoDuration: 5,
  },
  {
    id: 2,
    textLists: [
      "Ống kính camera sáng bóng, thu hút mọi ánh nhìn",
      "Thiết kế camera iPhone 16 Pro tinh tế và hiện đại",
    ],
    video: videos[1],
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Chip A18 Pro hoàn toàn mới. Hiệu",
      "năng vô đối. Tiết kiệm điện vô song.",
    ],
    video: videos[2],
    videoDuration: 5,
  },
  {
    id: 4,
    textLists: ["Bước nhảy vọt về thời lượng pin.", "Vui bất tận."],
    video: videos[3],
    videoDuration: 2,
  },
  {
    id: 5,
    textLists: [
      "iPhone đầu tiên được thiết kế cho Apple Intelligence.",
      "Riêng tư, bảo mật, mạnh mẽ.",
    ],
    video: videos[4],
    videoDuration: 6,
  },
];

export const models = [
  {
    id: 1,
    title: "iPhone 16 Pro Max Titan Đen",
    color: ["#454749", "#3b3b3b", "#181819"],
    img: blackImage,
  },
  {
    id: 2,
    title: "iPhone 16 Pro Max Titan Trắng",
    color: ["#C9C8C2", "#ffffff", "#C9C8C2"],
    img: whiteImage,
  },
  {
    id: 3,
    title: "iPhone 16 Pro Max Titan Tự Nhiên",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"],
    img: yellowImage,
  },
  {
    id: 4,
    title: "iPhone 16 Pro Max Titan Sa Mạc",
    color: ["#6f6c64", "#ffe7b9", "#424245b3"],
    img: sandImage,
  },
];

export const sizes = [
  { label: '6.3"', value: "small" },
  { label: '6.9"', value: "large" },
];

export const carousel = [
  "/assets/images/img1.png",
  "/assets/images/img2.png",
  "/assets/images/img3.png",
];

export const COLORS = ["#FFB020", "#14B8A6", "#10B981"];
