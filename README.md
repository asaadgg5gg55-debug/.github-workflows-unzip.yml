# شورتس

تطبيق فيديوهات قصيرة: Expo (React Native) + Supabase.

## التشغيل
1. أنشئ مشروعًا في https://supabase.com ثم شغّل `sql/01_schema.sql` في SQL Editor.
2. انسخ `.env.example` إلى `.env` وضع رابط المشروع والمفتاح.
3. `npm install` ثم `npx expo install --fix` لمواءمة الإصدارات.
4. `npx expo start` وافتحه عبر تطبيق Expo Go.

## الرفع إلى GitHub
```
git init && git add . && git commit -m "الخطوة 1"
git branch -M main
git remote add origin https://github.com/USERNAME/shorts-app.git
git push -u origin main
```

## بناء APK
`npm i -g eas-cli && eas build -p android --profile preview`
