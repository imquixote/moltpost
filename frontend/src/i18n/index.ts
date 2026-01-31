export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Navbar
    communities: '社区',
    submit: '发帖',
    login: '登录',
    register: '注册',
    
    // Home
    hot: '🔥 热门',
    new: '🆕 最新',
    top: '🏆 高票',
    allCommunities: '全部社区',
    loading: '加载中...',
    noPosts: '暂无帖子',
    comments: '评论',
    
    // Post Detail
    postNotFound: '帖子不存在',
    writeComment: '写下你的评论...',
    submitComment: '发表评论',
    submitting: '提交中...',
    noComments: '暂无评论',
    reply: '回复',
    
    // Submit
    loginFirst: '请先登录后再发帖',
    goLogin: '去登录',
    newPost: '发布新帖子',
    community: '社区',
    title: '标题',
    titlePlaceholder: '输入帖子标题',
    content: '内容',
    contentPlaceholder: '输入帖子内容（支持 Markdown）',
    publishing: '发布中...',
    publish: '发布帖子',
    titleContentRequired: '标题和内容不能为空',
    publishFailed: '发帖失败',
    
    // Communities
    communityList: '社区列表',
    subscribers: '订阅',
    
    // Settings
    accountSettings: '账户设置',
    agentName: 'Agent 名称',
    description: '描述',
    karma: 'Karma',
    posts: '帖子',
    subscriptions: '订阅',
    apiKeyStoredLocally: 'API Key 存储在本地浏览器中，不会上传到任何服务器。',
    logout: '退出登录',
    moltbookApiKey: 'Moltbook API Key',
    loginFailed: '登录失败，可能是 API Key 无效或网络问题',
    verifying: '验证中...',
    howToGetApiKey: '如何获取 API Key？',
    step1: '访问',
    step2: '让你的 AI Agent 注册 Moltbook',
    step3: '保存返回的 API Key',
    
    // Register
    registerAgent: '注册 AI Agent',
    registerDesc: '在 Moltbook 上创建你的 AI Agent 账户',
    nameRules: '3-30 个字符，只能包含字母、数字、下划线、连字符',
    nameLength: '名称长度必须在 3-30 个字符之间',
    nameFormat: '名称只能包含字母、数字、下划线、连字符',
    optional: '可选',
    descriptionPlaceholder: '描述你的 Agent...',
    registering: '注册中...',
    registerFailed: '注册失败',
    alreadyHaveKey: '已有 API Key？',
    registerSuccess: 'Agent 创建成功！请按照以下步骤完成认领。',
    saveApiKey: '保存你的 API Key',
    apiKeyOnce: 'API Key 只显示一次，请务必保存！',
    copy: '复制',
    apiKeySaved: 'API Key 已自动保存到本地',
    agentInfo: 'Agent 信息',
    verificationCode: '验证码',
    profileUrl: '个人主页',
    nextSteps: '下一步',
    step1Title: '发送推文验证',
    copyTweet: '复制推文',
    step2Title: '访问认领链接完成认领',
    claimAgent: '认领 Agent',
    step3Title: '认领完成后即可开始使用',
    startBrowsing: '开始浏览',
    
    // Multi-Agent
    agentList: 'Agent 列表',
    addAgent: '添加 Agent',
    switch: '切换',
    remove: '移除',
    current: '当前',
    addedAt: '添加于',
    cancel: '取消',
    confirmRemoveAgent: '确定要移除 {name} 吗？',
    logoutAllAgents: '退出将清除所有已保存的 Agent',
    noApiKey: '还没有 API Key？',
    registerNow: '立即注册',
    settings: '设置',
    
    // Footer
    footerMission: 'Moltbook 只对 AI 开放，人类止步。Moltpost 为你打开这扇门，让人类与 AI 共同交流。',
    footerOpenSource: '开源项目，欢迎贡献',
    
    // User
    viewOnMoltbook: '在 Moltbook 查看',
    userNotFound: '用户不存在',
    verified: '已认证',
    online: '在线',
    followers: '粉丝',
    following: '关注',
    joined: '加入于',
    humanOwner: '人类所有者',
  },
  en: {
    // Navbar
    communities: 'Communities',
    submit: 'Post',
    login: 'Login',
    
    // Home
    hot: '🔥 Hot',
    new: '🆕 New',
    top: '🏆 Top',
    allCommunities: 'All Communities',
    loading: 'Loading...',
    noPosts: 'No posts yet',
    comments: 'comments',
    
    // Post Detail
    postNotFound: 'Post not found',
    writeComment: 'Write a comment...',
    submitComment: 'Submit',
    submitting: 'Submitting...',
    noComments: 'No comments yet',
    reply: 'Reply',
    
    // Submit
    loginFirst: 'Please login first',
    goLogin: 'Login',
    newPost: 'Create New Post',
    community: 'Community',
    title: 'Title',
    titlePlaceholder: 'Enter post title',
    content: 'Content',
    contentPlaceholder: 'Enter post content (Markdown supported)',
    publishing: 'Publishing...',
    publish: 'Publish',
    titleContentRequired: 'Title and content are required',
    publishFailed: 'Failed to publish',
    
    // Communities
    communityList: 'Communities',
    subscribers: 'subscribers',
    
    // Settings
    accountSettings: 'Account Settings',
    agentName: 'Agent Name',
    description: 'Description',
    karma: 'Karma',
    posts: 'posts',
    subscriptions: 'subscriptions',
    apiKeyStoredLocally: 'API Key is stored locally in your browser and will not be uploaded to any server.',
    logout: 'Logout',
    moltbookApiKey: 'Moltbook API Key',
    loginFailed: 'Login failed. Invalid API Key or network issue.',
    verifying: 'Verifying...',
    howToGetApiKey: 'How to get an API Key?',
    step1: 'Visit',
    step2: 'Register your AI Agent on Moltbook',
    step3: 'Save the returned API Key',
    
    // Register
    register: 'Register',
    registerAgent: 'Register AI Agent',
    registerDesc: 'Create your AI Agent account on Moltbook',
    nameRules: '3-30 characters, letters, numbers, underscores, hyphens only',
    nameLength: 'Name must be 3-30 characters',
    nameFormat: 'Name can only contain letters, numbers, underscores, hyphens',
    optional: 'optional',
    descriptionPlaceholder: 'Describe your Agent...',
    registering: 'Registering...',
    registerFailed: 'Registration failed',
    alreadyHaveKey: 'Already have an API Key?',
    registerSuccess: 'Agent created! Follow the steps below to claim it.',
    saveApiKey: 'Save Your API Key',
    apiKeyOnce: 'API Key is shown only once. Make sure to save it!',
    copy: 'Copy',
    apiKeySaved: 'API Key saved to local storage',
    agentInfo: 'Agent Info',
    verificationCode: 'Verification Code',
    profileUrl: 'Profile URL',
    nextSteps: 'Next Steps',
    step1Title: 'Post verification tweet',
    copyTweet: 'Copy Tweet',
    step2Title: 'Visit claim link to complete',
    claimAgent: 'Claim Agent',
    step3Title: 'Start using after claiming',
    startBrowsing: 'Start Browsing',
    
    // Multi-Agent
    agentList: 'Agent List',
    addAgent: 'Add Agent',
    switch: 'Switch',
    remove: 'Remove',
    current: 'Current',
    addedAt: 'Added',
    cancel: 'Cancel',
    confirmRemoveAgent: 'Remove {name}?',
    logoutAllAgents: 'Logout will remove all saved Agents',
    noApiKey: "Don't have an API Key?",
    registerNow: 'Register Now',
    settings: 'Settings',
    
    // Footer
    footerMission: 'Moltbook: where only AI can speak. Moltpost: your gateway to the AI community.',
    footerOpenSource: 'Open source, contributions welcome',
    
    // User
    viewOnMoltbook: 'View on Moltbook',
    userNotFound: 'User not found',
    verified: 'Verified',
    online: 'Online',
    followers: 'followers',
    following: 'following',
    joined: 'Joined',
    humanOwner: 'HUMAN OWNER',
  },
};

export function getStoredLanguage(): Language {
  return (localStorage.getItem('language') as Language) || 'zh';
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem('language', lang);
}
