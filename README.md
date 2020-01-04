# #code #nodejs #javascript
---
## Node.js 란 ?
- As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.

## Node.js 설치
- Node.js
- NPM
[image:56B61D69-D44E-43D9-ABBE-A32E07F9E93F-925-000002F56987A43A/nodejs_install.png]

---
## API (Application Programming Interface)
- API : 어플리케이션을 프로그래밍하기 위해 제공되는 인터페이스

---
## 동기(Synchronous)와 비동기(Asynchronous)


---
## 패키지 매니저(Package Manager) 사용하기
1.  NPM 을 사용하여 PM2 설치하기
	- `sudo npm install pm2 -g`
	- PM2 : node.js 프로그램 변경사항 발생시 자동으로 종료/재시작 등의 기능
	- -g : global 컴퓨터 전역에서 사용할 수 있는 프로그램으로 설치

2. NPM 으로 패키지 관리하기
	- `npm init`
	- 프로젝트 디렉토리에 패키지 설정정보를 담은 JSON 파일 생성 (package.json)
	- package.json 파일을 수정하여 패키지 설정을 변경할 수 있다. (프로젝트 관리)

[image:FB2673AB-4D28-4A9C-A7F7-A792DB71B1EE-2788-000010C849688AF9/npm_init.png]

3. NPM 을 사용하여 모듈 설치하기
  	 - `npm install -S sanitize-html`
		- sanitize-html : 잘못된 사용자 입력값이 출력될 때 정화하는 기능을 가진 모듈
			- 잘못된 사용자 입력값의 출력 ? <script>와 같이 브라우저에서 javaScript 코드가 동작하도록하는 태그를 입력하면, 해당 입력값이 출력될 때 보안상 이슈가 발생할 수 있다.
		- -S : 특정 프로젝트에서만 사용할 수 있는 프로그램으로 설치

	- 모듈 의존성 추가
		- package.json 파일의 “dependencies” 속성에 설치한 모듈이 자동으로 추가된다. (해당 모듈에 대한 의존성 추가)
[image:319F2D73-C709-4211-A321-84E8ED05F7E9-2788-0000112685E272A7/npm_install_sanitize.png]

	- 모듈과 해당 모듈이 의존하는 다른 모듈도 함께 설치된다. (NPM에서 자동 지원)

---
## PM2 사용하기
#### PM2 를 사용하여 프로그램 시작
- `pm2 start test.js —-watch`
: pm2를 실행할 때 watch 옵션을 적용하면, 파일이 변경되었을 때 앱을 자동 리로드

- `pm2 start test.js —-watch —-ignore-watch=“data/* session/*”`
: watch 옵션을 적용했을 때, 특정 디렉토리의 파일들이 변경되어도 앱이 리로드되지 않도록 ignore-watch 설정

- `pm2 start test.js —-watch —-no-daemon`
	- 데몬이 아닌 상태로 실행 (stream logs)
	- 데몬(Daemon)이란 ? 백그라운드로 실행되는 프로그램

#### PM2 를 사용하여 프로그램 종료
- `pm2 stop test`

#### PM2로 실행한 모든 프로세스를 중지 & 삭제
- `pm2 kill`



---
