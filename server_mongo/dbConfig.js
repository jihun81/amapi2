// 오라클 DB 설정 파일

module.exports = {
    user			:process.env.NODE_ORACLEDB_USER || "gap",
    password		:process.env.NODE_ORACLEDB_PASSWORD || "gap1234",
    connectString	:process.env.NODE_ORACLEDB_CONNECTIONSTRING || "192.3.91.11:8649/tiberot",
    externalAuth	:process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};