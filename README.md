# 지원금 안내 사이트

사용자가 소득을 입력하고 단계별로 진행하여 예상 지원금을 계산하는 웹 애플리케이션입니다.

## 주요 기능

### 사용자 페이지
- **단계별 입력 시스템**: 4단계로 구성된 직관적인 UI
  1. 소득 입력
  2. 타입 선택
  3. 옵션 선택 (추가 지원 비율)
  4. 결과 확인
- **실시간 계산**: 소득 구간과 옵션에 따른 지원금 자동 계산
- **상세 정보 제공**:
  - 지급 방식
  - 지원 목표
  - 제출 서류
  - 산정 방식
  - 재정 보증

### 관리자 페이지
- **설정 편집 UI**: 모든 데이터를 웹 UI로 관리
  - 소득 구간 및 지원 비율
  - 타입 관리
  - 옵션 관리
  - 지급 방식
  - 목표
  - 제출 서류
  - 기본 금액 및 안내문
- **JSON 관리**:
  - 미리보기 업데이트
  - JSON 복사
  - JSON 다운로드

## 기술 스택

- **프레임워크**: React 18 + Vite
- **라우팅**: React Router v6
- **스타일링**: CSS3 (CSS Variables)
- **배포**: GitHub Pages

## 로컬 개발

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
개발 서버가 http://localhost:5173 에서 실행됩니다.

### 빌드
```bash
npm run build
```
빌드된 파일은 `dist` 폴더에 생성됩니다.

### 미리보기
```bash
npm run preview
```

## 배포 방법

### GitHub Pages 자동 배포

1. **GitHub 저장소 생성**
   - GitHub에서 새 저장소를 생성합니다
   - 저장소를 로컬과 연결합니다

2. **저장소에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repository.git
   git push -u origin main
   ```

3. **GitHub Pages 설정**
   - 저장소 Settings > Pages로 이동
   - Source를 "GitHub Actions"로 설정

4. **자동 배포**
   - `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다
   - Actions 탭에서 배포 상태를 확인할 수 있습니다

배포 완료 후 `https://username.github.io/repository/` 에서 사이트에 접속할 수 있습니다.

## 설정 파일 관리

### config.json 구조

`public/config.json` 파일에서 모든 설정을 관리합니다:

```json
{
  "incomeRanges": [...],      // 소득 구간 설정
  "types": [...],              // 타입 설정
  "options": [...],            // 옵션 설정
  "baseAmount": 1000000,       // 기본 지원 금액
  "paymentMethods": [...],     // 지급 방식
  "goals": [...],              // 지원 목표
  "documents": [...],          // 제출 서류
  "calculationMethod": "...",  // 산정 방식 설명
  "financialGuarantee": "..."  // 재정 보증 안내
}
```

### 설정 수정 방법

#### 방법 1: 관리자 페이지 사용 (권장)
1. `/admin` 경로로 이동
2. UI에서 설정 수정
3. "JSON 다운로드" 버튼 클릭
4. 다운로드한 파일을 `public/config.json`에 저장
5. GitHub에 커밋 및 푸시

#### 방법 2: 직접 수정
1. `public/config.json` 파일을 직접 수정
2. JSON 형식이 올바른지 확인
3. GitHub에 커밋 및 푸시

## 프로젝트 구조

```
지원금안내사이트/
├── public/
│   └── config.json          # 설정 파일
├── src/
│   ├── pages/
│   │   ├── UserPage.jsx     # 사용자 페이지
│   │   ├── UserPage.css
│   │   ├── AdminPage.jsx    # 관리자 페이지
│   │   └── AdminPage.css
│   ├── utils/
│   │   └── calculator.js    # 지원금 계산 로직
│   ├── App.jsx              # 메인 앱
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions 배포 설정
├── vite.config.js
└── package.json
```

## 계산 로직

지원금은 다음과 같이 계산됩니다:

```
최종 지원금 = 기본 금액 × (소득 구간 비율 + 추가 옵션 비율)
```

- **소득 구간 비율**: 입력한 소득에 따라 결정
- **추가 옵션 비율**: 선택한 옵션의 비율 합계
- **최대 비율**: 100% (초과 시 100%로 제한)

### 예시
- 기본 금액: 1,000,000원
- 소득: 1,500,000원 → 소득 구간 비율 80%
- 선택 옵션: 다자녀 가구 +10%
- **최종 지원금**: 1,000,000원 × 90% = 900,000원

## 라이선스

MIT License

## 문의

프로젝트 관련 문의사항은 이슈를 등록해주세요.
