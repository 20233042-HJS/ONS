# ONS 서버 (회원가입/로그인 + 옷장 데이터 백엔드)

Node.js + Express + MongoDB(Mongoose) + JWT로 만든 백엔드입니다.
회원가입/로그인/자동로그인 확인 + 옷장 아이템(사진 포함) 저장/조회/삭제/착용기록을 담당합니다.

## API

### 인증
- `POST /api/auth/signup` — body: `{ username, password, name, gender }` (gender: '남성' | '여성' | '선택안함')
- `POST /api/auth/login` — body: `{ username, password }`
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`

### 옷장 (전부 `Authorization: Bearer <token>` 필요)
- `GET /api/closet` — 내 옷장 목록
- `POST /api/closet` — body: `{ imageBase64, imageMimeType, name, category, price, purchaseDate }`
- `DELETE /api/closet/:id` — 삭제
- `PATCH /api/closet/:id/toggle-worn` — body: `{ date: 'YYYY-MM-DD' }` — 그 날짜 착용기록 추가/제거

- `GET /api/health` — 서버가 살아있는지 확인용

## 1. MongoDB Atlas 연결 문자열 준비

1. MongoDB Atlas 접속 → 클러스터에서 **Connect** 클릭
2. "Drivers" 선택 → 연결 문자열 복사 (`mongodb+srv://...` 형태)
3. `<password>` 부분을 실제 비밀번호로 교체
4. Atlas의 **Network Access**에서 `0.0.0.0/0` (모든 IP 허용) 추가

## 2. GitHub에 올리기

이 폴더(`온스-서버`) 안의 내용물(폴더 구조 그대로!)을 저장소에 올리세요. `models/`, `routes/`, `middleware/` 폴더 구조가 그대로 유지되어야 합니다.

## 3. Render에 배포

1. [render.com](https://render.com) → **New** → **Web Service**
2. GitHub 저장소 선택
3. Runtime `Node`, Build Command `npm install`, Start Command `npm start`
4. Environment Variables: `MONGODB_URI`, `JWT_SECRET`
5. **Create Web Service**

## 4. 앱에 서버 주소 연결

앱(`온스` 폴더)의 `lib/config.ts`에서 `API_BASE_URL`을 배포된 주소로 맞춰주세요.

## 사진 저장 방식
사진은 base64로 인코딩되어 MongoDB 문서 안에 그대로 저장됩니다 (별도 이미지 호스팅 서비스 없음).
- express의 JSON 본문 크기 제한을 15mb로 늘려뒀어요 (`server.js`의 `express.json({ limit: '15mb' })`).
- MongoDB 문서 하나의 최대 크기는 16MB라서, 사진 한 장이 그보다 크면 저장이 실패해요. 앱에서 이미 화질을 압축(quality 0.5)해서 보내도록 되어 있어 보통은 문제 없어요.
- Atlas 무료 요금제는 전체 용량 512MB 제한이 있어서, 사진이 아주 많아지면(수백 장) 용량이 부족해질 수 있어요. 그때는 Cloudinary 같은 이미지 전용 호스팅으로 옮기는 걸 고려하세요.

## 주의사항

- 무료 요금제는 오래 안 쓰면 잠들어서 첫 요청이 몇 초 느릴 수 있어요 (정상).
- 비밀번호에 특수문자가 있으면 연결 문자열에서 인증 오류가 날 수 있어요 — Atlas에서 "Autogenerate Secure Password" 추천.
- `.env`는 로컬 테스트용이며 `.gitignore`에 포함되어 깃허브에 올라가지 않습니다.
