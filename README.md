# The Grotto Art Window

Next.js App Router + TypeScript + plain CSS 기반의 개발 환경입니다.
현재 화면은 라우팅 확인용이며 Figma 세부 디자인, CMS, 구매·결제 기능은 구현하지 않았습니다.

## 실행 방법 (Windows)

1. 프로젝트 폴더를 파일 탐색기로 엽니다.
2. 상단 주소 표시줄에 `cmd`를 입력하고 Enter를 누릅니다.
3. 처음 설치하거나 다른 컴퓨터에서 열었다면 `npm ci`를 실행합니다.
4. `npm run dev`를 실행합니다.
5. 브라우저에서 http://localhost:3000 을 엽니다. 터미널은 열어둡니다.
6. 종료하려면 터미널에서 Ctrl+C를 누릅니다.

`npm`을 찾을 수 없다면 터미널을 다시 여세요. 이 컴퓨터의 설치 경로로 실행하려면
`"C:\Program Files\nodejs\npm.cmd" run dev`를 입력할 수 있습니다.

검사: `npm run typecheck` / 배포용 빌드: `npm run build`
빌드 후 실행: `npm start`

## 구조

- `src/app`: 공통 HTML 레이아웃, 홈, about, 4개 목록 및 `[slug]` 상세 경로, 404
- `src/components`: Header, Navigation, Footer, MainLayout, Divider, PagePlaceholder
- `src/config/site.ts`: 공통 메뉴와 추후 입력할 Footer 정보
- `src/styles/tokens.css`: 공통 색상·간격 및 임시 반응형 기준
- `src/styles/base.css`: 기본 요소 스타일
- `src/styles/layout.css`: 반응형 컨테이너와 Grid/Stack 구조
- `src/styles/components.css`: 공통 컴포넌트의 최소 스타일
- `src/styles/globals.css`: CSS 진입점

## 경로

| 경로 | 용도 |
| --- | --- |
| `/` | 홈 |
| `/exhibitions` | 전시 목록 |
| `/exhibitions/[slug]` | 전시 상세 |
| `/artists` | 작가 목록 |
| `/artists/[slug]` | 작가 상세 |
| `/news` | 뉴스 목록 |
| `/news/[slug]` | 뉴스 상세 |
| `/sales` | 작품 및 가격 목록 |
| `/sales/[slug]` | 작품 상세 |
| `/about` | 갤러리 소개 |

`[slug]`는 상세 콘텐츠의 주소 이름입니다. 지금은 `/news/preview` 등으로 확인할 수 있습니다.
데이터 연결 전에는 모든 slug가 준비 화면을 표시합니다. 실제 콘텐츠 연결 시 존재하지 않는 slug는 404 처리해야 합니다.

## Spacing 원칙

1440px Figma 기준으로 좌우 56px, 콘텐츠 최대 폭 1328px입니다.
56/63/66px처럼 비슷한 외곽 여백은 56px로, 22/24/27px 일반 그리드 간격은 24px로 통합합니다.

| 토큰 | 데스크톱 |
| --- | --- |
| `--page-padding` | 56px |
| `--section-gap` | 160px |
| `--content-gap` | 32px |
| `--grid-gap` | 24px |
| `--small-gap` | 8px |
| `--divider-spacing` | 32px |
| `--grid-gap-compact` | 12px (SALES) |
| `--grid-gap-tight` | 4px (ABOUT 공간 사진) |
| `--artwork-row-gap` | 80px |
| `--section-gap-large` | 400px |
| `--section-gap-extra-large` | 640px |

큰 간격은 전시·소식 화면의 넓은 여백을 위한 후보이며 기본 간격으로 모든 화면을 덮어쓰지 않습니다.
1024px 이하에서는 좌우 32px, 640px 이하에서는 20px로 줄입니다.
모바일 Figma가 없으므로 이 분기점과 작은 화면 간격은 초기 기준이며 실제 페이지 구현 때 검증합니다.

작품 크기·비율 차이, 비대칭 컬럼, HOME 전체 폭 이미지 등의 의도는 유지합니다.
각 페이지는 필요한 열 비율만 정의하고 간격은 공통 토큰을 사용합니다.
NEWS 텍스트는 실제 카드 안의 텍스트 열에 제한하고 `.card-copy`로 긴 문자열의 넘침을 방지합니다.
Footer는 공통 컴포넌트로 간격을 유지하며 내용 높이는 고정하지 않습니다.

## 다음 디자인 단계에서 유지할 사항

- Figma의 중복 이미지 레이어를 중복 콘텐츠로 만들지 않습니다. 전시 상세 작품은 시각적으로 6개입니다.
- Figma 이미지·폰트는 아직 연결하지 않았습니다. 현재 글꼴과 공통 화면은 임시입니다.
- 실제 Footer 연락처·운영시간은 확인 후 `src/config/site.ts`에 입력합니다.
- SALES는 가격 안내와 Contact를 통한 구매 문의용입니다. 결제·장바구니는 만들지 않습니다.
- 준비 화면에는 검색엔진 제외 설정이 있습니다. 공개할 때 `src/app/layout.tsx`의 robots를 검토합니다.
- Git은 로컬 main 브랜치로 초기화했습니다. 원격 저장소 및 배포는 연결하지 않았습니다.
- `.env` 파일과 설치·빌드 산출물은 Git에서 제외합니다.
