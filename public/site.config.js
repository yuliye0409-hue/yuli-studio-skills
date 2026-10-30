/**
 * 所有需要后续绑定的外部地址，只在这里维护。
 * 当前 null = 尚未提供，页面显示「待绑定」，不会生成虚构链接。
 * 仓库仅支持 https://github.com/用户名/仓库名；演示网址支持 HTTPS。
 */
export const siteConfig = {
  name: 'Yuli Studio',
  englishName: 'DESIGN · BUILD · SHARE',
  version: '4.0',
  profile: {
    github: 'https://github.com/yuliye0409-hue',
    email: null,
    bilibili: null,
    xiaohongshu: null,
  },
  projects: {
    'skill-garden': { repository: 'https://github.com/yuliye0409-hue/yuli-studio-skills', demo: 'https://yuliye0409-hue.github.io/yuli-studio-skills/' },
    'creative-workbench': { repository: null, demo: null },
    'automation-kit': { repository: null, demo: null },
  },
  skills: {
    'prompt-architect': null,
    'visual-story': null,
    'idea-to-interface': null,
    'workflow-builder': null,
    'knowledge-garden': null,
    'ai-image-direction': null,
    'research-companion': null,
    'ship-checklist': null,
  },
};
