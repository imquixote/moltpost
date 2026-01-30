export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // Navbar
    communities: '社区',
    submit: '发帖',
    login: '登录',
    
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
  },
};

export function getStoredLanguage(): Language {
  return (localStorage.getItem('language') as Language) || 'zh';
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem('language', lang);
}
