Travel Checklist App – JSON Data Management Guide

본 문서는 서버 없이 운영하는 Travel Checklist App에서
어떤 JSON을 관리해야 하는지, 그리고 왜 필요한지를 정리한 최종 가이드입니다.

⸻

🎯 목표
• 서버 없이 콘텐츠 업데이트 가능
• 앱 업데이트 없이 체크리스트/콘텐츠 수정
• 확장 가능한 데이터 구조 유지

⸻

✅ 관리해야 할 JSON 목록 (핵심 6종)

1️⃣ 체크리스트 마스터 JSON (가장 중요)

파일: checklist_items.json

[
{
"id": "passport",
"title": "Passport",
"categoryId": "documents",
"required": true,
"tags": ["international"]
},
{
"id": "power_adapter",
"title": "Power Adapter",
"categoryId": "electronics",
"tags": ["international", "electronics"]
}
]

역할
• 체크 항목 정의
• 콘텐츠 추가/수정/삭제
• 태그 기반 필터링

⸻

2️⃣ 카테고리 JSON (UI 구조용)

파일: categories.json

[
{ "id": "documents", "title": "Documents", "icon": "passport" },
{ "id": "electronics", "title": "Electronics", "icon": "plug" }
]

역할
• 체크리스트 그룹화
• UI 정렬 기준
• 아이콘 매핑

⸻

3️⃣ 여행 유형 프리셋 JSON

파일: travel_types.json

[
{
"id": "backpacking",
"title": "Backpacking",
"includeTags": ["light", "budget"]
},
{
"id": "business",
"title": "Business Trip",
"includeTags": ["formal", "electronics"]
}
]

역할
• 여행 유형 선택 시 자동 체크리스트 생성
• UX 개선

⸻

4️⃣ 국가 / 지역별 규칙 JSON

파일: countries/japan.json

{
"country": "Japan",
"requiredItems": ["passport"],
"recommendedItems": ["cash", "rail_pass"],
"notes": "Japan uses 100V power plugs"
}

역할
• 국가별 필수/추천 아이템
• 여행지 특화 콘텐츠

⸻

5️⃣ 아이템 설명 & 팁 JSON (선택)

파일: tips.json

{
"passport": "Passport must be valid for at least 6 months",
"power_adapter": "Japan uses Type A plug"
}

역할
• 아이템 클릭 시 설명 제공
• 콘텐츠 신뢰도 상승

⸻

6️⃣ 데이터 버전 관리 JSON (필수)

파일: version.json

{
"dataVersion": "1.0.3",
"schemaVersion": 1,
"minAppVersion": "1.0.0"
}

역할
• 데이터 구조 변경 대응
• 강제 업데이트 판단

⸻

❌ JSON으로 관리하지 않아도 되는 항목

항목 이유
체크 완료 여부 사용자 로컬 상태
여행 일정 개인 데이터
알림 설정 기기 종속
사용자 메모 개인화 데이터

⸻

📁 추천 디렉터리 구조

travel-data/
├─ version.json
├─ categories.json
├─ checklist_items.json
├─ travel_types.json
├─ tips.json
└─ countries/
├─ japan.json
├─ usa.json
└─ france.json

⸻

🧠 설계 원칙 (중요) 1. ID는 절대 변경하지 않는다 2. UI 문구는 JSON, 로직은 앱에서 처리 3. 사용자 상태 데이터는 JSON에 저장하지 않는다 4. 태그 기반 구조로 확장성 확보 5. 사람이 직접 수정 가능한 형태 유지

⸻

🎯 기대 효과
• 서버 없이 콘텐츠 운영 가능
• 앱 심사 중에도 데이터 수정 가능
• 장기적으로 여행 콘텐츠 플랫폼으로 확장 가능

⸻

🔜 확장 가능 항목
• JSON Schema 검증
• 앱 내 데이터 업데이트 로직
• 다국어 JSON 분리
• 운영자용 콘텐츠 가이드

⸻

본 문서는 Travel Checklist App의 JSON 데이터 관리 기준 문서입니다.
