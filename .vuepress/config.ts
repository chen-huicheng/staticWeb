import { defineUserConfig } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "leo 的博客",
  description: "一蓑烟雨任平生",
  base:"/",
  head: [['link', { rel: 'icon', href: '/web_icon.ico' }]],

  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    author: "leo",
    authorAvatar: "/leo.png",
    docsBranch: "master",
    docsDir: "docs",
    lastUpdatedText: "repoly",

    // series 为原 sidebar
    series: {
        "/docs/golang/": [
            {
                text: "guide",
                children: ["guide"],
            }
        ],
        "/blogs": [
            {
                text: "ChatGPT",
                children: [
                    "/blogs/chatgpt/onlyfans",
                    "/blogs/chatgpt/know_chatgpt",
                    "/blogs/chatgpt/update_gpt4",
                    "/blogs/chatgpt/sora",
                    "/blogs/chatgpt/use_gpt4",
                    "/blogs/chatgpt/proxy_recharge",
                ],
            },
            {
                text: "服务器",
                children: ["/blogs/server/redis_lock"],
                collapsible: true
            }
        ],
    },
    navbar: [
      { text: "首页", link: "/", icon: 'Home'},
      { text: "分类", link: "/categories/ChatGPT/1/", icon: 'Categories' },
      { text: "标签", link: "/tags/AI/1/", icon: 'Tag' },
      {
        text: "文档",
        children: [
          { text: "golang", link: "/docs/golang/guide" },
        ],
        icon: 'Document',
      },
      {
        text: "联系我",
        children: [
          { text: "github", link: "https://github.com/chen-huicheng" },
          { text: "微信", link: "/docs/contact/wechat"}
        ],
        icon: 'User'
      },
    ],
   
    // commentConfig: {
    //   type: 'waline',
    //   options: {
    //     serverURL:'https://vercel-brcyoyj2c-chen-huichengs-projects.vercel.app/'
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});

