export type Lang = 'zh' | 'ja' | 'en'

export type Localized = Record<Lang, string>

/** GitHub Pages 是子路徑部署，public/ 底下的檔案要帶 base 才抓得到 */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

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

  /**
   * 訂票用的航空公司官網。網址皆經逐一開啟確認（2026-08-22）。
   * 這裡不宣稱哪家飛哪條航線——航線與班次請以各官網公告為準。
   */
  airlines: [
    { name: { zh: '長榮航空', ja: 'エバー航空', en: 'EVA Air' } as Localized, url: 'https://www.evaair.com/zh-tw/index.html' },
    { name: { zh: '中華航空', ja: 'チャイナエアライン', en: 'China Airlines' } as Localized, url: 'https://www.china-airlines.com/tw/zh' },
    { name: { zh: '星宇航空', ja: 'スターラックス航空', en: 'STARLUX Airlines' } as Localized, url: 'https://www.starlux-airlines.com/zh-TW' },
    { name: { zh: '台灣虎航', ja: 'タイガーエア台湾', en: 'Tigerair Taiwan' } as Localized, url: 'https://www.tigerairtw.com/zh-tw' },
    { name: { zh: '日本航空', ja: '日本航空', en: 'Japan Airlines' } as Localized, url: 'https://www.jal.co.jp/tw/zhtw/' },
    { name: { zh: '全日空', ja: '全日空', en: 'ANA' } as Localized, url: 'https://www.ana.co.jp/zh/tw/' },
    { name: { zh: '樂桃航空', ja: 'ピーチ', en: 'Peach' } as Localized, url: 'https://www.flypeach.com/tw' },
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

  /**
   * 圖片。換成你們自己的照片時：檔案放進 public/images/，
   * 把 src 改成 asset('images/檔名.jpg')，credit 整段刪掉即可。
   */
  photos: {
    hero: {
      src: asset('images/kanda-myojin-ukiyoe.jpg'),
      /** 二代歌川広重「東都三十六景 神田明神」，國立國會圖書館藏，公有領域 */
      credit: '歌川広重「東都三十六景・神田明神」／国立国会図書館 · Public domain',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:NDL1303573_%E7%A5%9E%E7%94%B0%E6%98%8E%E7%A5%9E.jpg',
      isPlaceholder: true,
    },
    venue: {
      src: asset('images/kanda-myojin-hall.jpg'),
      /** CC BY-SA 4.0：使用時必須標示作者與授權 */
      credit: 'Photo: Hyppolyte de Saint-Rambert / Wikimedia Commons · CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Kanda-Myojin_grand_hall.jpg',
      isPlaceholder: false,
    },
  },

  /**
   * 住宿候選。名稱與官網網址、車站徒步分鐘皆取自各飯店官方網站；
   * 官網自己標示不一致或未標示分鐘數的，只寫車站不寫分鐘（不猜）。
   */
  hotels: [
    {
      area: 'ochanomizu' as const,
      name: 'お茶の水ホテルジュラク',
      romaji: 'Ochanomizu Hotel Juraku',
      url: 'https://www.hotel-juraku.co.jp/ocha/',
      access: {
        zh: 'JR 御茶ノ水站 聖橋口 徒步 2 分',
        ja: 'JR御茶ノ水駅 聖橋口より徒歩2分',
        en: '2 min walk from JR Ochanomizu Stn. (Hijiribashi Exit)',
      } as Localized,
    },
    {
      area: 'ochanomizu' as const,
      name: 'お茶の水ホテル昇龍館',
      romaji: 'Ochanomizu Hotel Shoryukan',
      url: 'https://www.familyhotel.jp/',
      access: {
        zh: '東京 Metro 新御茶ノ水站 徒步 3 分',
        ja: '東京メトロ新御茶ノ水駅より徒歩3分',
        en: '3 min walk from Shin-Ochanomizu Stn. (Tokyo Metro)',
      } as Localized,
    },
    {
      area: 'ochanomizu' as const,
      name: 'ホテル東京ガーデンパレス',
      romaji: 'Hotel Tokyo Garden Palace',
      url: 'https://www.hotelgp-tokyo.com/',
      access: {
        zh: '御茶ノ水站 徒步 5 分',
        ja: '御茶ノ水駅より徒歩5分',
        en: '5 min walk from Ochanomizu Stn.',
      } as Localized,
    },
    {
      area: 'ochanomizu' as const,
      name: 'アパホテル〈御茶ノ水駅北〉',
      romaji: 'APA Hotel Ochanomizu-Ekikita',
      url: 'https://www.apahotel.com/hotel/syutoken/tokyo/ochanomizu-kita/',
      access: {
        zh: 'JR 御茶ノ水站 聖橋口 徒步 6 分／末廣町站 4 番出口 徒步 5 分',
        ja: 'JR御茶ノ水駅 聖橋口より徒歩6分／末広町駅 4番出口より徒歩5分',
        en: '6 min from JR Ochanomizu Stn. (Hijiribashi Exit) · 5 min from Suehirocho Stn. (Exit 4)',
      } as Localized,
    },
    {
      area: 'akihabara' as const,
      name: '秋葉原ワシントンホテル',
      romaji: 'Akihabara Washington Hotel',
      url: 'https://washington-hotels.jp/akihabara/',
      access: {
        zh: 'JR 秋葉原站 中央改札口 徒步 1 分',
        ja: 'JR秋葉原駅 中央改札口より徒歩1分',
        en: '1 min walk from JR Akihabara Stn. (Central Gate)',
      } as Localized,
    },
    {
      area: 'akihabara' as const,
      name: 'JR東日本ホテルメッツ プレミア 秋葉原',
      romaji: 'JR-East Hotel Mets Premier Akihabara',
      url: 'https://www.hotelmets.jp/en/akihabara/',
      access: {
        zh: 'JR 秋葉原站 南口 徒步 1 分',
        ja: 'JR秋葉原駅 南口より徒歩1分',
        en: '1 min walk from JR Akihabara Stn. (South Exit)',
      } as Localized,
    },
    {
      area: 'akihabara' as const,
      name: 'ノーガホテル秋葉原東京',
      romaji: 'NOHGA Hotel Akihabara Tokyo',
      url: 'https://www.nohgahotel.com/akihabara/',
      access: {
        zh: 'JR 秋葉原站 徒步 6 分',
        ja: 'JR秋葉原駅より徒歩6分',
        en: '6 min walk from JR Akihabara Stn.',
      } as Localized,
    },
    {
      area: 'akihabara' as const,
      name: 'すえひろの湯 ドーミーイン秋葉原',
      romaji: 'Dormy Inn Akihabara',
      url: 'https://dormy-hotels.com/dormyinn/hotels/akihabara/',
      access: {
        zh: '末廣町站 徒步約 1 分／JR 秋葉原站 徒步約 5 分（地址與神社同為外神田）',
        ja: '末広町駅より徒歩約1分／JR秋葉原駅より徒歩約5分（住所は神社と同じ外神田）',
        en: 'About 1 min from Suehirocho Stn. · 5 min from JR Akihabara Stn. (same Sotokanda district as the shrine)',
      } as Localized,
    },
    {
      area: 'kanda' as const,
      name: '明神の湯 ドーミーインPREMIUM神田',
      romaji: 'Dormy Inn Premium Kanda',
      url: 'https://dormy-hotels.com/dormyinn/hotels/kanda/',
      access: {
        zh: '東京 Metro 新御茶ノ水站 徒步約 5 分／JR 秋葉原站 電氣街口 徒步約 6 分',
        ja: '東京メトロ新御茶ノ水駅より徒歩約5分／JR秋葉原駅 電気街口より徒歩約6分',
        en: 'About 5 min from Shin-Ochanomizu Stn. · 6 min from JR Akihabara Stn. (Electric Town Exit)',
      } as Localized,
    },
    {
      area: 'kanda' as const,
      name: '相鉄フレッサイン東京神田',
      romaji: 'Sotetsu Fresa Inn Tokyo Kanda',
      url: 'https://sotetsu-hotels.com/fresa-inn/kanda/',
      access: {
        zh: 'JR 神田站 南口 徒步 4 分',
        ja: 'JR神田駅 南口より徒歩4分',
        en: '4 min walk from JR Kanda Stn. (South Exit)',
      } as Localized,
    },
    {
      area: 'kanda' as const,
      name: '神田ステーションホテル',
      romaji: 'Kanda Station Hotel',
      url: 'https://www.kandasth.com/',
      access: {
        zh: 'JR 神田站 南口 徒步 1 分',
        ja: 'JR神田駅 南口より徒歩1分',
        en: '1 min walk from JR Kanda Stn. (South Exit)',
      } as Localized,
    },
    {
      area: 'kanda' as const,
      name: 'ホテルSUI神田 by ABEST',
      romaji: 'Hotel Sui Kanda by ABEST',
      url: 'https://hotelsui-kanda.com/',
      access: {
        zh: 'JR 神田站 徒步 4 分',
        ja: 'JR神田駅より徒歩4分',
        en: '4 min walk from JR Kanda Stn.',
      } as Localized,
    },
    {
      area: 'tokyo-station' as const,
      name: '東京ステーションホテル',
      romaji: 'The Tokyo Station Hotel',
      url: 'https://www.tokyostationhotel.jp/',
      access: {
        zh: '東京站（官網未標示步行時間）',
        ja: '東京駅（公式サイトに徒歩分数の記載なし）',
        en: 'Tokyo Stn. (walk time not stated on the official site)',
      } as Localized,
    },
    {
      area: 'tokyo-station' as const,
      name: 'シャングリ・ラ 東京',
      romaji: 'Shangri-La Tokyo',
      url: 'https://www.shangri-la.com/jp/tokyo/shangrila/',
      access: {
        zh: '東京站（官網步行時間標示不一）',
        ja: '東京駅（公式サイト内で徒歩分数の記載が一致せず）',
        en: 'Tokyo Stn. (official site gives conflicting walk times)',
      } as Localized,
    },
    {
      area: 'tokyo-station' as const,
      name: '丸ノ内ホテル',
      romaji: 'Marunouchi Hotel',
      url: 'https://www.marunouchi-hotel.co.jp/',
      access: {
        zh: '東京站 丸之內北口 徒步約 1 分',
        ja: 'JR東京駅 丸の内北口より徒歩約1分',
        en: 'About 1 min walk from Tokyo Stn. (Marunouchi North Exit)',
      } as Localized,
    },
  ],
}

export type Hotel = (typeof wedding.hotels)[number]
export type HotelArea = Hotel['area']

export type Station = (typeof wedding.stations)[number]
export type Departure = (typeof wedding.departures)[number]
