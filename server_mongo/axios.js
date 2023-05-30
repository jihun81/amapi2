const axios = require('axios');
var db = require('../server_mongo/connect');

const key = 'Dlgq/wMJ5OKILQbXc+hyQI9jWFlDE/vkahoEX/S3CF56aOhTcYTEp0WtMJ7a6+IDEeXcH5EA9IP/1KTYx9eqmw=='; //한국천문연구원_특일 정보 공휴일 관련 api key

//시간
const moment = require('moment');
const today_year = moment().format('YYYY');
const today_mon = moment().format('MM');


module.exports = {
    setHoliday : function () {
        // REST API 호출
        axios.get('http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo',{
            params: {
                'solYear' : today_year,
                'solMonth' : today_mon,
                'ServiceKey' : key,
                '_type' : 'json'
            }

        })
            .then(response => {
                // API 호출 성공 시 응답 데이터 처리
                //console.log(response.data);
                console.log(response.data.response.body.items.item);
                db.holiDaySave(response.data.response.body.items.item);
            })
            .catch(error => {
                // API 호출 실패 시 에러 처리
                console.error(error);
            });
    }

    ,

}