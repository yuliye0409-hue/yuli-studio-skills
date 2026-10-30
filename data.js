// 编辑这里即可维护技能库。首批条目是演示内容，不代表个人履历或已发布作品。
export const categories = [
  { id: 'all', label: '全部技能' },
  { id: 'ai', label: 'AI & 自动化' },
  { id: 'design', label: '设计 & 创意' },
  { id: 'dev', label: '开发 & 构建' },
  { id: 'productivity', label: '效率 & 思考' },
];

export const skills = [
  {
    id: 'prompt-architect', category: 'ai', title: '把想法，说清楚', subtitle: 'Prompt Architect',
    description: '把模糊的一句话，变成 AI 能听懂、能执行的好提示词。',
    tags: ['提示词工程', '结构化表达'], color: 'sage', art: 'prompt', icon: 'sparkles', featured: true,
    overview: '好提示词不是堆砌修饰词，而是交代清楚目标、背景、限制和验收标准。用下面这个骨架，把脑海里的想法变成一份可执行的任务说明。',
    steps: ['先说结果：这次需要交付什么，给谁使用。', '补齐背景：提供已有资料、参考案例和使用场景。', '写清边界：明确风格、篇幅、不能修改的内容。', '约定验收：列出完成后可以逐项核对的标准。'],
    prompt: '请帮我完成以下任务。\n\n目标：[想要达成的结果]\n使用者：[面向谁]\n背景与材料：[已有信息与参考]\n交付格式：[文案 / 表格 / 代码 / 方案]\n限制条件：[篇幅、风格、必须保留或避开的内容]\n验收标准：[怎样判断结果可用]\n\n如果有影响结果的关键信息缺失，请先指出；其余信息使用合理假设，并明确标注。',
    takeaway: '先把问题定义好，再让 AI 放大你的表达。',
  },
  {
    id: 'visual-story', category: 'design', title: '让画面，替你说话', subtitle: 'Visual Storytelling',
    description: '从灵感板到视觉叙事，让每一张画面都表达得恰到好处。',
    tags: ['视觉设计', '灵感探索'], color: 'peach', art: 'visual', icon: 'pen-tool',
    overview: '先决定画面传达什么，再决定它长什么样。通过主次关系、色彩与留白，让视觉风格和信息目标站在同一边。',
    steps: ['用三个关键词定义希望观众感受到的情绪。', '确定唯一的视觉焦点，删掉抢夺注意力的元素。', '选择一个主色、一种中性色和一个小面积强调色。', '缩小到手机尺寸，检查信息层级是否依然清楚。'],
    prompt: '为 [主题 / 产品] 制定一个视觉方向。\n\n受众：[人群]\n核心信息：[只能记住一件事时，希望记住什么]\n情绪关键词：[三个词]\n使用场景：[网页 / 海报 / 社交媒体]\n\n请提供：配色建议（包含 HEX）、字体气质、构图说明、主次层级，以及需要避免的视觉表达。请解释每个选择如何服务于核心信息。',
    takeaway: '设计不是把空间填满，而是让重要的东西被看见。',
  },
  {
    id: 'idea-to-interface', category: 'dev', title: '从一句话，到一个网页', subtitle: 'Idea to Interface',
    description: '用清晰的需求和小步迭代，把脑海里的页面真正做出来。',
    tags: ['Vibe Coding', '网页开发'], color: 'lavender', art: 'code', icon: 'code', featured: true,
    overview: '先完成一个能使用的最小闭环，再逐步雕琢外观和边界情况。把需求拆成页面、组件、状态和交互，会比一次性描述整个产品更容易验证。',
    steps: ['描述最重要的用户场景与一个核心操作。', '列出页面结构、必需内容和交互状态。', '先做静态布局，再补充真实的交互逻辑。', '在桌面与手机尺寸下检查溢出、可读性和键盘操作。'],
    prompt: '请实现一个 [页面类型]。\n\n目标用户：[人群]\n核心任务：[用户要完成的事情]\n页面结构：[从上到下列出区域]\n视觉方向：[参考与风格关键词]\n交互：[按钮、表单、筛选等的实际行为]\n数据：[已有数据 / 明确标记的示例数据]\n\n要求：适配手机与桌面；按钮必须可用；补齐空状态、错误状态和键盘焦点；不要编造用户信息。先实现最小可用版本，再说明验证结果。',
    takeaway: '先让它工作，再让它好用，最后让它令人喜欢。',
  },
  {
    id: 'workflow-builder', category: 'ai', title: '重复的事，交给工作流', subtitle: 'Workflow Builder',
    description: '把琐碎操作连成线，让工具接力，把时间还给更重要的事。',
    tags: ['自动化', '工作流'], color: 'butter', art: 'workflow', icon: 'workflow',
    overview: '自动化适合处理输入稳定、步骤明确、可以验证的重复任务。先画清楚输入与输出，再考虑接入什么工具；涉及发送、付款和删除的步骤，应保留人工确认。',
    steps: ['记录重复任务的触发条件、输入和预期输出。', '把过程拆成单步可验证的操作。', '为失败、超时和重复执行设置处理方式。', '保留高风险操作的人工确认，再用少量样例试运行。'],
    prompt: '请把下面的重复任务拆解为安全、可验证的自动化工作流。\n\n任务：[任务描述]\n触发条件：[何时开始]\n输入：[材料与格式]\n期望输出：[结果与去向]\n可用工具：[工具清单]\n\n请按步骤列出：输入、操作、输出、验证方法、失败后的处理。对发送消息、删除数据、付款等外部写操作设置人工确认，不要假设已经获得权限。',
    takeaway: '自动化的价值，不是步骤更少，而是少操心一次。',
  },
  {
    id: 'knowledge-garden', category: 'productivity', title: '给知识，一个生长的地方', subtitle: 'Knowledge Garden',
    description: '不止收藏，更要连接。把零散信息整理成可复用的知识资产。',
    tags: ['知识管理', '个人系统'], color: 'sky', art: 'knowledge', icon: 'book-open',
    overview: '收藏只是开始，能在需要时取用才算真正拥有。每条笔记保留一个核心观点、适用场景和来源，再把相近主题连接起来。',
    steps: ['只记录与你正在做的事有关的信息。', '用自己的话写一句核心结论，并保留来源。', '给笔记加上适用场景，而不只是主题标签。', '每周把一条笔记转成一次实际行动，删除过时内容。'],
    prompt: '请将以下材料整理成一张可复用的知识卡片。\n\n材料：[粘贴内容]\n\n输出结构：\n1. 一句话核心观点\n2. 适用场景\n3. 可执行步骤\n4. 注意事项与反例\n5. 与其他主题的连接\n6. 来源与仍需核实的信息\n\n区分原文事实与你的推论，不要补造来源。',
    takeaway: '让知识流动起来，它才会变成你的能力。',
  },
  {
    id: 'ai-image-direction', category: 'design', title: '脑海里的画面，见面吧', subtitle: 'Image Direction',
    description: '把风格、光线和构图说准确，让想象变成有方向的视觉作品。',
    tags: ['AI 图像', '创意表达'], color: 'rose', art: 'image', icon: 'image',
    overview: '用「主体 + 环境 + 构图 + 光线 + 材质 + 风格」描述画面。先做低成本探索，再固定已确认的元素，逐次只改变一两个变量。',
    steps: ['确定主体在做什么，以及画面需要传达的情绪。', '选择镜头景别、画幅比例和主体位置。', '描述光线方向、材质和统一的色彩倾向。', '每次只调整一个关键变量，记录有效的提示词。'],
    prompt: '请为以下创意写一份图像生成提示词。\n\n创意：[描述]\n用途与画幅：[场景 / 比例]\n主体与动作：[内容]\n环境：[场景]\n光线与材质：[要求]\n风格与情绪：[关键词]\n必须保留：[约束]\n\n先给出完整提示词，再提供两个只改变构图或光线的变体。不要擅自添加文字、水印或品牌标识。',
    takeaway: '越清楚自己要看见什么，越容易与想象见面。',
  },
  {
    id: 'research-companion', category: 'ai', title: '不只找答案，更找依据', subtitle: 'Research Companion',
    description: '从问题拆解到证据整理，让每个判断都有迹可循。',
    tags: ['深度研究', '信息整理'], color: 'mint', art: 'research', icon: 'scan',
    overview: '把大问题拆成可以查证的小问题，并区分事实、观点与推论。对有时效性的信息记录发布日期，重要判断优先寻找原始来源。',
    steps: ['把研究目标写成一个可以回答的具体问题。', '拆解子问题，并为每项列出需要的证据。', '交叉核实关键结论，记录出处与日期。', '用事实、推论、不确定性三个层级组织结果。'],
    prompt: '请协助研究：[具体问题]。\n\n使用场景：[为什么要研究]\n时间范围：[范围]\n已知资料：[内容]\n\n先拆解子问题，再整理可验证的证据。输出包含：核心结论、支持依据、原始来源、资料日期、不同观点和仍未解决的问题。明确区分事实与推论；无法查证时直说，不要编造引用。',
    takeaway: '好的研究，不只解释你知道什么，也交代你还不知道什么。',
  },
  {
    id: 'ship-checklist', category: 'dev', title: '上线前，再多想一步', subtitle: 'Ship with Confidence',
    description: '用一份轻量检查单，照顾那些最容易被忽略的使用细节。',
    tags: ['产品打磨', '质量检查'], color: 'stone', art: 'checklist', icon: 'check-circle',
    overview: '能打开不等于能交付。上线前从真实用户的角度，走一遍主要任务，同时检查空状态、失败反馈、移动端与无障碍操作。',
    steps: ['模拟新用户，从进入页面到完成核心任务。', '检查所有按钮、链接和表单是否确实生效。', '覆盖空数据、长文本、网络失败和重复点击。', '在手机尺寸和键盘导航下复查，再整理遗留问题。'],
    prompt: '请检查这个页面或产品的交付质量。\n\n核心用户任务：[任务]\n当前实现：[代码 / 链接 / 描述]\n\n检查维度：核心流程、交互反馈、空状态、错误处理、手机适配、键盘可访问性、内容真实性与明显安全问题。按严重程度输出问题、复现步骤和建议；区分已经验证的问题与尚需测试的风险，不要把推测写成测试结果。',
    takeaway: '把细节照顾好，才算真正把作品交到用户手上。',
  },
];

export const workflows = [
  { id: 'create', number: '01', title: '一个想法，到一个作品', description: '把「我想做一个…」变成可以打开的页面。', tags: ['清晰表达', '页面构建', '上线检查'], skills: ['prompt-architect', 'idea-to-interface', 'ship-checklist'], color: 'sage', icon: 'code' },
  { id: 'visual', number: '02', title: '一点灵感，到一套视觉', description: '找到表达方向，让每张画面都有共同语言。', tags: ['信息研究', '视觉方向', '图像创作'], skills: ['research-companion', 'visual-story', 'ai-image-direction'], color: 'peach', icon: 'pen-tool' },
  { id: 'system', number: '03', title: '一份经验，到一套系统', description: '整理做过的事，把好方法留给下一次。', tags: ['经验提炼', '知识沉淀', '自动化'], skills: ['prompt-architect', 'knowledge-garden', 'workflow-builder'], color: 'lavender', icon: 'workflow' },
];

export function filterSkills(items, category = 'all', query = '', saved = []) {
  const normalized = query.trim().toLocaleLowerCase();
  return items.filter(skill => {
    const categoryMatches = category === 'all' || (category === 'favorites' ? saved.includes(skill.id) : skill.category === category);
    const text = [skill.title, skill.subtitle, skill.description, ...skill.tags].join(' ').toLocaleLowerCase();
    return categoryMatches && (!normalized || text.includes(normalized));
  });
}

// 项目地址与个人联系方式在 public/site.config.js 统一维护。
export const projects = [
  {
    id: 'skill-garden', name: 'Yuli Studio', title: '给每一种创造力，一个栖身之处。',
    description: '一片属于自己的数字自留地。把做过的项目、顺手的 Skills 和值得记下的经验，认真地放在一起。',
    type: '个人网站', status: '当前项目', tags: ['Personal website', 'Skills', 'Open source'], demo: 'garden',
    detail: '这就是你正在浏览的网站。产品、Skills、文章、关于我与交流五个入口共用一套内容配置。已经实现技能搜索、收藏、详情阅读和提示词复制，项目仓库与演示地址可单独绑定。',
    features: ['五个内容入口，项目与技能各有位置', '搜索、收藏和可复制的提示词', '适配电脑、平板与手机', '仓库与演示地址分开配置'],
  },
  {
    id: 'creative-workbench', name: 'Creative Workbench', title: '把一闪而过的灵感，留成作品。',
    description: '为设计、内容与视觉探索预留的项目展示位。之后可以替换成你的真实作品与 GitHub 仓库。',
    type: '创意工具', status: '示例展示位', tags: ['Design', 'Content', 'Creative tools'], demo: 'creative',
    detail: '这是一个用于确认版式的示例展示位，并非已经发布的产品。后续提供项目名称、简介、截图和仓库地址后，就可以替换这里的内容；目前不会把它跳转到其他人的仓库。',
    features: ['展示工具解决的问题与使用场景', '保留产品截图或交互预览的位置', '支持独立绑定 GitHub 与在线演示', '使用真实内容替换后即可对外展示'],
  },
  {
    id: 'automation-kit', name: 'Everyday Automation', title: '少一点重复，多一点专注。',
    description: '为自动化与效率工具预留的项目展示位。让一个个小工具，接住那些可以少做一次的事。',
    type: '效率工具', status: '示例展示位', tags: ['Automation', 'Workflow', 'Productivity'], demo: 'automation',
    detail: '这是自动化类项目的示例展示位。界面里的步骤只用于演示信息结构，不会自动处理文件、调用外部工具或向第三方发送资料。真实项目可在后续提供仓库地址后接入。',
    features: ['用输入、处理与输出说明工作原理', '可展示终端、配置或操作界面', '仓库和在线演示分别维护', '未绑定地址时明确展示状态'],
  },
];

export const articles = [
  {
    id: 'from-idea-to-brief', category: '创造方法', title: '把一句想法，拆成可以开工的需求。',
    excerpt: '从「我想做一个」到「下一步做什么」，中间只差一份足够清楚的任务说明。',
    status: '示例草稿', date: null,
    sections: [
      { heading: '先写结果，再写功能', text: '用一句话描述用户最终能够完成什么。例如，「在一个页面找到需要的技能，并复制可使用的提示词」。它比堆叠很多功能名称更容易确定首版的边界。' },
      { heading: '把页面变成一条路径', text: '想象用户第一次进入页面：先看到什么，接着会点什么，点完如何确认操作成功。把这些动作排成顺序，就能看出哪些内容是必需的。' },
      { heading: '给完成一个明确的定义', text: '需求除了描述正常状态，也要交代没有结果、数据尚未提供和操作失败时的反馈。用几个可以实际操作的检查项收尾，作品就更容易验收。' },
    ],
  },
  {
    id: 'skills-that-last', category: 'Skills 手记', title: '好用的 Skill，应该留下判断的方法。',
    excerpt: '不只是一段很长的提示词，更是能够再次复用的目标、边界与检查方法。',
    status: '示例草稿', date: null,
    sections: [
      { heading: '明确什么时候用', text: '一个可复用的技能需要有清晰的使用场景。先说明它适合解决什么问题，再写所需输入与交付结果，使用者就更容易判断是否应该调用它。' },
      { heading: '把经验写成规则', text: '与其只留下「做得好看一点」，不如说明信息层级、文字可读性和色彩的使用边界。把关键判断写出来，才能把一次结果沉淀为稳定的方法。' },
      { heading: '留一个验证的出口', text: '最后交代如何检查输出：来源是否可核实、交互是否真实可用、未知信息是否明确标注。一个技能的价值，也体现在它如何帮助使用者识别不确定性。' },
    ],
  },
  {
    id: 'a-garden-not-a-warehouse', category: '数字自留地', title: '让收藏变成实践，而不是另一个文件夹。',
    excerpt: '给每一条记录留一个使用场景，让知识在下一次创造时真正派上用场。',
    status: '示例草稿', date: null,
    sections: [
      { heading: '为使用而整理', text: '除了主题分类，再为记录补一句「下一次什么时候会用到」。例如，交付前检查、写需求之前或开始视觉探索时。使用场景往往比更多标签更容易唤起记忆。' },
      { heading: '保留自己的理解', text: '收藏资料时写下一句自己的总结，并保留原始来源。把事实、个人理解和下一步行动分开，既方便回顾，也能减少误用信息的可能。' },
      { heading: '让内容继续生长', text: '找出一条最近收藏的内容，把它用于一个小项目。用完之后补上有效的步骤、踩过的坑和可以删掉的部分，知识库就会逐渐长成自己的工作方式。' },
    ],
  },
];
