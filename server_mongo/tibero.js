const fs = require('fs');
const path = require('path');

// Tibero JDBC 드라이버 JAR 파일 경로
const tiberoDriverPath = path.join(__dirname, 'jdbc', 'tibero6.jar');

// Tibero JDBC 드라이버 존재 여부 확인
if (!fs.existsSync(tiberoDriverPath)) {
    console.error('Tibero JDBC 드라이버 파일을 찾을 수 없습니다.');
    console.error('Tibero JDBC 드라이버를 Tibero 공식 웹사이트에서 다운로드하고 경로를 올바르게 설정해주세요.');
    return;
}

// Tibero JDBC 드라이버 로드
try {
    require('jdbc/lib/jinst');
    const { Jdbc } = require('jdbc');
    const TiberoDriver = require('tibero');

    // Tibero JDBC 드라이버 설정
    const tiberoDriver = new TiberoDriver();
    const jdbc = new Jdbc();
    jdbc.addOption('-Xrs');
    jdbc.addOption(`-Djava.class.path=${tiberoDriverPath}`);
    jdbc.initialize();

    // 이어서 연결 및 쿼리 실행 등의 작업을 진행할 수 있습니다.
    // ...
} catch (err) {
    console.error('Tibero JDBC 드라이버 로드 중 오류가 발생했습니다:', err);
}