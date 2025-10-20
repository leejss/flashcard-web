# Flashcard Web

플래시카드 학습 애플리케이션입니다. 폴더 단위로 카드를 관리하고, 학습 진도를 추적합니다.

## 기능

- **폴더 관리**: 폴더 생성, 수정, 삭제
- **카드 관리**: 폴더 내 카드 추가, 편집, 삭제
- **학습 추적**: 정답/오답 횟수, 마지막 복습 시간 기록
- **로컬 저장**: IndexedDB를 통한 로컬 데이터 저장
- **다크 모드**: 테마 전환 지원

## 기술 스택

- **프레임워크**: Next.js 15 (React 19)
- **스타일링**: Tailwind CSS 4
- **UI 컴포넌트**: shadcn/ui, Radix UI
- **상태 관리**: Context API + useReducer
- **저장소**: IndexedDB
- **언어**: TypeScript

## 프로젝트 구조

```
src/
├── app/              # Next.js 앱 라우터
├── components/       # React 컴포넌트
│   ├── dialogs/      # 모달 컴포넌트
│   ├── forms/        # 폼 컴포넌트
│   ├── layout/       # 레이아웃 컴포넌트
│   ├── ui/           # UI 기본 컴포넌트
│   └── views/        # 페이지 뷰 컴포넌트
├── contexts/         # React Context
├── storage/          # 데이터 저장소
│   └── idb/          # IndexedDB 구현
├── lib/              # 유틸리티 함수
└── types.ts          # TypeScript 타입 정의
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 개발

```bash
# 타입 체크
npm run check-types

# 린트
npm run lint
```