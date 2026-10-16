import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation & Header
  title: string;
  search: string;
  all: string;
  randomElement: string;
  downloadJson: string;
  shareApp: string;
  linkCopied: string;
  settings: string;
  help: string;
  quizMode: string;

  // Tabs
  info: string;
  story: string;
  model: string;
  trends: string;

  // Element Fields
  weight: string;
  category: string;
  description: string;
  electrons: string;
  electronConfig: string;
  shells: string;
  period: string;
  group: string;
  compare: string;
  selectAnotherToCompare: string;

  // Categories
  'alkali-metal': string;
  'alkaline-earth-metal': string;
  'transition-metal': string;
  'post-transition-metal': string;
  'metalloid': string;
  'reactive-nonmetal': string;
  'noble-gas': string;
  'lanthanide': string;
  'actinide': string;
  'unknown': string;
  lanthanidesRow: string;
  actinidesRow: string;

  // Trends Tab
  trendsTitle: string;
  property: string;
  atomicRadius: string;
  electronegativity: string;
  meltingPoint: string;
  boilingPoint: string;
  firstIonization: string;
  density: string;
  acrossPeriod: string;
  acrossGroup: string;
  selectedElement: string;
  noData: string;
  trendInsights: string;
  clickPointToSelect: string;

  // Quiz Modal
  quizTitle: string;
  score: string;
  whatIsSymbolFor: string;
  quitQuiz: string;
  gameOver: string;
  correct: string;
  tryAgain: string;

  // Help Modal
  howToUse: string;
  filteringTitle: string;
  filteringDesc: string;
  detailsTitle: string;
  detailsDesc: string;
  shortcutsTitle: string;
  shortcutsSearch: string;
  shortcutsClose: string;
  randomTitle: string;
  randomDesc: string;
  comparisonTitle: string;
  comparisonDesc: string;
  gotIt: string;
  footerLove: string;

  // Settings Modal
  settingsTitle: string;
  accentColor: string;
  language: string;
  theme: string;
  light: string;
  dark: string;

  // Compare Modal
  elementComparison: string;
  closeComparison: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  'zh-CN': {
    title: '交互式元素周期表',
    search: '搜索名称、符号或原子序号... (按 / 聚焦)',
    all: '全部',
    randomElement: '随机探索元素',
    downloadJson: '导出元素数据 (JSON)',
    shareApp: '分享此应用',
    linkCopied: '应用链接已复制到剪贴板！',
    settings: '偏好设置',
    help: '使用指南与帮助',
    quizMode: '化学符号测验',

    info: '基本信息',
    story: '发现与故事',
    model: '玻尔原子模型',
    trends: '周期性规律',

    weight: '相对原子质量',
    category: '元素类别',
    description: '基本描述',
    electrons: '核外电子排布',
    electronConfig: '各能层电子分布',
    shells: '电子层数',
    period: '周期',
    group: '族',
    compare: '元素对比',
    selectAnotherToCompare: '已设为对比基准。请在周期表中点击第二个元素以进行对比。',

    'alkali-metal': '碱金属',
    'alkaline-earth-metal': '碱土金属',
    'transition-metal': '过渡金属',
    'post-transition-metal': '后过渡金属',
    'metalloid': '类金属',
    'reactive-nonmetal': '活泼非金属',
    'noble-gas': '稀有气体',
    'lanthanide': '镧系元素',
    'actinide': '锕系元素',
    'unknown': '性质未知',
    lanthanidesRow: '镧系',
    actinidesRow: '锕系',

    trendsTitle: '元素周期性物理与化学性质规律',
    property: '性质指标',
    atomicRadius: '原子半径 (pm)',
    electronegativity: '鲍林电负性',
    meltingPoint: '熔点 (°C)',
    boilingPoint: '沸点 (°C)',
    firstIonization: '第一电离能 (kJ/mol)',
    density: '密度 (g/cm³)',
    acrossPeriod: '同周期递变',
    acrossGroup: '同主族递变',
    selectedElement: '当前选中',
    noData: '暂无实测数据',
    trendInsights: '周期律规律解析',
    clickPointToSelect: '点击图表中任意数据点可切换查看对应元素',

    quizTitle: '化学符号趣味测验',
    score: '当前得分',
    whatIsSymbolFor: '请问该元素的化学符号是：',
    quitQuiz: '退出测验',
    gameOver: '测验结束！最终得分：',
    correct: '回答正确！',
    tryAgain: '再试一次',

    howToUse: '使用指南与功能说明',
    filteringTitle: '搜索与多重筛选',
    filteringDesc: '您可以通过顶部搜索栏快速按名称、化学符号或原子序号查找元素。还可通过分类下拉框或底部的色彩图例按元素类别过滤显示。',
    detailsTitle: '元素详情与周期规律',
    detailsDesc: '点击周期表中的任意元素，即可查看其详细物理数据、电子层排布、科学发现故事、交互式3D玻尔模型以及Recharts趋势分析图表。',
    shortcutsTitle: '键盘快捷键',
    shortcutsSearch: '快速激活搜索',
    shortcutsClose: '关闭当前弹窗',
    randomTitle: '随机探索元素',
    randomDesc: '点击顶部的随机骰子按钮，系统将随机带您探索周期表中的神奇元素。',
    comparisonTitle: '双元素并排对比',
    comparisonDesc: '在元素详情弹窗中点击「对比」，随后在周期表选择第二个元素，即可并排对比两者的原子量、分类与电子分布。',
    gotIt: '我知道了',
    footerLove: '用心为化学与科学探索者打造',

    settingsTitle: '个性化偏好设置',
    accentColor: '系统主题强调色',
    language: '界面多语言设置',
    theme: '外观主题模式',
    light: '明亮模式',
    dark: '暗黑模式',

    elementComparison: '元素双向属性对比',
    closeComparison: '退出对比模式'
  },

  'en': {
    title: 'Interactive Periodic Table',
    search: 'Search by name, symbol, or number... (/ to focus)',
    all: 'All',
    randomElement: 'Random Element',
    downloadJson: 'Download Data (JSON)',
    shareApp: 'Share App',
    linkCopied: 'Link copied to clipboard!',
    settings: 'Settings',
    help: 'How to Use',
    quizMode: 'Quiz Mode',

    info: 'Info',
    story: 'Story',
    model: 'Bohr Model',
    trends: 'Trends',

    weight: 'Atomic Weight',
    category: 'Category',
    description: 'Description',
    electrons: 'Electrons',
    electronConfig: 'Electron Configuration',
    shells: 'Shells',
    period: 'Period',
    group: 'Group',
    compare: 'Compare',
    selectAnotherToCompare: 'Baseline selected. Click another element in the table to compare.',

    'alkali-metal': 'Alkali metals',
    'alkaline-earth-metal': 'Alkaline earth metals',
    'transition-metal': 'Transition metals',
    'post-transition-metal': 'Post-transition metals',
    'metalloid': 'Metalloids',
    'reactive-nonmetal': 'Reactive nonmetals',
    'noble-gas': 'Noble gases',
    'lanthanide': 'Lanthanides',
    'actinide': 'Actinides',
    'unknown': 'Unknown properties',
    lanthanidesRow: 'Lanthanides',
    actinidesRow: 'Actinides',

    trendsTitle: 'Periodic Property Trends',
    property: 'Property',
    atomicRadius: 'Atomic Radius (pm)',
    electronegativity: 'Electronegativity (Pauling)',
    meltingPoint: 'Melting Point (°C)',
    boilingPoint: 'Boiling Point (°C)',
    firstIonization: 'First Ionization (kJ/mol)',
    density: 'Density (g/cm³)',
    acrossPeriod: 'Across Period',
    acrossGroup: 'Across Group',
    selectedElement: 'Selected Element',
    noData: 'No Data Available',
    trendInsights: 'Periodic Law Insights',
    clickPointToSelect: 'Click any data point on the chart to select that element',

    quizTitle: 'Element Symbol Quiz',
    score: 'Score',
    whatIsSymbolFor: 'What is the chemical symbol for',
    quitQuiz: 'Quit Quiz',
    gameOver: 'Game Over! Final Score:',
    correct: 'Correct!',
    tryAgain: 'Try Again',

    howToUse: 'How to Use',
    filteringTitle: 'Filtering & Search',
    filteringDesc: 'Use the search bar to find elements by name, symbol, or atomic number. You can also filter by category using the header dropdown or the footer legend.',
    detailsTitle: 'Element Details & Trends',
    detailsDesc: 'Click on any element to explore comprehensive physical data, electron configurations, discovery history, 3D Bohr model, and interactive Recharts trend graphs.',
    shortcutsTitle: 'Keyboard Shortcuts',
    shortcutsSearch: 'Focus Search',
    shortcutsClose: 'Close Modal',
    randomTitle: 'Random Element',
    randomDesc: 'Curious to learn? Click the shuffle icon in the header to jump to a random element from the universe.',
    comparisonTitle: 'Side-by-Side Comparison',
    comparisonDesc: 'Click Compare in any element modal, then select a second element on the periodic table to view their properties side by side.',
    gotIt: 'Got it!',
    footerLove: 'Crafted with ❤️ for chemistry and science lovers.',

    settingsTitle: 'Preferences & Settings',
    accentColor: 'Accent Color',
    language: 'Language',
    theme: 'Theme',
    light: 'Light Mode',
    dark: 'Dark Mode',

    elementComparison: 'Element Comparison',
    closeComparison: 'Close Comparison'
  },

  'zh-TW': {
    title: '互動式元素週期表',
    search: '搜尋名稱、符號或原子序號... (按 / 聚焦)',
    all: '全部',
    randomElement: '隨機探索元素',
    downloadJson: '匯出元素資料 (JSON)',
    shareApp: '分享此應用',
    linkCopied: '應用連結已複製到剪貼簿！',
    settings: '偏好設定',
    help: '使用指南與說明',
    quizMode: '化學符號測驗',

    info: '基本資訊',
    story: '發現與故事',
    model: '波耳原子模型',
    trends: '週期性規律',

    weight: '相對原子質量',
    category: '元素類別',
    description: '基本描述',
    electrons: '核外電子組態',
    electronConfig: '各能層電子分佈',
    shells: '電子層數',
    period: '週期',
    group: '族',
    compare: '元素對比',
    selectAnotherToCompare: '已設為對比基準。請在週期表中點選第二個元素進行對比。',

    'alkali-metal': '鹼金屬',
    'alkaline-earth-metal': '鹼土金屬',
    'transition-metal': '過渡金屬',
    'post-transition-metal': '後過渡金屬',
    'metalloid': '類金屬',
    'reactive-nonmetal': '活性非金屬',
    'noble-gas': '惰性氣體',
    'lanthanide': '鑭系元素',
    'actinide': '錒系元素',
    'unknown': '性質未知',
    lanthanidesRow: '鑭系',
    actinidesRow: '錒系',

    trendsTitle: '元素週期性物理與化學性質規律',
    property: '性質指標',
    atomicRadius: '原子半徑 (pm)',
    electronegativity: '鮑林電負度',
    meltingPoint: '熔點 (°C)',
    boilingPoint: '沸點 (°C)',
    firstIonization: '第一游離能 (kJ/mol)',
    density: '密度 (g/cm³)',
    acrossPeriod: '同週期遞變',
    acrossGroup: '同主族遞變',
    selectedElement: '目前選中',
    noData: '暫無實測資料',
    trendInsights: '週期律規律解析',
    clickPointToSelect: '點擊圖表中任一資料點可切換查看對應元素',

    quizTitle: '化學符號趣味測驗',
    score: '目前得分',
    whatIsSymbolFor: '請問該元素的化學符號是：',
    quitQuiz: '退出測驗',
    gameOver: '測驗結束！最終得分：',
    correct: '回答正確！',
    tryAgain: '再試一次',

    howToUse: '使用指南與功能說明',
    filteringTitle: '搜尋與多重篩選',
    filteringDesc: '您可以透過頂部搜尋欄快速按名稱、化學符號或原子序號尋找元素。還可透過分類下拉選單或底部的色彩圖例進行分類過濾。',
    detailsTitle: '元素詳情與週期規律',
    detailsDesc: '點擊週期表中的任意元素，即可查看其詳細物理數據、電子組態、科學發現歷史、互動式3D波耳模型及Recharts趨勢分析圖表。',
    shortcutsTitle: '鍵盤快速鍵',
    shortcutsSearch: '快速啟用搜尋',
    shortcutsClose: '關閉目前視窗',
    randomTitle: '隨機探索元素',
    randomDesc: '點擊頂部的隨機骰子按鈕，系統將隨機帶您探索週期表中的神奇元素。',
    comparisonTitle: '雙元素並排對比',
    comparisonDesc: '在元素詳情視窗中點擊「對比」，隨後在週期表選擇第二個元素，即可並排對比兩者的原子量、分類與電子分佈。',
    gotIt: '我知道了',
    footerLove: '用心為化學與科學探索者打造',

    settingsTitle: '個人化偏好設定',
    accentColor: '系統主題強調色',
    language: '介面語言設定',
    theme: '外觀主題模式',
    light: '淺色模式',
    dark: '深色模式',

    elementComparison: '元素雙向屬性對比',
    closeComparison: '退出對比模式'
  },

  'ja': {
    title: 'インタラクティブ周期表',
    search: '元素名、記号、原子番号で検索... (/ でフォーカス)',
    all: 'すべて',
    randomElement: 'ランダムな元素',
    downloadJson: 'データ保存 (JSON)',
    shareApp: 'アプリを共有',
    linkCopied: 'リンクをクリップボードにコピーしました！',
    settings: '環境設定',
    help: '使い方ガイド',
    quizMode: '元素記号クイズ',

    info: '基本情報',
    story: '歴史と物語',
    model: 'ボーア模型',
    trends: '周期的傾向',

    weight: '原子量',
    category: '分類カテゴリー',
    description: '元素の説明',
    electrons: '電子配置',
    electronConfig: '電子殻ごとの配置',
    shells: '電子殻数',
    period: '周期',
    group: '族',
    compare: '元素比較',
    selectAnotherToCompare: '比較対象を選択しました。周期表からもう一つの元素をクリックしてください。',

    'alkali-metal': 'アルカリ金属',
    'alkaline-earth-metal': 'アルカリ土類金属',
    'transition-metal': '遷移金属',
    'post-transition-metal': 'ポスト遷移金属',
    'metalloid': '半金属',
    'reactive-nonmetal': '反応性非金属',
    'noble-gas': '希ガス',
    'lanthanide': 'ランタノイド',
    'actinide': 'アクチノイド',
    'unknown': '性質不明',
    lanthanidesRow: 'ランタノイド',
    actinidesRow: 'アクチノイド',

    trendsTitle: '元素の周期的特性トレンド',
    property: '物性項目',
    atomicRadius: '原子半径 (pm)',
    electronegativity: '電気陰性度 (ポーリング)',
    meltingPoint: '融点 (°C)',
    boilingPoint: '沸点 (°C)',
    firstIonization: '第一イオン化エネルギー (kJ/mol)',
    density: '密度 (g/cm³)',
    acrossPeriod: '同周期内の変化',
    acrossGroup: '同族内の変化',
    selectedElement: '選択中',
    noData: '測定データなし',
    trendInsights: '周期律の解説',
    clickPointToSelect: 'グラフのプロットをクリックするとその元素へ移動できます',

    quizTitle: '元素記号チャレンジ',
    score: '現在のスコア',
    whatIsSymbolFor: '次の元素の元素記号はどれですか：',
    quitQuiz: 'クイズ終了',
    gameOver: 'ゲーム終了！最終スコア：',
    correct: '正解です！',
    tryAgain: 'もう一度挑戦',

    howToUse: '使い方と機能紹介',
    filteringTitle: '検索とカテゴリー絞り込み',
    filteringDesc: '上部の検索バーで元素名、記号、原子番号から即座に検索できます。ヘッダーのドロップダウンや下部の凡例からも分類できます。',
    detailsTitle: '元素詳細とトレンド分析',
    detailsDesc: '元素をクリックすると、詳細な物理化学データ、電子殻配置、発見の歴史、3Dボーア模型、Rechartsによる周期性グラフが表示されます。',
    shortcutsTitle: 'キーボードショートカット',
    shortcutsSearch: '検索バーへフォーカス',
    shortcutsClose: 'モーダルを閉じる',
    randomTitle: 'ランダム探索',
    randomDesc: 'サイコロアイコンを押すと、周期表からランダムに元素を抽出して学ぶことができます。',
    comparisonTitle: '2元素の並列比較',
    comparisonDesc: '詳細画面で「比較」を押してから別の元素をクリックすると、原子量や電子配置を並べて比較できます。',
    gotIt: 'わかりました',
    footerLove: '化学と科学を愛するすべての人のために作成',

    settingsTitle: '設定とカスタマイズ',
    accentColor: 'アクセントカラー',
    language: '表示言語',
    theme: 'テーマ設定',
    light: 'ライトモード',
    dark: 'ダークモード',

    elementComparison: '元素スペック比較',
    closeComparison: '比較画面を閉じる'
  },

  'ko': {
    title: '대화형 주기율표',
    search: '이름, 기호 또는 원자 번호로 검색... (/ 로 포커스)',
    all: '모두 보기',
    randomElement: '무작위 원소 탐색',
    downloadJson: '데이터 내보내기 (JSON)',
    shareApp: '앱 공유하기',
    linkCopied: '링크가 클립보드에 복사되었습니다!',
    settings: '환경설정',
    help: '사용 방법 및 도움말',
    quizMode: '원소 기호 퀴즈',

    info: '기본 정보',
    story: '역사와 이야기',
    model: '보어 원자 모형',
    trends: '주기적 경향',

    weight: '원자량',
    category: '원소 분류',
    description: '원소 설명',
    electrons: '전자 배치',
    electronConfig: '전자 껍질별 배치',
    shells: '전자껍질 수',
    period: '주기',
    group: '족',
    compare: '원소 비교',
    selectAnotherToCompare: '기준 원소가 선택되었습니다. 주기율표에서 비교할 두 번째 원소를 클릭하세요.',

    'alkali-metal': '알칼리 금속',
    'alkaline-earth-metal': '알칼리 토금속',
    'transition-metal': '전이 금속',
    'post-transition-metal': '전이후 금속',
    'metalloid': '준금속',
    'reactive-nonmetal': '반응성 비금속',
    'noble-gas': '비활성 기체',
    'lanthanide': '란타넘족',
    'actinide': '악티늄족',
    'unknown': '미지의 특성',
    lanthanidesRow: '란타넘족',
    actinidesRow: '악티늄족',

    trendsTitle: '주기율표에 따른 물리·화학적 특성 경향',
    property: '특성 항목',
    atomicRadius: '원자 반지름 (pm)',
    electronegativity: '폴링 전기 음성도',
    meltingPoint: '녹는점 (°C)',
    boilingPoint: '끓는점 (°C)',
    firstIonization: '제1 이온화 에너지 (kJ/mol)',
    density: '밀도 (g/cm³)',
    acrossPeriod: '동일 주기 경향',
    acrossGroup: '동일 족 경향',
    selectedElement: '선택된 원소',
    noData: '측정 데이터 없음',
    trendInsights: '주기율 분석 설명',
    clickPointToSelect: '차트의 데이터 포인트를 클릭하면 해당 원소로 전환됩니다',

    quizTitle: '원소 기호 퀴즈 게임',
    score: '현재 점수',
    whatIsSymbolFor: '다음 원소의 화학 기호는 무엇일까요:',
    quitQuiz: '퀴즈 종료',
    gameOver: '게임 오버! 최종 점수:',
    correct: '정답입니다!',
    tryAgain: '다시 도전',

    howToUse: '사용 안내 및 기능 가이드',
    filteringTitle: '검색 및 카테고리 필터',
    filteringDesc: '상단 검색창을 이용해 원소 이름, 기호, 번호로 빠르게 검색할 수 있습니다. 상단 드롭다운 및 하단 범례를 통해 카테고리별로 필터링할 수도 있습니다.',
    detailsTitle: '원소 상세 정보 및 주기적 경향',
    detailsDesc: '원소를 클릭하면 상세한 물리량, 전자 껍질 배치, 발견 역사, 3D 보어 모형, Recharts 기반의 주기율 추세 차트를 탐색할 수 있습니다.',
    shortcutsTitle: '키보드 단축키',
    shortcutsSearch: '검색창 바로가기',
    shortcutsClose: '모달 창 닫기',
    randomTitle: '무작위 탐색',
    randomDesc: '상단의 셔플 버튼을 누르면 우주 속 다양한 원소를 무작위로 탐색할 수 있습니다.',
    comparisonTitle: '원소 나란히 비교',
    comparisonDesc: '원소 상세 모달에서 [비교]를 클릭한 뒤 주기율표에서 두 번째 원소를 선택하면 원자량, 분류, 전자 배치를 나란히 비교할 수 있습니다.',
    gotIt: '확인했습니다',
    footerLove: '화학과 과학을 사랑하는 분들을 위해 정성껏 제작되었습니다',

    settingsTitle: '환경 설정',
    accentColor: '강조 색상',
    language: '표시 언어',
    theme: '테마 모드',
    light: '라이트 모드',
    dark: '다크 모드',

    elementComparison: '원소 속성 비교',
    closeComparison: '비교 닫기'
  }
};
