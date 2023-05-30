const cron = require('node-cron');
var db = require('../server_mongo/connect');

var axios = require('../server_mongo/axios');


// 매 분마다 실행되는 스케줄링 작업
/*cron.schedule('* * * * *', () => {
    console.log('매 분마다 실행됩니다.');
});*/
//console.log('매 시간의 30분에 실행됩니다.');
// 매 시간의 30분에 실행되는 스케줄링 작업
/*cron.schedule('* * * * *', () => {
    console.log('오전 8시에 실행됩니다.');
    db.WorkPushSends('IN','0800' );
});*/



//공휴일 등록 api
cron.schedule('0 1 1 * *', () => {
    console.log('매월 1일 1시에 실행되는 작업');
    axios.setHoliday(); //매달 1일 공휴일 등록
});

//출근
cron.schedule('0 8 * * *', () => {
    console.log('오전 8시에 실행됩니다.');
    db.WorkPushSends('IN','0800' );
});

cron.schedule('30 8 * * *', () => {
    console.log('오전 8시 30에 실행됩니다.');
    db.WorkPushSends('IN','0830' );
});

cron.schedule('0 9 * * *', () => {
    console.log('오전 9시에 실행됩니다.');
    db.WorkPushSends('IN','0900' );
});

cron.schedule('30 9 * * *', () => {
    console.log('오전 9시에 30분 실행됩니다.');
    db.WorkPushSends('IN','0930' );
});

cron.schedule('0 10 * * *', () => {
    console.log('오전 10시에 실행됩니다.');
    db.WorkPushSends('IN','1000' );
});


//퇴근

cron.schedule('0 17 * * *', () => {
    console.log('오후 17시에 실행됩니다.');
    db.WorkPushSends('OUT','1700' );
});

cron.schedule('30 17 * * *', () => {
    console.log('오후 17시에 30분 실행됩니다.');
    db.WorkPushSends('OUT','1730' );
});

cron.schedule('0 18 * * *', () => {
    console.log('오후 18시 실행됩니다.');
    db.WorkPushSends('OUT','1800' );
});

cron.schedule('30 18 * * *', () => {
    console.log('오후 18시에 30분 실행됩니다.');
    db.WorkPushSends('OUT','1830' );
});

cron.schedule('0 19 * * *', () => {
    console.log('오후 19시 실행됩니다.');
    db.WorkPushSends('OUT','1900' );
});



// 매일 오전 9시에 실행되는 스케줄링 작업
/*
cron.schedule('0 9 * * *', () => {
    console.log('매일 오전 9시에 실행됩니다.');
});*/
