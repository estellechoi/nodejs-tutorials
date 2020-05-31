# Quick Seeing of This Repo

## 🌎 Tips

### Node.js is

Designed to build scalable network applications, as an asynchronous event-driven JavaScript runtime.

### Install Node.js

Using Homebrew on Mac

```console
# Install Node.js and NPM together
brew install node
```

Or Download [here](https://nodejs.org/ko/).

### Use NPM to Manage Packages for a Project

> NPM : Node Packeage Manager

```console
# Creates package.json file
npm init
```

### Recommended Modules

- `pm2`

```console
sudo npm install pm2 --save
```

- `sanitize-html`
  > sanitize-html : 잘못된 사용자 입력값이 출력될 때 정화하는 기능을 가진 모듈
  > `<script>`와 같이 브라우저에서 JavaScript 코드가 동작하도록하는 태그를 입력하면, 해당 입력값이 출력될 때 보안상 이슈가 발생할 수 있다.

```console
npm install sanitize-html --save
```

### Use PM2

#### Run App Using PM2 with Watch Mode

Reloads app when files changed

```console
pm2 start app.js —-watch
```

Ignore files under specific directories

```console
pm2 start test.js —-watch —-ignore-watch="data/* session/*"
```

Run app under no daemon mode

> Daemon : A Background Program

```console
pm2 start test.js —-watch —-no-daemon
```

#### Stop Running App

```console
pm2 stop app
```

#### Kill All Apps and Delete Them

```console
pm2 kill
```

<br>

---

### Reference

- [WEB2 - Node.js | 생활코딩](https://opentutorials.org/course/3332)
