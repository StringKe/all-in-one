<p align='right'>
  <a href='./README_CN.md' target='_blank' hreflang='zh-cn'>简体中文</a>
</p>

# All in one

# 1. Introduction

this project combines common tools into one website as much as possible to facilitate users to find and use them.

# 2. Installation

## 2.1 (Recommended) Docker

```bash
docker run -d -p 5413:3000 --name all-in-one ****/all-in-one
```

## 2.2. Local installation

You need to install Node.js (v20) and npm in advance.

```
git clone https://github.com/StringKe/all-in-one
cd all-in-one

# Only need to execute once
npm install -g pnpm

# Install dependencies
pnpm install

# Build and start
pnpm run build
pnpm run start
```

# 3. Use

1. After starting the container with Docker, visit `http://localhost:5413`.
2. After local installation, visit `http://localhost:3000`.

# 4. Request a new tool

If you have a new tool you would like to add to this project, you can do so in the following ways:

1. Submit an issue.
2. Submit a pull request.

## 4.1. Submitting an issue

1. Click [here](/issues/new). 2.
2. Fill in the title and description. 3.
3. Click `Submit new issue`. 4.
4. Wait for a review to see if this is possible.

## 4.2. Submit a pull request

Follow the specifications in 5.2. Contribution Guidelines.

# 5. Contribution

## 5.1. Contributors

-   [StringKe](https://github.com/StringKe)

## 5.2. Contribution Guidelines

please make sure your contribution meets the following specifications.

### 5.2.1. Code specification

this project has been configured with ESLint and Prettier, you can use the following commands to check the code
specification:

```bash
pnpm run lint
pnpm prettier . --check
```

```bash
# Fix code specification
pnpm prettier . --write
```

### 5.2.2. Submission specification

this project uses [Conventional Commits](https://www.conventionalcommits.org/) to standardize commit messages. Please
strictly follow the following specifications:

-   `feat`: new feature
-   `fix`: fix problem
-   `docs`: documentation modification
-   `style`: code format modification
-   `refactor`: code refactoring
-   `perf`: performance optimization
-   `test`: test
-   `build`: build system or package dependency update
-   `ci`: CI configuration
-   `chore`: other modifications
-   `revert`: undo submission
-   `release`: publish a new version

The commit message format is as follows:

```
<type>(<scope>): <subject>
```

For example:

```
feat: add new tool
```

# 6. License

GPL-3.0 License.
