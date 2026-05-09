export interface MonsterStageConfig {
  stage: number
  name: string
  zoneName: string
  image: string
  bgImage: string
  /** CSS hue-rotate for atmosphere layer to differentiate stages */
  themeHue: number
  /** Atmosphere overlay color (rgba) */
  atmosphereColor: string
  /** Boss name for subStage 10 */
  bossName: string
}

const BASE_URL = import.meta.env.BASE_URL

export const MONSTER_STAGES: MonsterStageConfig[] = [
  {
    stage: 1,
    name: '史莱姆',
    zoneName: '幽暗森林',
    image: `${BASE_URL}assets/monster-stage1.png`,
    bgImage: `${BASE_URL}assets/background-scene.webp`,
    themeHue: 0,
    atmosphereColor: 'rgba(100, 200, 80, 0.12)',
    bossName: '史莱姆王',
  },
  {
    stage: 2,
    name: '骷髅兵',
    zoneName: '暗影洞穴',
    image: `${BASE_URL}assets/monster-stage2.png`,
    bgImage: `${BASE_URL}assets/bg-stage2.png`,
    themeHue: 270,
    atmosphereColor: 'rgba(140, 60, 200, 0.14)',
    bossName: '骷髅将军',
  },
  {
    stage: 3,
    name: '火焰元素',
    zoneName: '熔岩火山',
    image: `${BASE_URL}assets/monster-stage3.png`,
    bgImage: `${BASE_URL}assets/bg-stage3.png`,
    themeHue: 15,
    atmosphereColor: 'rgba(255, 100, 30, 0.16)',
    bossName: '炎魔领主',
  },
  {
    stage: 4,
    name: '冰霜巨人',
    zoneName: '极寒冰原',
    image: `${BASE_URL}assets/monster-stage4.png`,
    bgImage: `${BASE_URL}assets/bg-stage4.png`,
    themeHue: 200,
    atmosphereColor: 'rgba(100, 180, 255, 0.14)',
    bossName: '冰霜之王',
  },
  {
    stage: 5,
    name: '深渊恶魔',
    zoneName: '无尽深渊',
    image: `${BASE_URL}assets/monster-stage5.png`,
    bgImage: `${BASE_URL}assets/bg-stage5.png`,
    themeHue: 340,
    atmosphereColor: 'rgba(200, 30, 60, 0.18)',
    bossName: '恶魔君主',
  },
]

/**
 * 获取当前关卡的怪物配置
 * stage 超过5时循环使用配置，但属性仍按公式缩放
 */
export function getMonsterForStage(stage: number): MonsterStageConfig {
  const index = ((stage - 1) % MONSTER_STAGES.length)
  const config = MONSTER_STAGES[index]
  return {
    ...config,
    stage,
  }
}
