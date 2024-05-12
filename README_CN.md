<p align='right'>
  <a href='./README.md' target='_blank' hreflang='en'>English</a>
</p>

# All in one

# 1. 介绍

本项目尽可能的将常用工具结合到一个网站中，方便用户查找和使用。

# 2. 安装

## 2.1 (推荐) Docker

```bash
docker run -d -p 5413:3000 --name all-in-one ****/all-in-one
```

## 2.2. 本地安装

你需要提前安装好 Node.js (v20) 和 npm。

```
git clone https://github.com/StringKe/all-in-one
cd all-in-one

# 仅需执行一次
npm install -g pnpm

# 安装依赖
pnpm install

# 构建和启动
pnpm run build
pnpm run start
```

# 3. 使用

1. 使用 Docker 启动容器后，访问 `http://localhost:5413`。
2. 本地安装后，访问 `http://localhost:3000`。

# 4. 请求新工具

如果你有新的工具想要添加到本项目中，可以通过以下方式：

1. 提交一个 issue。
2. 提交一个 pull request。

## 4.1. 提交 issue

1. 点击 [这里](/issues/new)。
2. 填写标题和描述。
3. 点击 `Submit new issue`。
4. 等待审查是否可以实现

## 4.2. 提交 pull request

遵守 5.2. 贡献指南 中的规范。

# 5. 贡献

## 5.1. 贡献者

-   [StringKe](https://github.com/StringKe)

## 5.2. 贡献指南

请确保你的贡献符合以下规范。

### 5.2.1. 代码规范

本项目已经配置了 ESLint 和 Prettier，你可以使用以下命令检查代码规范：

```bash
pnpm run lint
pnpm prettier . --check
```

```bash
# 修复代码规范
pnpm prettier . --write
```

### 5.2.2. 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范提交信息。请严格遵守以下规范：

-   `feat`: 新功能
-   `fix`: 修复问题
-   `docs`: 文档修改
-   `style`: 代码格式修改
-   `refactor`: 代码重构
-   `perf`: 性能优化
-   `test`: 测试
-   `build`: 构建系统或者包依赖更新
-   `ci`: CI 配置
-   `chore`: 其他修改
-   `revert`: 撤销提交
-   `release`: 发布新版本

提交信息格式如下：

```
<type>(<scope>): <subject>
```

例如：

```
feat: add new tool
```

# 6. 许可证

遵守 GPL-3.0 许可证。
