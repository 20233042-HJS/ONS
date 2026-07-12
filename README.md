# ONS 서버 (회원가입/로그인용 백엔드)

Node.js + Express + MongoDB(Mongoose) + JWT로 만든 최소한의 인증 서버입니다.
회원가입, 로그인, 자동 로그인 확인(토큰 검증) 3개 기능만 있습니다.

## API

- `POST /api/auth/signup` — body: `{ username, password, name, gender }` (gender는 '남성' | '여성' | '선택안함')
- `POST /api/auth/login` — body: `{ username, password }`
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`
- `GET /api/health` — 서버가 살아있는지 확인용

응답은 `{ token, user }` 형태 (signup/login), `user`는 `{ id, username, name, gender }`.

## 1. MongoDB Atlas 연결 문자열 준비

1. MongoDB Atlas 접속 → 만들어둔 클러스터에서 **Connect** 클릭
2. "Drivers" 선택 → 연결 문자열 복사 (`mongodb+srv://...` 형태)
3. `<password>` 부분을 실제 비밀번호로 교체
4. Atlas의 **Network Access**에서 `0.0.0.0/0` (모든 IP 허용)을 추가해둬야 Render에서 접속 가능

## 2. GitHub에 올리기

이 폴더(`온스-서버`) 안의 내용물(폴더 구조 그대로!)을 저장소에 올리세요. `models/`, `routes/`, `middleware/` 폴더 구조가 그대로 유지되어야 합니다.

## 3. Render에 배포

1. [render.com](https://render.com) 로그인 → **New** → **Web Service**
2. GitHub 저장소 선택
3. 설정값: Runtime `Node`, Build Command `npm install`, Start Command `npm start`
4. Environment Variables: `MONGODB_URI`, `JWT_SECRET` 추가
5. **Create Web Service** → 배포 끝나면 주소 생김

## 4. 앱에 서버 주소 연결

앱(`온스` 폴더)의 `lib/config.ts`에서 `API_BASE_URL`을 배포된 주소로 맞춰주세요.

## 주의사항

- 무료 요금제는 오래 안 쓰면 잠들어서 첫 요청이 몇 초 느릴 수 있어요 (정상).
- 비밀번호에 특수문자가 있으면 연결 문자열에서 인증 오류가 날 수 있어요 — Atlas에서 "Autogenerate Secure Password"로 만드는 걸 추천.
- `.env`는 로컬 테스트용이며 `.gitignore`에 포함되어 깃허브에 올라가지 않습니다.
