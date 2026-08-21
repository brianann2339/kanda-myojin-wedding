export type Lang = 'zh' | 'ja' | 'en'

export type Localized = Record<Lang, string>

/**
 * 婚禮資料的單一來源。改日期、加照片、填上表單連結都只需要改這個檔案。
 * 尚未確定的資料一律留 null，畫面會自動顯示「待確認」佔位，不要填假值。
 */
export const wedding = {
  couple: {
    groom: { zh: '侯岳岑', ja: '侯岳岑', en: 'Brian' } as Localized,
    bride: { zh: '莊家焮', ja: '莊家焮', en: 'Justine' } as Localized,
    romaji: 'BRIAN & JUSTINE',
  },

  date: {
    /** 日期敲定後改成 true，並填入 iso 與 time，倒數計時會自動啟用 */
    confirmed: false,
    /** 例：'2027-04-13'。未定為 null */
    iso: null as string | null,
    /** 儀式開始時間，例：'14:30'。未定為 null */
    time: null as string | null,
    /** Hero 的大字 */
    display: '2027 · 04',
    year: 2027,
    month: 4,
    /** 目前規劃的區間說明 */
    estimate: { zh: '預計 4/13 前後', ja: '4/13 前後を予定', en: 'Around April 13' } as Localized,
    main: { zh: '2027 年 4 月', ja: '2027年4月', en: 'April 2027' } as Localized,
  },

  venue: {
    name: { zh: '神田明神', ja: '神田明神', en: 'Kanda Myojin' } as Localized,
    sub: { zh: '東京・千代田區　神前式', ja: '東京・千代田区　神前式', en: 'Chiyoda, Tokyo · Shinto ceremony' } as Localized,
    /** 依神田明神官方網站（kandamyoujin.or.jp/access/），2026-08-21 查證 */
    postalCode: '〒101-0021',
    address: {
      zh: '東京都千代田区外神田2-16-2',
      ja: '東京都千代田区外神田2-16-2',
      en: '2-16-2 Sotokanda, Chiyoda-ku, Tokyo',
    } as Localized,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E7%A5%9E%E7%94%B0%E6%98%8E%E7%A5%9E',
    officialUrl: 'https://www.kandamyoujin.or.jp/',
  },

  /** 車站資料同樣依官方網站逐字核對，walk 為官方標示的徒步分鐘數 */
  stations: [
    {
      id: 'ochanomizu-jr',
      kind: 'jr' as const,
      name: { zh: '御茶ノ水站', ja: '御茶ノ水駅', en: 'Ochanomizu Station' } as Localized,
      exit: { zh: '聖橋口', ja: '聖橋口', en: 'Hijiribashi Exit' } as Localized,
      lines: { zh: 'JR 中央線・總武線', ja: 'JR中央線・総武線', en: 'JR Chuo & Sobu Lines' } as Localized,
      walk: 5,
    },
    {
      id: 'ochanomizu-metro',
      kind: 'metro' as const,
      name: { zh: '御茶ノ水站', ja: '御茶ノ水駅', en: 'Ochanomizu Station' } as Localized,
      exit: { zh: '1 番口', ja: '1番口', en: 'Exit 1' } as Localized,
      lines: { zh: '東京 Metro 丸之內線', ja: '東京メトロ丸ノ内線', en: 'Tokyo Metro Marunouchi Line' } as Localized,
      walk: 5,
    },
    {
      id: 'shin-ochanomizu',
      kind: 'metro' as const,
      name: { zh: '新御茶ノ水站', ja: '新御茶ノ水駅', en: 'Shin-Ochanomizu Station' } as Localized,
      exit: { zh: 'B1 出口', ja: 'B1出入口', en: 'Exit B1' } as Localized,
      lines: { zh: '東京 Metro 千代田線', ja: '東京メトロ千代田線', en: 'Tokyo Metro Chiyoda Line' } as Localized,
      walk: 5,
    },
    {
      id: 'suehirocho',
      kind: 'metro' as const,
      name: { zh: '末廣町站', ja: '末広町駅', en: 'Suehirocho Station' } as Localized,
      exit: null,
      lines: { zh: '東京 Metro 銀座線', ja: '東京メトロ銀座線', en: 'Tokyo Metro Ginza Line' } as Localized,
      walk: 5,
    },
    {
      id: 'akihabara',
      kind: 'jr' as const,
      name: { zh: '秋葉原站', ja: '秋葉原駅', en: 'Akihabara Station' } as Localized,
      exit: { zh: '電氣街口', ja: '電気街口', en: 'Electric Town Exit' } as Localized,
      lines: {
        zh: 'JR 山手線・京濱東北線／Metro 日比谷線',
        ja: 'JR山手線・京浜東北線／メトロ日比谷線',
        en: 'JR Yamanote & Keihin-Tohoku Lines / Metro Hibiya Line',
      } as Localized,
      walk: 7,
    },
  ],

  /** 台灣出發的機場；刻意不放班次，班表會變動 */
  departures: [
    {
      code: 'TPE',
      from: { zh: '台北・桃園', ja: '台北・桃園', en: 'Taipei Taoyuan' } as Localized,
      to: { zh: '東京・羽田／成田', ja: '東京・羽田／成田', en: 'Tokyo Haneda / Narita' } as Localized,
      toCode: 'HND / NRT',
      note: { zh: '北部出發選項', ja: '北部発', en: 'From northern Taiwan' } as Localized,
    },
    {
      code: 'TSA',
      from: { zh: '台北・松山', ja: '台北・松山', en: 'Taipei Songshan' } as Localized,
      to: { zh: '東京・羽田', ja: '東京・羽田', en: 'Tokyo Haneda' } as Localized,
      toCode: 'HND',
      note: { zh: '市區機場出發選項', ja: '市街地の空港発', en: 'City airport to city airport' } as Localized,
    },
    {
      code: 'KHH',
      from: { zh: '高雄・小港', ja: '高雄・小港', en: 'Kaohsiung' } as Localized,
      to: { zh: '東京・羽田／成田', ja: '東京・羽田／成田', en: 'Tokyo Haneda / Narita' } as Localized,
      toCode: 'HND / NRT',
      note: { zh: '南部出發選項', ja: '南部発', en: 'From southern Taiwan' } as Localized,
    },
  ],

  /** 儀式後不設會食（已定案） */
  reception: { happening: false },

  gift: {
    confirmed: true,
    brand: 'TOKYO TULIP ROSE',
    brandLocal: { zh: '東京鬱金香玫瑰', ja: '東京チューリップローズ', en: 'Tokyo Tulip Rose' } as Localized,
    site: 'https://www.tuliprose.jp/',
    /** 禮盒品項與發放方式尚未決定 */
    boxConfirmed: false,
    deliveryConfirmed: false,
  },

  rsvp: {
    /** 取得 Google 表單連結後填入，按鈕會自動啟用 */
    formUrl: null as string | null,
    lineUrl: null as string | null,
    email: null as string | null,
  },

  /** 主視覺照片：放進 public/images/ 後把檔名填進來，例：'/images/hero.jpg' */
  heroPhoto: null as string | null,
}

export type Station = (typeof wedding.stations)[number]
export type Departure = (typeof wedding.departures)[number]
