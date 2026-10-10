import bannerHero1 from "../img/banner_Hero1.jpg";
import bannerHero2 from "../img/banner_Hero2.jpg";
import bannerHero3 from "../img/banner_Hero3.jpg";

// Built-in images are stored as "builtin:N" so saved banners survive rebuilds
const BUILTIN = { "builtin:1": bannerHero1, "builtin:2": bannerHero2, "builtin:3": bannerHero3 };
export const resolveImg = (img) => BUILTIN[img] || img;

export const DEFAULT_BANNERS = [
  { id: 1, eyebrow: "Introducing the new", title: "Microsoft Xbox 360 Controller", text: "Windows Xp/10/7/8 Ps3, Tv Box", img: "builtin:1", to: "/category/mobile-accessories", active: true },
  { id: 2, eyebrow: "New arrival", title: "Wireless Bluetooth Speaker", text: "Rich, room-filling sound in a compact design.", img: "builtin:2", to: "/category/smartphones", active: true },
  { id: 3, eyebrow: "Just landed", title: "Portable Music Player", text: "Your playlists, always in your pocket.", img: "builtin:3", to: "/category/tablets", active: true },
];
