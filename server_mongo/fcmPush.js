const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
const serviceAccount = require('../fcmpush-mg.json'); // Firebase Console에서 다운로드한 서비스 계정 키 파일의 경로
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    sendPushNotification : function (deviceToken, title, body) {
        console.log(deviceToken)
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: deviceToken
        };

        // FCM에 푸시 알림 요청 전송
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent push notification:', response);
            })
            .catch((error) => {
                console.log('Error sending push notification:', error);
            });
    }

}
