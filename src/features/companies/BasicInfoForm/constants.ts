import { prefectures } from "@/constants/prefectures"

export const STATUS_OPTIONS = [
  { label: "エントリー前", value: "エントリー前" },
  { label: "選考中", value: "選考中" },
  { label: "内定", value: "内定" },
  { label: "辞退", value: "辞退" },
  { label: "お見送り", value: "お見送り" },
]


export const LOCATION_OPTIONS = Object.values(prefectures).map((prefecture) => ({
  label: prefecture.value,
  value: prefecture.value,
}))
