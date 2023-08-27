# Diff Details

Date : 2023-08-28 00:33:39

Directory /home/sagarnildass/python_notebooks/artelus/Codes/mental_health/backend

Total : 63 files,  -5808 codes, 84 comments, 45 blanks, all -5679 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/__init__.py](/backend/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/__init__.py](/backend/app/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/api/__init__.py](/backend/app/api/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/api/models/__init__.py](/backend/app/api/models/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/api/models/model.py](/backend/app/api/models/model.py) | Python | 175 | 19 | 47 | 241 |
| [backend/app/api/routes/__init__.py](/backend/app/api/routes/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/api/routes/auth.py](/backend/app/api/routes/auth.py) | Python | 90 | 10 | 22 | 122 |
| [backend/app/api/routes/upload_image.py](/backend/app/api/routes/upload_image.py) | Python | 56 | 10 | 19 | 85 |
| [backend/app/api/routes/views.py](/backend/app/api/routes/views.py) | Python | 96 | 1 | 16 | 113 |
| [backend/app/api/utils/__init__.py](/backend/app/api/utils/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/api/utils/user_utils.py](/backend/app/api/utils/user_utils.py) | Python | 23 | 1 | 3 | 27 |
| [backend/app/core/__init__.py](/backend/app/core/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/core/authentication.py](/backend/app/core/authentication.py) | Python | 20 | 1 | 3 | 24 |
| [backend/app/core/config.py](/backend/app/core/config.py) | Python | 3 | 1 | 1 | 5 |
| [backend/app/core/database.py](/backend/app/core/database.py) | Python | 24 | 2 | 8 | 34 |
| [backend/app/core/models.py](/backend/app/core/models.py) | Python | 163 | 18 | 37 | 218 |
| [backend/app/db/__init__.py](/backend/app/db/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/db/ddl.sql](/backend/app/db/ddl.sql) | SQL | 241 | 11 | 29 | 281 |
| [backend/app/services/__init__.py](/backend/app/services/__init__.py) | Python | 0 | 0 | 1 | 1 |
| [backend/app/services/chat.py](/backend/app/services/chat.py) | Python | 18 | 4 | 6 | 28 |
| [backend/app/services/chatbot_service.py](/backend/app/services/chatbot_service.py) | Python | 80 | 40 | 19 | 139 |
| [backend/app/services/emotion_analysis.py](/backend/app/services/emotion_analysis.py) | Python | 33 | 11 | 15 | 59 |
| [backend/app/services/intent_recognition.py](/backend/app/services/intent_recognition.py) | Python | 16 | 4 | 9 | 29 |
| [backend/app/services/sentiment_analysis.py](/backend/app/services/sentiment_analysis.py) | Python | 15 | 5 | 7 | 27 |
| [backend/app/services/suicide_predictor.py](/backend/app/services/suicide_predictor.py) | Python | 19 | 4 | 8 | 31 |
| [backend/app/services/user.py](/backend/app/services/user.py) | Python | 27 | 5 | 9 | 41 |
| [backend/main.py](/backend/main.py) | Python | 210 | 30 | 73 | 313 |
| [frontend/.eslintrc.cjs](/frontend/.eslintrc.cjs) | JavaScript | -20 | 0 | -1 | -21 |
| [frontend/README.md](/frontend/README.md) | Markdown | -5 | 0 | -4 | -9 |
| [frontend/index.html](/frontend/index.html) | HTML | -13 | 0 | -1 | -14 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | -4,889 | 0 | -1 | -4,890 |
| [frontend/package.json](/frontend/package.json) | JSON | -43 | 0 | -1 | -44 |
| [frontend/postcss.config.js](/frontend/postcss.config.js) | JavaScript | -6 | 0 | -1 | -7 |
| [frontend/public/vite.svg](/frontend/public/vite.svg) | XML | -1 | 0 | 0 | -1 |
| [frontend/src/App.css](/frontend/src/App.css) | CSS | -37 | 0 | -6 | -43 |
| [frontend/src/App.jsx](/frontend/src/App.jsx) | JavaScript | -8 | 0 | -3 | -11 |
| [frontend/src/assets/react.svg](/frontend/src/assets/react.svg) | XML | -1 | 0 | 0 | -1 |
| [frontend/src/components/Card.jsx](/frontend/src/components/Card.jsx) | JavaScript | -11 | 0 | -3 | -14 |
| [frontend/src/components/CardContent.jsx](/frontend/src/components/CardContent.jsx) | JavaScript | -12 | 0 | -2 | -14 |
| [frontend/src/components/EmotionTimeSeriesChart.jsx](/frontend/src/components/EmotionTimeSeriesChart.jsx) | JavaScript | -130 | -5 | -15 | -150 |
| [frontend/src/components/Login.module.css](/frontend/src/components/Login.module.css) | CSS | -261 | -1 | -32 | -294 |
| [frontend/src/components/LoginForm.jsx](/frontend/src/components/LoginForm.jsx) | JavaScript | -159 | -21 | -32 | -212 |
| [frontend/src/components/Navbar.jsx](/frontend/src/components/Navbar.jsx) | JavaScript | -34 | -19 | -10 | -63 |
| [frontend/src/components/RecentChatSummary.jsx](/frontend/src/components/RecentChatSummary.jsx) | JavaScript | -15 | -1 | -5 | -21 |
| [frontend/src/components/Sidebar.jsx](/frontend/src/components/Sidebar.jsx) | JavaScript | -88 | -3 | -8 | -99 |
| [frontend/src/components/Sidebar.module.css](/frontend/src/components/Sidebar.module.css) | CSS | -24 | -1 | -2 | -27 |
| [frontend/src/components/Signup.module.css](/frontend/src/components/Signup.module.css) | CSS | -358 | -12 | -45 | -415 |
| [frontend/src/components/SignupForm.jsx](/frontend/src/components/SignupForm.jsx) | JavaScript | -211 | -12 | -27 | -250 |
| [frontend/src/components/articleCarousel.jsx](/frontend/src/components/articleCarousel.jsx) | JavaScript | -35 | -1 | -4 | -40 |
| [frontend/src/index.css](/frontend/src/index.css) | CSS | -80 | -4 | -24 | -108 |
| [frontend/src/main.jsx](/frontend/src/main.jsx) | JavaScript | -16 | -5 | -2 | -23 |
| [frontend/src/pages/HomePage.jsx](/frontend/src/pages/HomePage.jsx) | JavaScript | -150 | -3 | -19 | -172 |
| [frontend/src/pages/Login.jsx](/frontend/src/pages/Login.jsx) | JavaScript | -101 | 0 | -4 | -105 |
| [frontend/src/pages/Signup.jsx](/frontend/src/pages/Signup.jsx) | JavaScript | -101 | 0 | -4 | -105 |
| [frontend/src/utils/articleSlice.js](/frontend/src/utils/articleSlice.js) | JavaScript | -31 | -1 | -6 | -38 |
| [frontend/src/utils/dailyMentalHealthSlice.js](/frontend/src/utils/dailyMentalHealthSlice.js) | JavaScript | -32 | -1 | -6 | -39 |
| [frontend/src/utils/emotionSlice.js](/frontend/src/utils/emotionSlice.js) | JavaScript | -32 | -1 | -6 | -39 |
| [frontend/src/utils/recentChatSlice.js](/frontend/src/utils/recentChatSlice.js) | JavaScript | -26 | 0 | -5 | -31 |
| [frontend/src/utils/store.js](/frontend/src/utils/store.js) | JavaScript | -17 | 0 | -1 | -18 |
| [frontend/src/utils/userSlice.js](/frontend/src/utils/userSlice.js) | JavaScript | -32 | 0 | -5 | -37 |
| [frontend/src/utils/weeklySummarySlice.js](/frontend/src/utils/weeklySummarySlice.js) | JavaScript | -32 | 0 | -5 | -37 |
| [frontend/tailwind.config.js](/frontend/tailwind.config.js) | JavaScript | -101 | -1 | -3 | -105 |
| [frontend/vite.config.js](/frontend/vite.config.js) | JavaScript | -5 | -1 | -2 | -8 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details