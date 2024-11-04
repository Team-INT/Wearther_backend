# 🌦️ **Wearther**

**Wearther** 프로젝트에 오신 것을 환영합니다!
Wearther는 현재 날씨 트렌드와 사용자의 취향에 맞춘 맞춤형 의류 추천을 제공하는 것을 목표로 하고 있습니다. Wearther와 함께 편안하고 스타일리시한 하루를 보내세요.

## 👥 **참여 팀원**

- 조경문
- 김서하
-

## 프로젝트 설정

```bash
$ pnpm install
```

## 프로젝트 컴파일 및 실행

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 테스트 실행

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

NestJS 애플리케이션을 프로덕션에 배포할 준비가 되면, 효율적으로 실행하기 위한 몇 가지 중요한 단계들이 있습니다. 자세한 내용은 배포 문서(https://docs.nestjs.com/deployment)를 참조하세요. 

NestJS 애플리케이션을 배포할 클라우드 기반 플랫폼을 찾고 있다면, AWS 상에서 NestJS 애플리케이션을 배포할 수 있는 공식 플랫폼인 Mau[Mau](https://mau.nestjs.com)를 확인해 보세요. Mau는 몇 가지 간단한 단계로 배포를 쉽고 빠르게 만들어줍니다:

```bash
$ pnpm install -g mau
$ mau deploy
```

Mau를 사용하면 몇 번의 클릭만으로 애플리케이션을 배포할 수 있어 인프라 관리보다는 기능 구축에 집중할 수 있습니다.

## 📌 **추가 링크**

- [백엔드 GitHub 저장소](https://github.com/backend-repo-url)
- [Storybook 문서](https://storybook-url/)
- [Notion 작업 공간](https://notion-url/)
- [프로덕션 링크](https://production-url/)

## 🚀 **기술 스택**

### 🌐 **프론트엔드**

- **Next.js (v14)**
- **TailwindCSS**
- **Shadcn UI**
- **Framer Motion (또는 GSAP)**
- **Zustand**
- **React Hook Form**
- **Zod**
- **TypeScript**

### 🖥️ **백엔드**

- **NestJS**
- **PostgreSQL**
- **TypeORM**

### 🤖 **머신 러닝 (TBD)**

- **Flask**
- **K-means**

### 📦 **배포**

- **프론트엔드**: Vercel
- **백엔드**: AWS EC2 (또는 Lambda)
- **CI/CD**: GitHub Actions
- **컨테이너**: Docker
- **오케스트레이션**: Docker Compose

### 📑 **기타**

- **API 문서화**: Scalar (또는 Swagger)

---

## 🤝 **협업 가이드 (Git & GitHub)**

### 🔀 **브랜치 관리 가이드라인**

효율적인 협업과 안정적인 배포를 위해 다음과 같은 브랜치 전략과 가이드를 추천합니다.

### 🌿 **브랜치 전략**

1. **메인 브랜치 (`main`)**
   - Vercel에 자동으로 배포되는 프로덕션 브랜치입니다.
   - 안정적이고 철저히 테스트된 코드만 이 브랜치에 있어야 합니다.
   - `dev` 브랜치에서 충분히 검증된 후에만 `main`으로 병합합니다.
2. **개발 브랜치 (`dev`)**
   - 모든 기능 브랜치가 병합되는 통합 브랜치입니다.
   - 팀원들이 작업을 공유하고 통합 테스트를 수행하는 곳입니다.
3. **기능 브랜치 (`feature/*`)**
   - 새로운 기능이나 버그 수정을 위한 브랜치입니다.
   - `dev` 브랜치에서 분기하여 작업합니다.
   - 브랜치 명명 규칙:
     - 새로운 기능: `feature/기능명` (예: `feature/login-page`)
     - 버그 수정: `bugfix/이슈번호-간단한-설명` (예: `bugfix/issue-23-layout-fix`)
     - 긴급 수정: `hotfix/간단한-설명` (예: `hotfix/header-crash-fix`)

### 📋 **작업 흐름**

1. **기능 브랜치 생성**

   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/브랜치명

   ```

2. **개발 및 커밋**
   - 작업을 수행하고 [커밋 컨벤션](https://www.notion.so/12ce188ffd5380e0bcc5c1df73c4d98d?pvs=21)을 따르세요.
3. **Merge Request 생성**

   - 작업이 완료되면 원격 저장소에 브랜치를 푸시합니다.

   ```bash
   git push origin feature/브랜치명

   ```

   - GitHub에서 `dev` 브랜치를 대상으로 Merge Request(MR)를 생성합니다.
   - MR 템플릿에 따라 상세한 설명을 기입합니다.

4. **코드 리뷰**
   - 최소 한 명 이상의 팀원이 MR을 리뷰합니다.
   - 리뷰어는 코드의 품질, 스타일, 기능 동작 등을 확인하고 의견을 제공합니다.
5. **병합 및 브랜치 삭제**
   - 승인이 완료되면 `dev` 브랜치에 병합합니다.
   - 병합 후 기능 브랜치를 삭제하여 저장소를 깔끔하게 유지합니다.
6. **`dev` 브랜치 안정화 및 `main`으로 병합**
   - 주요 기능 추가 후 또는 일정 주기마다 `dev` 브랜치를 테스트합니다.
   - 안정적이라고 판단되면 `main` 브랜치로 MR을 생성하고 동일한 리뷰 과정을 거칩니다.
   - 병합 후 Vercel을 통해 프로덕션에 배포됩니다.

### 💬 **Merge Request 가이드라인**

효율적인 코드 리뷰와 원활한 협업을 위해 다음 사항을 준수합니다.

### 📝 **MR 생성 시**

- **제목**: `[prefix]_header: 작업 내용` 형식으로 작성합니다.
  - 예: `[feat]_Task12: 사용자 프로필 페이지 추가`
- **설명**
  - 작업 내용에 대한 상세 설명을 작성합니다.
  - 가능하다면 스크린샷이나 동영상 등의 시각 자료를 첨부합니다.
  - 관련된 이슈나 참고 자료 링크를 포함합니다.
- **레이블 및 담당자 지정**
  - 적절한 레이블을 선택합니다 (예: `feature`, `bugfix` 등).
  - 최소 한 명의 팀원을 리뷰어로 지정합니다.

### 👀 **코드 리뷰 시**

- **코드 검증**
  - 기능이 기대대로 작동하는지 확인하고 코드 스타일이 일관적인지 검토합니다.
  - 변수 명명 규칙과 코드 가독성을 확인합니다.
- **피드백 제공**
  - 개선 사항이나 수정 요청은 구체적으로 작성합니다.
  - 긍정적인 점을 강조하여 팀원의 사기를 높입니다.

### ✅ **MR 승인 및 병합**

- **승인 조건**
  - 모든 리뷰어의 승인을 받은 경우
  - CI/CD 파이프라인이 통과된 경우 (테스트 및 빌드 성공)
- **병합 방식**
  - `Squash and Merge`를 사용하여 커밋 히스토리를 깔끔하게 유지합니다.
- **브랜치 삭제**

  - 병합 후 로컬 및 원격 저장소에서 기능 브랜치를 삭제합니다.

  ```bash
  git branch -d feature/브랜치명
  git push origin --delete feature/브랜치명

  ```

### ⚔️ **충돌 해결**

- **충돌 발생 시**
  1. 로컬 `dev` 브랜치를 최신 상태로 업데이트합니다.
  ```bash
  git checkout dev
  git pull origin dev
  ```
  1. 기능 브랜치로 이동하여 `dev`를 병합합니다.
  ```bash
  git checkout feature/브랜치명
  git merge dev
  ```
  1. 충돌을 해결하고 커밋한 후 다시 푸시합니다.
  ```bash
  git push origin feature/브랜치명
  ```

## 📝 **커밋 컨벤션**

### 🏷️ **커밋 프리픽스**

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 비기능적 스타일 변경 (포맷, 공백 등)
- **refactor**: 기능 변경 없이 코드 리팩토링
- **test**: 테스트 코드 추가 또는 수정
- **chore**: 설정 변경 또는 유지 보수 작업

### 🖊️ **커밋 헤더**

- **Task**: Notion에 등록된 티켓 번호 사용
- **Self**: 계획되지 않은 작업 또는 간단한 수정 시 사용

### 📌 **커밋 예시**

- **[feat]\_Task04: 트렌드 분석용 일일 보기 Bar Chart 추가**
- **[fix]\_Task08: iOS에서 레이아웃 여백 문제 수정**
- **[refactor]\_Self: useProgress 커스텀 훅 로직 간소화**
- **[docs]\_Task09: API 문서 업데이트 및 예제 추가**
- **[style]\_Self: CSS 코드 정렬 및 주석 수정**
- **[test]\_Task10: 로그인 기능 테스트 케이스 추가**
- **[chore]\_Task11: 패키지 의존성 버전 업데이트**
- **[feat]\_Self: 다크 모드 지원을 위한 테마 기능 구현**

---

> 이 README는 팀원들이 원활하게 협업하고
> 프로젝트 관리를 효율적으로 할 수 있도록 돕기 위해 작성되었습니다. 🎉

여러분의 아이디어와 피드백을 언제든지 환영합니다! 🙌
함께 Wearther를 멋지게 만들어봐요!


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
