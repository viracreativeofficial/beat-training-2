# GitHub 创建仓库详细指南

## 📋 步骤概览

1. 登录 GitHub
2. 创建新仓库
3. 配置仓库设置
4. 获取仓库地址

---

## 详细步骤

### 步骤 1: 登录 GitHub

1. **打开浏览器**，访问 [github.com](https://github.com)

2. **登录账号**
   - 如果已有账号：点击右上角 **"Sign in"** 登录
   - 如果没有账号：点击 **"Sign up"** 注册新账号
     - 需要：用户名、邮箱、密码
     - 验证邮箱后即可使用

### 步骤 2: 进入创建仓库页面

登录后，有两种方式创建新仓库：

#### 方法 A: 通过右上角按钮（推荐）

1. 点击页面右上角的 **"+"** 图标（加号按钮）
2. 在下拉菜单中选择 **"New repository"**

#### 方法 B: 通过个人资料页面

1. 点击右上角你的头像
2. 选择 **"Your repositories"**
3. 点击绿色的 **"New"** 按钮

### 步骤 3: 填写仓库信息

你会看到一个表单，需要填写以下信息：

#### Repository name（仓库名称）⭐ 必填

- 输入：`beat-training-2`（或你喜欢的名字）
- **命名规则**：
  - 只能包含字母、数字、连字符(-)和下划线(_)
  - 不能有空格
  - 建议使用小写字母
  - 例如：`my-awesome-app`、`project-2024`、`beat-training`

#### Description（描述）⬜ 可选

- 输入：`Beat Training App - 节拍训练应用`
- 或者：`A Next.js app for beat training and tempo practice`
- 这是对项目的简短描述，可以帮助别人了解你的项目

#### Visibility（可见性）⭐ 必选

选择仓库的可见性：

- ✅ **Public（公开）**
  - 任何人都可以看到你的代码
  - **完全免费**
  - 适合开源项目和学习项目
  - **推荐选择这个**

- ⬜ **Private（私有）**
  - 只有你和你邀请的人可以看到
  - 免费账号有数量限制（通常 3 个私有仓库）
  - 适合私人项目或商业项目

#### 初始化选项 ⚠️ 重要

**不要勾选以下任何选项**（因为你的项目已经有这些文件了）：

- ⬜ **Add a README file** 
  - ❌ 不要勾选（你的项目已经有 README.md）

- ⬜ **Add .gitignore**
  - ❌ 不要勾选（你的项目已经有 .gitignore）

- ⬜ **Choose a license**
  - ❌ 不要勾选（首次创建可以稍后添加）

### 步骤 4: 创建仓库

1. 检查所有设置是否正确
2. 点击页面底部的绿色按钮 **"Create repository"**

### 步骤 5: 获取仓库地址

创建成功后，GitHub 会显示一个快速设置页面，你会看到：

#### 重要信息：仓库地址

页面会显示类似这样的内容：

```
Quick setup — if you've done this kind of thing before
https://github.com/你的用户名/beat-training-2.git
```

**复制这个 HTTPS 地址**（整个 URL）

例如：
- `https://github.com/zhangsan/beat-training-2.git`
- `https://github.com/john-doe/my-app.git`

#### 页面上的其他选项

你可能会看到一些命令提示，但**暂时忽略它们**，因为我们会在下一步详细说明。

---

## 📸 界面说明

### 创建仓库页面的各个部分：

```
┌─────────────────────────────────────────┐
│  Owner: [你的用户名 ▼]                    │
│  Repository name: [beat-training-2]     │
│                                         │
│  Description:                           │
│  [Beat Training App...]                 │
│                                         │
│  ⚪ Public                              │
│  ⚪ Private                              │
│                                         │
│  ⬜ Add a README file                    │
│  ⬜ Add .gitignore                       │
│  ⬜ Choose a license                     │
│                                         │
│         [Create repository]             │
└─────────────────────────────────────────┘
```

---

## ✅ 创建成功后的检查清单

创建仓库后，确认以下内容：

- [ ] 仓库名称正确
- [ ] 可见性设置正确（Public/Private）
- [ ] 已复制仓库的 HTTPS 地址
- [ ] 仓库页面可以正常访问

---

## 🔗 下一步

创建仓库后，你需要：

1. **复制仓库地址**（HTTPS URL）
2. **回到本地项目**，准备上传代码
3. **参考 `部署指南.md`** 中的"上传代码到 GitHub"部分

---

## 💡 常见问题

### Q: 仓库名称可以修改吗？

A: 可以！创建后：
1. 进入仓库页面
2. 点击 **Settings**（设置）
3. 滚动到最底部
4. 在 **Danger Zone** 部分可以重命名或删除仓库

### Q: Public 和 Private 有什么区别？

A: 
- **Public**: 任何人都可以查看代码，适合学习和展示项目
- **Private**: 只有授权的人可以查看，适合商业项目

### Q: 创建后找不到仓库地址？

A: 
1. 进入你的 GitHub 主页
2. 点击 **"Repositories"** 标签
3. 找到你的仓库
4. 点击仓库名称进入
5. 点击绿色的 **"Code"** 按钮
6. 复制 HTTPS 地址

### Q: 可以创建多个仓库吗？

A: 可以！免费账号可以创建无限个公开仓库，私有仓库有限制。

### Q: 仓库名称已经被占用怎么办？

A: 
- 如果是在你的账号下，说明你已经创建过同名仓库
- 可以换个名字，比如：`beat-training-2`、`beat-training-app`、`my-beat-training`

---

## 🎯 快速参考

**创建仓库的快速步骤：**

1. 登录 GitHub → 点击 **"+"** → **"New repository"**
2. 输入仓库名：`beat-training-2`
3. 选择 **Public**
4. **不要勾选**任何初始化选项
5. 点击 **"Create repository"**
6. **复制 HTTPS 地址**

---

## 📝 示例：完整的仓库信息

假设你的 GitHub 用户名是 `zhangsan`，那么：

- **仓库名称**: `beat-training-2`
- **完整 URL**: `https://github.com/zhangsan/beat-training-2`
- **Git 地址**: `https://github.com/zhangsan/beat-training-2.git`
- **可见性**: Public
- **描述**: Beat Training App - 节拍训练应用

---

完成这些步骤后，你就有了一个 GitHub 仓库！下一步是上传你的代码。
