# Shock - 내가 골라 외우는 영단어

[![Patreon](https://img.shields.io/badge/Sponsor-Patreon-critical)](https://www.patreon.com/bePatron?u=64697816)
<img src="https://img.shields.io/badge/Language-Node.js-green" />

## ❓ Shock 서비스가 뭐에요?   
- **Shock**는 **<u>내가 직접 고른 영단어를 쉽게 외울 수 있게</u>** 하기 위해 만들었습니다.  
- 처음에는 가족의 부탁으로 만들어서, 조금씩 살을 붙이다 보니 이렇게 되었습니다.
- 많은 지식이 없기도 하고, 처음으로 끝까지 만들어본 Node.js 프로젝트인 만큼 기술적으로 부족한 점이 산더미입니다.. 답답하시더라도 넓은 마음으로 양해 부탁드려요 😋
- 피드백이나 문제점은 이슈를 생성해 알려주세요!

## 🙋‍♀️ 구체적인 기능을 알려주세요!   
1. 단어장 탭에 들어가면 나만의 단어장을 만들고 수정하고, 공유할 수 있어요!
2. 학습 탭에서는 단어를 출력하고, 퀴즈학습을 통해 단어를 쉽게 외울 수 있어요!
3. 클래스 기능에서는 학생을 초대하고, 클래스 전용 단어장 보관함에 단어장을 생성하고 학생들과 자동으로 공유할 수 있어요!

## 🎫 서비스에 관심이 있으신가요?
현재 Shock 서비스는 지출 문제로 호스팅을 중단한 상태에요..<br>
Shock 서비스에 관심이 있으시다면 [이곳](https://example.com)에서 서비스 소개서를 읽어주세요.<br>
관련해서 [후원](https://www.patreon.com/bePatron?u=64697816)이나 외주를 맡기시려면 언제든 제게 연락 주세요!

## 📑감사

>어떤 모듈이나 소스, API를 사용했는지 알려드려요!<br>까먹고 안 적은 게 있다면 언제든지 알려주세요! 😉
   
<details><summary>Modules
</summary>

- crypto
- crypto-js
- dotenv
- ejs
- express
- express-rate-limit
- express-session
- helmet
- ip
- jsonwebtoken
- moment-timezone
- mysql2
- path
- request
</details>

<details><summary>API
</summary>

- Papago API
</details>

<details><summary>Source
</summary>

- [Html을 PDF 형식으로 변환](https://blog.naver.com/rnjsrldnd123/221526274628)
</details>
   
## 📡 지원되는 브라우저

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome |
| --------- | --------- |
| Latest | Latest

> 다른 브라우저에서도 지원될 수 있으나 되도록이면 위 브라우저를 사용해주세요.<br>
특히 인터넷 익스플로러는 지원이 종료된 브라우저로써 사용을 지양해주세요.<br>
(자바스크립트 사용을 허용하세요)

## 📥 다운로드
클라우드 데이터베이스를 연결 및 사용하기 때문에 다운로드하여 테스트하기 어렵습니다.<br>
이에도 불구하고 다운로드하여 테스트 하기를 원할 경우, 다음 명령어를 실행해 모듈을 다운로드하여 실행하세요.
> [Node.js](https://nodejs.org/ko/) 를 사용하므로, 설치가 필수입니다.<br>
> Mysql 데이터베이스를 사용합니다. 자세한 내용은 [이곳](https://github.com/DEV-PLUG/Shock/blob/main/.github/database.md)을 참고하세요.
```cmd
npm install
```
```cmd
node app.js
```
또한 루트 디렉토리에 .env 파일을 추가하여 Session Secret을 포함한 다수의 시스템 변수를 설정해주셔야 합니다.<br>
실행을 완료하였다면, [localhost:3000](http://localhost:3000) 에서 확인하세요.
