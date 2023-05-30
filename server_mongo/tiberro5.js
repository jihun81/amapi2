const { TiberoConnection, Lob } = require('server_mongo/tibero');

// Tiberro DB 연결 정보
const connectionConfig = {
    host: 'your_host',           // Tiberro DB 호스트
    port: 8629,                  // Tiberro DB 포트
    user: 'your_user',           // Tiberro DB 사용자 이름
    password: 'your_password',   // Tiberro DB 암호
    database: 'your_database'    // Tiberro DB 데이터베이스 이름
};

// Tiberro DB 연결 생성
const connection = new TiberoConnection(connectionConfig);

// 연결 이벤트 핸들러
connection.connect((err) => {
    if (err) {
        console.error('연결 실패:', err.message);
    } else {
        console.log('Tiberro DB에 성공적으로 연결되었습니다.');

        // 쿼리 실행 예제
        executeQuery();
    }
});

// Tiberro DB에 쿼리 실행하는 함수
function executeQuery() {
    const sql = 'SELECT * FROM YourTable';  // 실행할 쿼리

    connection.execute(sql, (err, result) => {
        if (err) {
            console.error('쿼리 실행 오류:', err.message);
        } else {
            console.log('쿼리가 성공적으로 실행되었습니다.');
            console.log('결과:', result);

            // 결과 처리
            // ...

            // 연결 종료
            connection.disconnect();
        }
    });
}

// Tiberro DB에 연결
connection.connect();