import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot
} from 'recharts';
import { PeriodicElement, Language } from '../types';
import { translations } from '../data/translations';
import { cn } from '../lib/utils';
import { Layers, Columns, Sparkles, TrendingUp, Compass } from 'lucide-react';

interface ElementTrendsProps {
  selectedElement: PeriodicElement;
  allElements: PeriodicElement[];
  lang: Language;
  onSelectElement: (element: PeriodicElement) => void;
  accentColor?: string;
}

type PropertyKey = 'atomicRadius' | 'electronegativity' | 'meltingPoint' | 'boilingPoint' | 'firstIonization' | 'density';

export const ElementTrends: React.FC<ElementTrendsProps> = ({
  selectedElement,
  allElements,
  lang,
  onSelectElement,
  accentColor = '#3b82f6'
}) => {
  const t = translations[lang];
  const [dimension, setDimension] = useState<'period' | 'group'>('period');
  const [property, setProperty] = useState<PropertyKey>('atomicRadius');

  // Properties configuration
  const propertyConfigs: Record<PropertyKey, { label: string; unit: string; color: string; decimals: number }> = {
    atomicRadius: { label: t.atomicRadius, unit: 'pm', color: '#38bdf8', decimals: 0 },
    electronegativity: { label: t.electronegativity, unit: '', color: '#f43f5e', decimals: 2 },
    meltingPoint: { label: t.meltingPoint, unit: '°C', color: '#f59e0b', decimals: 1 },
    boilingPoint: { label: t.boilingPoint, unit: '°C', color: '#ec4899', decimals: 1 },
    firstIonization: { label: t.firstIonization, unit: 'kJ/mol', color: '#8b5cf6', decimals: 0 },
    density: { label: t.density, unit: 'g/cm³', color: '#10b981', decimals: 3 },
  };

  const currentConfig = propertyConfigs[property];

  // Filter elements by current dimension
  const trendElements = allElements
    .filter(el => {
      if (dimension === 'period') {
        return el.period === selectedElement.period;
      } else {
        return el.group === selectedElement.group;
      }
    })
    .sort((a, b) => (dimension === 'period' ? a.number - b.number : a.period - b.period));

  // Prepare chart data
  const chartData = trendElements.map(el => {
    const rawVal = el.properties ? el.properties[property] : null;
    return {
      number: el.number,
      symbol: el.symbol,
      name: el.translations[lang]?.name || el.symbol,
      group: el.group,
      period: el.period,
      value: rawVal !== null && rawVal !== undefined ? rawVal : null,
      isSelected: el.number === selectedElement.number,
      element: el,
    };
  });

  const validValues = chartData.map(d => d.value).filter((v): v is number => v !== null);
  const minVal = validValues.length > 0 ? Math.min(...validValues) : null;
  const maxVal = validValues.length > 0 ? Math.max(...validValues) : null;
  const currentVal = selectedElement.properties ? selectedElement.properties[property] : null;

  // Insight descriptions based on property and dimension
  const getInsightText = () => {
    if (property === 'atomicRadius') {
      return dimension === 'period'
        ? (lang === 'zh-CN'
            ? '同周期主族元素从左至右，核电荷数递增，对核外电子引力增大，原子半径总体呈现递减趋势。'
            : lang === 'zh-TW'
            ? '同週期主族元素由左至右，核電荷數增加，對核外電子的吸引力變強，原子半徑普遍呈現遞減趨勢。'
            : lang === 'ja'
            ? '同一周期では左から右へ行くにつれて有効核電荷が増加し、電子が強く引き寄せられるため原子半径は小さくなります。'
            : lang === 'ko'
            ? '동일 주기에서 원자 번호가 증가할수록 유효 핵전하가 증가하여 전자를 더 강하게 끌어당기므로 원자 반지름이 대체로 감소합니다.'
            : 'Across a period, atomic radius generally decreases from left to right as the nuclear charge increases and draws electrons closer.')
        : (lang === 'zh-CN'
            ? '同主族元素自上而下，电子层数逐层递增，电子屏蔽效应增强，原子半径显著增大。'
            : lang === 'zh-TW'
            ? '同主族元素自上而下，電子層數逐層增加，電子屏蔽效應顯著，原子半徑明顯增大。'
            : lang === 'ja'
            ? '同族では上から下へ電子殻が増えるため、遮蔽効果も相まって原子半径は明確に増大します。'
            : lang === 'ko'
            ? '동일 족에서는 아래로 내려갈수록 전자껍질 수가 증가하여 원자 반지름이 뚜렷하게 증가합니다.'
            : 'Down a group, the addition of electron shells increases the atomic radius despite increasing nuclear charge.');
    }
    if (property === 'electronegativity') {
      return dimension === 'period'
        ? (lang === 'zh-CN'
            ? '同周期从左至右，金属活性减弱、非金属性增强，成键时吸引电子对的能力显著增强（鲍林电负性递增）。'
            : lang === 'zh-TW'
            ? '同週期由左至右，金屬性減弱、非金屬性增強，吸引共用電子對的能力顯著提高（電負度遞增）。'
            : lang === 'ja'
            ? '同一周期では左から右へ電気陰性度が増加し、電子を引き付ける能力が高まります。'
            : lang === 'ko'
            ? '동일 주기에서 오른쪽으로 갈수록 비금속성이 강해져 전자를 끌어당기는 전기 음성도가 증가합니다.'
            : 'Across a period, electronegativity increases as the effective nuclear charge rises, attracting shared electron pairs more strongly.')
        : (lang === 'zh-CN'
            ? '同族元素自上而下，原子半径增大，最外层电子受核引力减弱，鲍林电负性总体呈下降趋势。'
            : lang === 'zh-TW'
            ? '同族元素自上而下，原子半徑增大，價電子受核引力減弱，電負度總體呈現下降趨勢。'
            : lang === 'ja'
            ? '同族では下に行くほど原子が大きくなり原子核からの距離が遠くなるため、電気陰性度は低下します。'
            : lang === 'ko'
            ? '동일 족에서는 아래로 갈수록 원자 반지름이 커져 원자핵과 전자의 거리가 멀어지므로 전기 음성도가 감소합니다.'
            : 'Down a group, electronegativity generally decreases because valence electrons are farther from the nucleus.');
    }
    if (property === 'firstIonization') {
      return dimension === 'period'
        ? (lang === 'zh-CN'
            ? '同周期从左至右，移去最外层第一个电子所需吸收的能量（第一电离能）总体呈升高趋势，全充满或半充满亚层呈现局部峰值。'
            : lang === 'zh-TW'
            ? '同週期由左至右，移去第一個價電子所需的游離能總體上升，全填滿或半填滿亞層有局部極大值。'
            : lang === 'ja'
            ? '同一周期では右へ行くほど核引力が増すため第一イオン化エネルギーは高くなります（閉殻・半閉殻で局所的ピーク）。'
            : lang === 'ko'
            ? '동일 주기에서 오른쪽으로 갈수록 유효 핵전하가 증가하여 제1 이온화 에너지가 대체로 증가합니다.'
            : 'First ionization energy generally increases across a period due to higher effective nuclear charge, with local peaks at stable subshells.')
        : (lang === 'zh-CN'
            ? '同族自上而下，原子半径增大，外层电子与原子核结合更松散，第一电离能逐渐减小。'
            : lang === 'zh-TW'
            ? '同族由上而下，原子半徑變大，外層電子受核引力減小，第一游離能逐漸降低。'
            : lang === 'ja'
            ? '同族では下に行くほど電子殻が増え電子が離れやすくなるため、第一イオン化エネルギーは低下します。'
            : lang === 'ko'
            ? '동일 족에서는 아래로 갈수록 전자껍질이 늘어나 전자를 떼어내기 쉬워져 이온화 에너지가 감소합니다.'
            : 'Down a group, first ionization energy decreases as valence electrons are shielded and located farther from the nucleus.');
    }
    return dimension === 'period'
      ? (lang === 'zh-CN'
          ? '同周期元素物理聚集状态与熔沸点随晶体类型（金属晶体、共价晶体、分子晶体）产生显著演变。'
          : lang === 'zh-TW'
          ? '同週期元素物理相態與熔沸點隨著晶體結構形態（金屬、共價、分子晶體）發生顯著演變。'
          : lang === 'ja'
          ? '融点・沸点は結合様式（金属結合、共有結合、ファンデルワールス力）により周期内で特徴的な変化を示します。'
          : lang === 'ko'
          ? '녹는점과 끓는점은 결합 형태(금속 결합, 공유 결합, 분자간 인력)에 따라 주기 내에서 특징적인 변화를 보입니다.'
          : 'Melting and boiling points reflect transitions across crystal lattice types (metallic, covalent network, molecular).')
      : (lang === 'zh-CN'
          ? '同主族各元素保持相似的化合价态与晶体结构，物理量呈现平滑连续的梯度变化规律。'
          : lang === 'zh-TW'
          ? '同主族各元素保持相似的價電子態與晶體結構，物理量呈現連續的梯度變化規律。'
          : lang === 'ja'
          ? '同族元素は類似の電子配置と構造を持つため、物性は連続的かつ滑らかな変化を示します。'
          : lang === 'ko'
          ? '동일 족 원소들은 유사한 전자 배치와 화학적 성질을 가지며 물성치가 규칙적인 기울기를 나타냅니다.'
          : 'Elements within the same group share homologous valence configs, showing progressive shifts in physical constants.');
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Dimension Switch */}
        <div className="inline-flex p-1 rounded-xl glass border border-[var(--border-color)]">
          <button
            onClick={() => setDimension('period')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              dimension === 'period'
                ? "bg-[var(--accent-color)] text-white shadow-md"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.acrossPeriod} ({t.period} {selectedElement.period})</span>
          </button>
          <button
            onClick={() => setDimension('group')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
              dimension === 'group'
                ? "bg-[var(--accent-color)] text-white shadow-md"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t.acrossGroup} ({t.group} {selectedElement.group})</span>
          </button>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.property}:</span>
          </label>
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value as PropertyKey)}
            className="glass px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--text-primary)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-color)] outline-none cursor-pointer"
          >
            {(Object.keys(propertyConfigs) as PropertyKey[]).map((key) => (
              <option key={key} value={key} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                {propertyConfigs[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass px-3 py-2.5 rounded-xl border border-[var(--border-color)]">
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
            {t.selectedElement} ({selectedElement.symbol})
          </p>
          <p className="text-base font-black font-mono text-[var(--accent-color)]">
            {currentVal !== null && currentVal !== undefined
              ? `${currentVal.toFixed(currentConfig.decimals)} ${currentConfig.unit}`
              : t.noData}
          </p>
        </div>

        <div className="glass px-3 py-2.5 rounded-xl border border-[var(--border-color)]">
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
            Min ({dimension === 'period' ? `${t.period} ${selectedElement.period}` : `${t.group} ${selectedElement.group}`})
          </p>
          <p className="text-base font-bold font-mono text-[var(--text-primary)]">
            {minVal !== null ? `${minVal.toFixed(currentConfig.decimals)} ${currentConfig.unit}` : t.noData}
          </p>
        </div>

        <div className="glass px-3 py-2.5 rounded-xl border border-[var(--border-color)]">
          <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
            Max ({dimension === 'period' ? `${t.period} ${selectedElement.period}` : `${t.group} ${selectedElement.group}`})
          </p>
          <p className="text-base font-bold font-mono text-[var(--text-primary)]">
            {maxVal !== null ? `${maxVal.toFixed(currentConfig.decimals)} ${currentConfig.unit}` : t.noData}
          </p>
        </div>
      </div>

      {/* Interactive Recharts Graph */}
      <div className="relative glass p-4 rounded-2xl border border-[var(--border-color)] shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent-color)]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {currentConfig.label}
            </h4>
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] opacity-80">
            {t.clickPointToSelect}
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 10 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const clickedEl = e.activePayload[0].payload.element as PeriodicElement;
                  if (clickedEl && clickedEl.number !== selectedElement.number) {
                    onSelectElement(clickedEl);
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
              <XAxis
                dataKey="symbol"
                tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
                stroke="var(--border-color)"
                interval={0}
              />
              <YAxis
                tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                stroke="var(--border-color)"
                domain={['auto', 'auto']}
                unit={currentConfig.unit ? ` ${currentConfig.unit}` : ''}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass p-3 rounded-xl border border-[var(--border-color)] shadow-2xl text-xs space-y-1">
                        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1 mb-1">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", `cat-${data.element.category}`)}>
                            #{data.number} {data.symbol}
                          </span>
                          <span className="font-bold text-[var(--text-primary)]">{data.name}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[var(--text-secondary)]">{currentConfig.label}:</span>
                          <span className="font-bold font-mono text-[var(--accent-color)]">
                            {data.value !== null ? `${data.value} ${currentConfig.unit}` : t.noData}
                          </span>
                        </div>
                        <div className="text-[9px] text-[var(--text-secondary)] opacity-70 pt-0.5">
                          {data.isSelected ? `★ ${t.selectedElement}` : t.clickPointToSelect}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={currentConfig.color}
                strokeWidth={2.5}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (cx === null || cy === null || payload.value === null) return null;
                  const isCurrent = payload.number === selectedElement.number;
                  return (
                    <circle
                      key={`dot-${payload.number}`}
                      cx={cx}
                      cy={cy}
                      r={isCurrent ? 7 : 4}
                      fill={isCurrent ? accentColor : currentConfig.color}
                      stroke={isCurrent ? '#ffffff' : 'transparent'}
                      strokeWidth={isCurrent ? 2 : 0}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-125",
                        isCurrent && "filter drop-shadow-[0_0_8px_var(--accent-color)]"
                      )}
                      onClick={() => onSelectElement(payload.element)}
                    />
                  );
                }}
                activeDot={{
                  r: 8,
                  fill: accentColor,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  className: 'cursor-pointer'
                }}
              />

              {/* Reference dot for selected element */}
              {currentVal !== null && (
                <ReferenceDot
                  x={selectedElement.symbol}
                  y={currentVal}
                  r={8}
                  fill={accentColor}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isFront={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scientific Insights Banner */}
      <div className="glass p-4 rounded-2xl border border-[var(--border-color)] flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            {t.trendInsights}
          </h5>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {getInsightText()}
          </p>
        </div>
      </div>
    </div>
  );
};
