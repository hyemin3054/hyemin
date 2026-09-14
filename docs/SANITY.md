# Sanity 연결 안내

이 프로젝트는 Sanity Project ID `piw08hz1`와 `production` dataset을 사용합니다.

## 로컬 환경 변수

`.env.local`은 Git에 저장하지 않습니다. 다음 두 값이 필요합니다.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=piw08hz1
NEXT_PUBLIC_SANITY_DATASET=production
```

읽기 토큰은 현재 사용하지 않습니다. 공개 Published 콘텐츠를 서버에서 읽는 구성이며, 비공개 dataset으로 전환할 때만 `SANITY_API_READ_TOKEN`을 서버 환경 변수로 추가합니다.

## Studio

개발 서버를 실행한 뒤 `http://localhost:3000/studio`를 엽니다. Sanity 로그인 화면이 나오면 **Log in**을 누르고 프로젝트를 만든 계정으로 로그인합니다.

## CORS

현재 허용된 주소인 `http://localhost:3000`으로 Studio를 사용하세요. 다른 주소를 사용할 때는 Sanity Manage의 프로젝트 설정에서 API → CORS origins에 정확한 주소를 추가하고 **Allow credentials**를 켜야 합니다.

- `http://localhost:3000`
- `http://127.0.0.1:3000` (이 주소로 사용할 경우 별도 등록 필요)

## Published 규칙

웹사이트용 조회 클라이언트는 `perspective: "published"`를 사용하며, 쿼리에서도 `drafts.**`와 `versions.**` 문서를 제외합니다. Studio의 Draft 문서는 Publish하기 전까지 공개 목록·상세·Footer에 표시되지 않습니다.

## 확인 주소

- Studio: `/studio`
- 연결 상태: `/api/sanity/health`

`/api/sanity/health`는 토큰을 노출하지 않고 Published 문서 개수만 반환합니다.

## 테스트 Artist 등록

1. 프로젝트 폴더에서 `npm run dev`를 실행하고 http://localhost:3000/studio 를 엽니다.
2. 프로젝트를 만든 계정으로 로그인합니다.
3. **작가**를 누르고 목록 상단의 **Create new document** 아이콘을 누릅니다.
4. 작가명에 `Test Artist`, 주소(slug)에 **Generate**를 눌러 `test-artist`를 만듭니다. 한글 작가명은 주소를 영문 소문자와 하이픈으로 직접 입력하세요.
5. 짧은 소개를 입력합니다. 사진, 작품, 이력은 나중에 추가해도 됩니다.
6. 자동 저장된 Draft 상태에서 http://localhost:3000/artists 를 확인하면 아직 표시되지 않습니다.
7. Studio의 **Publish**를 누르고 사이트를 새로고침하면 작가 목록과 `/artists/test-artist`에서 확인할 수 있습니다.
8. 게시 후 수정한 내용도 다시 Publish해야 사이트에 반영됩니다. 공개를 취소하려면 문서 메뉴에서 **Unpublish**를 선택합니다.

## 이미지와 작품 관리

- 작가의 **작품 목록**에서 Add item을 눌러 이미지·작품명·연도·설명을 입력합니다.
- 각 갤러리 배열에서 Upload로 사진을 추가하고, 항목 메뉴에서 교체하거나 삭제합니다. 드래그로 표시 순서를 바꿀 수 있습니다.
- 이미지와 소개는 선택 항목입니다. 빈 이미지에는 깨진 이미지 태그를 만들지 않으며, 빈 목록은 안내 문구로 표시합니다.
- 작가의 주요 전시 이력·학력·수상은 작가 전체 정보입니다. 개별 작품에는 이미지·제목·연도·설명만 들어갑니다.
- 전시·판매 작품의 작가는 ARTIST에서 등록한 문서를 선택합니다. 참조된 작가는 먼저 Publish하세요.
- 전시 상태(current/upcoming/archive)는 직접 관리합니다. featured는 추천 여부이며 공개 여부와 별개입니다.
- 판매 가격은 원(KRW) 단위 숫자입니다. 빈 가격은 가격 문의로 표시합니다. 판매 상태는 available/reserved/sold 중 선택하며 온라인 결제는 없습니다.
- 사이트 전체 설정는 사이트 전체에서 공유하는 한 문서입니다. 연락처·Footer·소개를 수정하고 Publish하세요.

## 연결 확인 및 공동 운영

- http://localhost:3000/api/sanity/health 에서 `status: "ready"`, `perspective: "published"`이면 서버 조회가 성공한 것입니다. 처음에는 개수가 모두 0이어도 정상입니다.
- Draft 생성 → 목록 미표시 → Publish → 목록 표시 순서로 실제 공개 동작을 확인하세요.
- 웹사이트는 서버에서 Published 콘텐츠만 읽습니다. 읽기 오류는 빈 콘텐츠와 구분해 안내하며, 토큰은 브라우저에 전달하지 않습니다.
- 클라이언트도 자신의 Sanity 계정으로 로그인합니다. Sanity Manage의 Members에서 프로젝트 편집 권한으로 초대해야 합니다. 계정 비밀번호를 공유하지 않습니다.
- 현재 Studio는 로컬 개발 서버입니다. 다른 컴퓨터의 클라이언트가 사용하려면 다음 배포 단계에서 Studio/사이트 주소를 배포하고 해당 주소의 CORS를 설정해야 합니다.
- Test Artist (`test-artist`)를 테스트 콘텐츠로 사용합니다. 소개는 `CMS connection test artist.`이며 Published 상태입니다. 멤버 초대는 별도입니다.

## 관리자 입력 순서

작가·전시·소식·판매 작품은 기본 정보 → 이미지 → 상세 내용 → 정렬 및 표시 설정 순서로 입력합니다. 제목(작가명)과 페이지 주소는 필수이며 전시 상태·판매 상태는 기본값이 있습니다. 이미지와 긴 본문은 나중에 추가할 수 있습니다. 마지막에 Publish를 눌러 공개합니다.

사이트 전체 설정 메뉴는 항상 문서 ID `siteSettings` 하나를 엽니다. 새 문서 템플릿에서 제외하고 복제·삭제 메뉴를 숨겼습니다. 이는 Studio 편집 UX의 제한이며 외부 API 권한 제한은 아닙니다. 기존 필드 이름과 조회 구조는 유지합니다.

## CMS 표시 연결 점검 (2026-09-15)

| 콘텐츠 | 목록 | 상세 / 공통 영역 |
| --- | --- | --- |
| 작가 | 이름, 페이지 주소 링크, 목록 대표 이미지(없으면 프로필), 짧은 소개, 주요 콘텐츠 | 프로필·대표 이미지, 상세 소개, 작품 이미지/제목/연도/설명, 전시 이력·학력·수상 |
| 전시 | 제목, 표지, 작가 링크, 기간, 상태, 요약, 주요 콘텐츠 | 표지·상세 이미지, 전체 설명, 갤러리 및 목록의 기본 정보 |
| 소식 | 제목, 썸네일, 날짜, 요약, 주요 콘텐츠 | 썸네일·상세 이미지, 본문, 갤러리, 날짜·요약 |
| 판매 작품 | 제목, 이미지, 작가 링크, 연도, 재료, 크기, 가격, 판매 상태, 주요 콘텐츠 | 같은 기본 정보와 작품 설명·갤러리·문의 링크 |
| 사이트 설정 | 해당 없음 | Header 이름·로고, Footer 연락처·운영 시간·Instagram·저작권, About 소개·사진·지도 링크·좌표·오시는 길 |

`displayOrder`는 목록 순서에 적용됩니다(작은 값 우선). `featured`는 주요 콘텐츠 문구로 표시됩니다. 최종 홈페이지 추천 영역과 이미지 hover 등은 Figma 디자인 단계에서 결정합니다. 슬러그는 주소에 사용하며 본문에 별도 텍스트로 출력하지 않습니다.

기존 GROQ는 요청 필드를 이미 조회하고 있었습니다. 누락 원인은 주로 공통 페이지 렌더러였으며 `CmsFields.tsx`, `CmsContent.tsx`, Header, About에서 수정했습니다. 저장된 CMS 문서는 수정하지 않았습니다. 빈 이력·작품 항목은 제외하며 이미지 URL을 만들 수 없으면 이미지 태그를 출력하지 않습니다.

검증: `npm run build`, `npm run typecheck`, `node --import tsx tests/cms-content.tsx`. 로컬 테스트는 설치된 도구(tsx, groq-js)를 이용하며 CMS에 테스트 문서를 게시하지 않습니다. Query의 모든 테스트 필드, 작가 Reference, 네 콘텐츠 렌더러, 빈 항목, Draft/Release 제외를 검사합니다. 사이트 설정은 Query 투영을 검사했습니다.

실제 Published 작가 `/artists/kimhyemin`의 이력 등을 포함한 9개 값, 전시 `/exhibitions/kimhyemin-exhibition`의 기간·요약 3개 값을 HTTP 응답과 대조했습니다. 소식·판매 작품·사이트 설정은 당시 Published 문서가 없어 실제 운영 데이터 입력 후 사진, 링크, 본문, 연락처를 브라우저에서 추가 확인해야 합니다.
