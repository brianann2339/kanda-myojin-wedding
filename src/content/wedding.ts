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
    confirmed: true,
    iso: '2027-03-25' as string | null,
    /** 儀式開始時間 */
    time: '11:00' as string | null,
    /** Hero 的大字 */
    display: '2027 · 03 · 25',
    year: 2027,
    month: 3,
    /** 星期幾（2027-03-25 為星期四，已查證） */
    estimate: { zh: '星期四', ja: '木曜日', en: 'Thursday' } as Localized,
    main: { zh: '2027 年 3 月 25 日', ja: '2027年3月25日', en: 'March 25, 2027' } as Localized,
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

  /**
   * 建議入口：參道大鳥居（Google 地圖地點名 Dotorii，35.7010871,139.767135，
   * 由使用者提供的分享連結解析而得）。從這裡進來走參道，不用爬長階梯——
   * 也是導覽影片開頭出現的那座鳥居。
   */
  entrance: {
    shareUrl: 'https://maps.app.goo.gl/iML7rdTy18P1hRxy8',
    mapEmbedUrl: 'https://maps.google.com/maps?q=35.7010871,139.767135&z=18&output=embed',
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
      id: 'akihabara-jr',
      kind: 'jr' as const,
      name: { zh: '秋葉原站', ja: '秋葉原駅', en: 'Akihabara Station' } as Localized,
      exit: { zh: '電氣街口', ja: '電気街口', en: 'Electric Town Exit' } as Localized,
      lines: {
        zh: 'JR 山手線・京濱東北線',
        ja: 'JR山手線・京浜東北線',
        en: 'JR Yamanote & Keihin-Tohoku Lines',
      } as Localized,
      walk: 7,
    },
    {
      // 日比谷線的秋葉原與 JR 是不同站體，官網那一列沒有標出口，因此這裡也不寫
      id: 'akihabara-hibiya',
      kind: 'metro' as const,
      name: { zh: '秋葉原站', ja: '秋葉原駅', en: 'Akihabara Station' } as Localized,
      exit: null,
      lines: {
        zh: '東京 Metro 日比谷線',
        ja: '東京メトロ日比谷線',
        en: 'Tokyo Metro Hibiya Line',
      } as Localized,
      walk: 7,
    },
  ],

  /**
   * 機場往會場的路線。所需時間與票價皆為 2026-08-22 以 Google 地圖
   * 路線查詢取得的參考值（含轉乘），與畫面上標示的來源一致。
   * fare 可為 null；若某條路線查不到可靠票價，就留 null 不要填估算值。
   */
  airportRoutes: [
    {
      id: 'haneda' as const,
      airport: { zh: '羽田機場', ja: '羽田空港', en: 'Haneda Airport' } as Localized,
      routes: [
        {
          label: { zh: '單軌電車　轉乘最少', ja: 'モノレール　乗り換え最少', en: 'Monorail · fewest changes' } as Localized,
          legs: [
            { zh: '第 3 航廈搭東京單軌電車「機場快速」', ja: '第3ターミナルから東京モノレール「空港快速」', en: 'Tokyo Monorail Haneda Express from Terminal 3' } as Localized,
            { zh: '浜松町轉 JR 山手線／京濱東北線', ja: '浜松町でJR山手線・京浜東北線に乗り換え', en: 'Change at Hamamatsucho for the JR Yamanote / Keihin-Tohoku Line' } as Localized,
            { zh: '秋葉原下車，電氣街口徒步 7 分', ja: '秋葉原下車、電気街口から徒歩7分', en: 'Get off at Akihabara — 7 min walk from the Electric Town Exit' } as Localized,
          ],
          duration: { zh: '約 29 分（含轉乘）', ja: '約29分（乗換含む）', en: 'About 29 min including the change' } as Localized,
          fare: { zh: '約 720 日圓', ja: '約720円', en: 'About ¥720' } as Localized | null,
          operator: { name: '東京モノレール', url: 'https://www.tokyo-monorail.co.jp/' },
        },
        {
          label: { zh: '京急線　另一個選擇', ja: '京急線　もうひとつの選択肢', en: 'Keikyu Line · the alternative' } as Localized,
          legs: [
            { zh: '第 3 航廈搭京急線「機場快特」', ja: '第3ターミナルから京急線「エアポート快特」', en: 'Keikyu Airport Limited Express from Terminal 3' } as Localized,
            { zh: '品川轉 JR 山手線／京濱東北線', ja: '品川でJR山手線・京浜東北線に乗り換え', en: 'Change at Shinagawa for the JR Yamanote / Keihin-Tohoku Line' } as Localized,
            { zh: '秋葉原下車，電氣街口徒步 7 分', ja: '秋葉原下車、電気街口から徒歩7分', en: 'Get off at Akihabara — 7 min walk from the Electric Town Exit' } as Localized,
          ],
          duration: { zh: '約 31 分（含轉乘）', ja: '約31分（乗換含む）', en: 'About 31 min including the change' } as Localized,
          fare: { zh: '約 540 日圓　四條路線中最便宜', ja: '約540円　4ルート中いちばん安い', en: 'About ¥540 — the cheapest of the four' } as Localized | null,
          operator: { name: '京急電鉄', url: 'https://www.keikyu.co.jp/' },
        },
      ],
    },
    {
      id: 'narita' as const,
      airport: { zh: '成田機場', ja: '成田空港', en: 'Narita Airport' } as Localized,
      routes: [
        {
          label: { zh: 'Skyliner　最快', ja: 'スカイライナー　最速', en: 'Skyliner · fastest' } as Localized,
          legs: [
            { zh: '成田機場搭京成「Skyliner」', ja: '成田空港から京成「スカイライナー」', en: 'Keisei Skyliner from Narita Airport' } as Localized,
            { zh: '日暮里轉 JR 山手線', ja: '日暮里でJR山手線に乗り換え', en: 'Change at Nippori for the JR Yamanote Line' } as Localized,
            { zh: '秋葉原下車，電氣街口徒步 7 分', ja: '秋葉原下車、電気街口から徒歩7分', en: 'Get off at Akihabara — 7 min walk from the Electric Town Exit' } as Localized,
          ],
          duration: { zh: '約 56 分（含轉乘）', ja: '約56分（乗換含む）', en: 'About 56 min including the change' } as Localized,
          fare: { zh: '約 2,780 日圓', ja: '約2,780円', en: 'About ¥2,780' } as Localized | null,
          operator: { name: '京成電鉄 Skyliner', url: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/us/skyliner/index.php' },
        },
        {
          label: { zh: '成田特快 N’EX　直達東京站', ja: '成田エクスプレス　東京駅まで直通', en: 'N’EX · direct to Tokyo Station' } as Localized,
          legs: [
            { zh: '成田機場搭 JR「成田特快 N’EX」', ja: '成田空港からJR「成田エクスプレス」', en: 'JR Narita Express from Narita Airport' } as Localized,
            { zh: '東京站轉 JR 中央線快速', ja: '東京駅でJR中央線快速に乗り換え', en: 'Change at Tokyo Station for the JR Chuo Line Rapid' } as Localized,
            { zh: '御茶ノ水下車，聖橋口徒步 5 分', ja: '御茶ノ水下車、聖橋口から徒歩5分', en: 'Get off at Ochanomizu — 5 min walk from the Hijiribashi Exit' } as Localized,
          ],
          duration: { zh: '約 60 分（N’EX 56 分＋中央線 4 分）', ja: '約60分（成田エクスプレス56分＋中央線4分）', en: 'About 60 min (56 min N’EX + 4 min Chuo Line)' } as Localized,
          fare: {
            zh: '約 3,300 日圓　已含東京站→御茶ノ水這段（N’EX 3,140＋中央線 160）。JR 另有 14 天有效的 N’EX 來回票 5,200 日圓',
            ja: '約3,300円　東京駅→御茶ノ水の区間も込み（N\'EX 3,140＋中央線160）。JRには14日間有効の往復きっぷ5,200円もあり',
            en: 'About ¥3,300 — includes the Tokyo → Ochanomizu leg (¥3,140 N’EX + ¥160 Chuo Line). JR also sells a 14-day round trip for ¥5,200',
          } as Localized | null,
          operator: { name: 'JR東日本 N’EX', url: 'https://www.jreast.co.jp/e/nex/' },
        },
      ],
    },
  ],

  /** 台灣出發的機場；刻意不放班次，班表會變動 */
  departures: [
    {
      code: 'TPE',
      from: { zh: '台北・桃園', ja: '台北・桃園', en: 'Taipei Taoyuan' } as Localized,
      to: { zh: '東京・成田／羽田', ja: '東京・成田／羽田', en: 'Tokyo Narita / Haneda' } as Localized,
      toCode: 'NRT / HND',
      note: {
        zh: '兩個機場都有航班；飛羽田的目前只有台灣虎航與樂桃，其餘都是成田',
        ja: '両空港とも就航。羽田便は現在タイガーエア台湾とピーチのみ、ほかは成田',
        en: 'Both airports served — only Tigerair and Peach fly to Haneda; the rest go to Narita',
      } as Localized,
      carriers: {
        zh: '長榮、中華、日航、星宇、台灣虎航、樂桃、捷星日本、酷航、泰獅航空、國泰',
        ja: 'エバー航空、チャイナエアライン、JAL、スターラックス、タイガーエア台湾、ピーチ、ジェットスター・ジャパン、スクート、タイ・ライオン・エア、キャセイパシフィック',
        en: 'EVA Air, China Airlines, JAL, STARLUX, Tigerair Taiwan, Peach, Jetstar Japan, Scoot, Thai Lion Air, Cathay Pacific',
      } as Localized,
    },
    {
      code: 'TSA',
      from: { zh: '台北・松山', ja: '台北・松山', en: 'Taipei Songshan' } as Localized,
      to: { zh: '東京・羽田', ja: '東京・羽田', en: 'Tokyo Haneda' } as Localized,
      toCode: 'HND',
      note: { zh: '市區機場對飛，只飛羽田', ja: '市街地の空港どうし、羽田のみ', en: 'City airport to city airport — Haneda only' } as Localized,
      carriers: {
        zh: '長榮、中華、日航、全日空',
        ja: 'エバー航空、チャイナエアライン、JAL、ANA',
        en: 'EVA Air, China Airlines, JAL, ANA',
      } as Localized,
    },
    {
      code: 'RMQ',
      from: { zh: '台中・清泉崗', ja: '台中・清泉崗', en: 'Taichung' } as Localized,
      to: { zh: '東京・成田', ja: '東京・成田', en: 'Tokyo Narita' } as Localized,
      toCode: 'NRT',
      note: {
        zh: '2026 年 3 月才開航的新航線，只飛成田',
        ja: '2026年3月就航の新路線。成田のみ',
        en: 'A new route since March 2026 — Narita only',
      } as Localized,
      carriers: { zh: '星宇', ja: 'スターラックス', en: 'STARLUX' } as Localized,
    },
    {
      code: 'KHH',
      from: { zh: '高雄・小港', ja: '高雄・小港', en: 'Kaohsiung' } as Localized,
      to: { zh: '東京・成田', ja: '東京・成田', en: 'Tokyo Narita' } as Localized,
      toCode: 'NRT',
      note: { zh: '目前只飛成田，部分航空公司非每日', ja: '成田のみ就航、毎日運航でない会社もあり', en: 'Narita only; some carriers do not fly daily' } as Localized,
      carriers: {
        zh: '長榮、中華、捷星日本、台灣虎航、泰國亞洲航空',
        ja: 'エバー航空、チャイナエアライン、ジェットスター・ジャパン、タイガーエア台湾、タイ・エアアジア',
        en: 'EVA Air, China Airlines, Jetstar Japan, Tigerair Taiwan, Thai AirAsia',
      } as Localized,
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
    { name: { zh: '捷星日本', ja: 'ジェットスター・ジャパン', en: 'Jetstar Japan' } as Localized, url: 'https://www.jetstar.com/tw/zh/home' },
    { name: { zh: '酷航', ja: 'スクート', en: 'Scoot' } as Localized, url: 'https://www.flyscoot.com/zhtw' },
    { name: { zh: '泰獅航空', ja: 'タイ・ライオン・エア', en: 'Thai Lion Air' } as Localized, url: 'https://www.lionairthai.com/' },
    { name: { zh: '泰國亞洲航空', ja: 'タイ・エアアジア', en: 'Thai AirAsia' } as Localized, url: 'https://www.airasia.com/zh/tw' },
    { name: { zh: '國泰航空', ja: 'キャセイパシフィック航空', en: 'Cathay Pacific' } as Localized, url: 'https://www.cathaypacific.com/cx/zh_TW.html' },
  ],

  /**
   * 當日流程的時刻，與 copy.ts 的 timeline.items **依序一一對應**（目前 8 項）。
   * 只有神前式的 11:00 是已確定的，其餘尚未排定一律留 null，畫面顯示 ──：──。
   * 之後拿到梳化、集合、開宴時間，就把對應位置填上即可。
   */
  scheduleTimes: [
    '08:30', // 新娘梳化
    '09:30', // 新郎梳化
    null, // 親友集合（時間未定）
    '11:00', // 神前式（由參進之儀入場開始）
    '12:00', // 集合照・境內拍攝（約 30 分鐘）
    '12:30', // 披露宴
    null, // 散會（結束時間未定）
  ] as (string | null)[],

  /**
   * 披露宴（2026-08-31 改為舉辦）。會場在神田明神境內的明神会館。
   * 兩個宴會廳的名稱、人數與特色皆逐字取自官網 myojin.tokyo/banquet/；
   * 料理描述取自 myojin.tokyo/cuisine/。實際使用哪一廳、開始時間都還沒定，
   * 不要在這裡填猜測值。
   */
  reception: {
    happening: true,
    venueName: { zh: '明神会館', ja: '明神会館', en: 'Myojin Kaikan' } as Localized,
    venueNote: {
      zh: '就在神田明神境內，儀式結束後步行即達',
      ja: '神田明神の境内にあり、挙式後は歩いてそのまま移動できます',
      en: 'Inside the shrine grounds — a short walk from the ceremony',
    } as Localized,
    /** 已定案使用「彩の間」；開始時間仍待確認 */
    hall: {
      /** 英文版附上羅馬拼音，否則英語賓客讀不出「彩の間」 */
      name: { zh: '彩の間', ja: '彩の間', en: 'Sai-no-Ma' } as Localized,
      capacity: { zh: '可容納 40〜120 名', ja: '対応人数 40〜120名', en: 'Seats 40–120 guests' } as Localized,
      feature: {
        zh: '自然光灑落的明亮空間，以白木為基調，氣氛開闊',
        ja: '自然光が差し込む明るい会場。白木を取り入れたデザインで開放的な雰囲気',
        en: 'Bright, filled with natural light, finished in pale wood and open in feel',
      } as Localized,
    },
    startTime: '12:30' as string | null,
    cuisine: {
      zh: '會場稱之為「明神ガストロノミー」——從「溫故知新」出發，和風與西式交融的新式料理，以生產者細心栽培的江戶食材為主，並在賓客面前完成最後一道手續。',
      ja: '「明神ガストロノミー」。温故知新の概念から生まれた和と洋が混ざり合う新しい料理で、江戸食材を中心に、サービスがお客様の目の前で仕上げます。',
      en: 'The venue calls it "Myojin Gastronomy" — new cooking where Japanese and Western traditions meet, built on Edo-region produce and finished at your table.',
    } as Localized,
    sourceNote: {
      zh: '會場與料理資訊依明神会館官方網站',
      ja: '会場・料理の情報は明神会館公式サイトに準拠',
      en: 'Hall and cuisine details per the official Myojin Kaikan website',
    } as Localized,
    officialUrl: 'https://myojin.tokyo/banquet/',
  },


  rsvp: {
    /** Google 表單（2026-08-31 由 Claude 以新人帳號建立；含姓名／聯絡方式／出席／人數／同行者／飲食禁忌／留言七題） */
    formUrl: 'https://forms.gle/psXrTDeXAcR4J1TS9' as string | null,
  },

  /** 兩人的私訊管道（2026-08-31 由新人提供並同意公開於網站） */
  contacts: [
    {
      person: 'groom' as const,
      facebookUrl: 'https://www.facebook.com/brianann75/',
      facebookHandle: 'brianann75',
      instagram: 'shrape75895',
      instagramUrl: 'https://www.instagram.com/shrape75895/',
      lineId: 'brianann75',
      email: 'brianann75@gmail.com',
    },
    {
      person: 'bride' as const,
      facebookUrl: 'https://www.facebook.com/anna.sweet.566',
      facebookHandle: 'anna.sweet.566',
      instagram: 'anna.sweet.566',
      instagramUrl: 'https://www.instagram.com/anna.sweet.566/',
      lineId: 'annasweet2339',
      email: 'annasweet2339@gmail.com',
    },
  ],

  /**
   * 圖片。換成你們自己的照片時：檔案放進 public/images/，
   * 把 src 改成 asset('images/檔名.jpg')，credit 整段刪掉即可。
   */
  photos: {
    hero: {
      /** 新人自備的浮世繪風畫像（2026-08-31 提供），自有圖片、無需出處標示 */
      src: asset('images/hero-ukiyoe-couple.jpg'),
      credit: null as string | null,
      creditUrl: null as string | null,
      isPlaceholder: false,
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
   * 影片。ceremonyPreview 由明神会館提供、經對方同意公開使用；
   * walkthrough 是新人自己在現場錄的導覽，兩者都已壓縮成適合網頁播放的檔案。
   */
  videos: {
    ceremonyPreview: {
      src: asset('videos/ceremony-preview.mp4'),
      poster: asset('images/ceremony-preview-poster.jpg'),
      credit: '影片提供：明神会館',
    },
    walkthrough: {
      src: asset('videos/venue-walkthrough.mp4'),
      poster: asset('images/venue-walkthrough-poster.jpg'),
    },
  },

  /**
   * 住宿候選。名稱與官網網址、車站徒步分鐘皆取自各飯店官方網站；
   * 官網自己標示不一致或未標示分鐘數的，只寫車站不寫分鐘（不猜）。
   */
  /**
   * 住宿候選。收錄條件（使用者訂）：步行到會場 10 分鐘內，且離最近車站 10 分鐘內。
   * walkMin／walkMeters 為地圖步行路線估算（OpenStreetMap 路網，2026-08-22），
   * station 的分鐘數則是各飯店官網自己標示的。
   */
  hotels: [
    {
      name: 'お茶の水イン',
      romaji: 'Hotel Ochanomizu Inn',
      url: 'https://www.o-inn.co.jp/',
      walkMin: 2,
      walkMeters: 180,
      station: {
        zh: 'JR／丸之內線 御茶ノ水站、千代田線 新御茶ノ水站 皆徒步 3 分',
        ja: 'JR・丸ノ内線 御茶ノ水駅、千代田線 新御茶ノ水駅いずれも徒歩3分',
        en: '3 min from Ochanomizu Stn. (JR / Marunouchi) and Shin-Ochanomizu Stn. (Chiyoda)',
      } as Localized,
    },
    {
      name: 'アパホテル〈御茶ノ水駅北〉',
      romaji: 'APA Hotel Ochanomizu-Ekikita',
      url: 'https://www.apahotel.com/hotel/syutoken/tokyo/ochanomizu-kita/',
      walkMin: 4,
      walkMeters: 280,
      station: {
        zh: '末廣町站 4 番出口 5 分／JR 御茶ノ水站 聖橋口 6 分',
        ja: '末広町駅 4番出口 徒歩5分／JR御茶ノ水駅 聖橋口 徒歩6分',
        en: '5 min from Suehirocho Stn. (Exit 4) · 6 min from JR Ochanomizu Stn.',
      } as Localized,
    },
    {
      name: 'ホテル東京ガーデンパレス',
      romaji: 'Hotel Tokyo Garden Palace',
      url: 'https://www.hotelgp-tokyo.com/',
      walkMin: 5,
      walkMeters: 370,
      station: {
        zh: 'JR 御茶ノ水站 徒步 5 分',
        ja: 'JR御茶ノ水駅より徒歩5分',
        en: '5 min from JR Ochanomizu Stn.',
      } as Localized,
    },
    {
      name: 'ノーガホテル秋葉原東京',
      romaji: 'NOHGA Hotel Akihabara Tokyo',
      url: 'https://www.nohgahotel.com/akihabara/',
      walkMin: 5,
      walkMeters: 400,
      station: {
        zh: '末廣町站 徒步 4 分／JR 秋葉原站 徒步 6 分',
        ja: '末広町駅より徒歩4分／JR秋葉原駅より徒歩6分',
        en: '4 min from Suehirocho Stn. · 6 min from JR Akihabara Stn.',
      } as Localized,
    },
    {
      name: 'お茶の水ホテルジュラク',
      romaji: 'Ochanomizu Hotel Juraku',
      url: 'https://www.hotel-juraku.co.jp/ocha/',
      walkMin: 8,
      walkMeters: 560,
      station: {
        zh: 'JR 御茶ノ水站 聖橋口 徒步 2 分',
        ja: 'JR御茶ノ水駅 聖橋口より徒歩2分',
        en: '2 min from JR Ochanomizu Stn. (Hijiribashi Exit)',
      } as Localized,
    },
    {
      name: 'すえひろの湯 ドーミーイン秋葉原',
      romaji: 'Dormy Inn Akihabara',
      url: 'https://dormy-hotels.com/dormyinn/hotels/akihabara/',
      walkMin: 9,
      walkMeters: 700,
      station: {
        zh: '末廣町站 徒步約 1 分／JR 秋葉原站 徒步約 5 分',
        ja: '末広町駅より徒歩約1分／JR秋葉原駅より徒歩約5分',
        en: 'About 1 min from Suehirocho Stn. · 5 min from JR Akihabara Stn.',
      } as Localized,
    },
  ],
}

export type Hotel = (typeof wedding.hotels)[number]

export type Station = (typeof wedding.stations)[number]
export type Departure = (typeof wedding.departures)[number]
