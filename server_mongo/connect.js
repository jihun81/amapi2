// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');
// 2. testDB 세팅
mongoose.connect('mongodb://localhost:27017/testDB');
// 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});

//시간
const moment = require('moment');

//위경도 계산
const distance =  function (lat1, lon1, lat2, lon2, unit = "km") {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "km") {
        dist = dist * 1.609344;
    }
    console.log(dist);
    return dist;
}


// 10. Student 레퍼런스 전체 데이터 가져오기
var student = mongoose.Schema({
    name : 'string',
    address : 'string',
    age : 'number'
});

//유저
var user = mongoose.Schema({

    empRid : "string",
    empName : 'string',
    empNo : 'string',
    pw : 'string',
    telno : 'string',
    workInTime : 'string',
    workOutTime : 'string',
    createDate : {type: Date, default: Date.now},
    createBy : 'string'

});

//출퇴근
var swt = mongoose.Schema({
    empNo : 'string',
    wrkInOutDate :  {type: String, default: Date.now},
    wrkInOutTime :  {type: String, default: Date.now},
    wrkInOutStatus : 'string',
    latitudeNum : 'string',
    longitudeNum : 'string',
    telno : 'string',
    createBy : 'string',
    usrId : 'string',
    createDate : {type: Date, default: Date.now},

});

var lwt = mongoose.Schema({
    name : 'string',
    address : 'string',
    age : 'number'
});

const Student = mongoose.model('test2', student);


module.exports = {
    save : function (code1, req) {
        console.log("save");
// 8. Student 객체를 new 로 생성해서 값을 입력

        console.log(req.body);

        var newStudent = null;

        if(code1=='user'){
            const User = mongoose.model('users', user);
            newStudent = new User({empRid:req.body.name,empName:req.body.name,empNo:req.body.empNo, pw:req.body.password, telno:req.body.telNo,workInTime:req.body.workInTime,workOutTime:req.body.workOutTime, createBy:req.body.name});
        }else{
            newStudent = new Student({name:'Hong Gil Dong922222', address:'서울시 강남구 논현동9999', age:'11'});
        }


// 9. 데이터 저장
        newStudent.save(function(error, data){
            if(error){
                console.log(error);
            }else{
                console.log('Saved!')
            }
        });
    },

    list : function (callback) {
        console.log("list");

        Student.find(function(error, students){
            console.log('--- Read all ---');
            if(error){
                console.log(error);
            }else{
                console.log(students);
            }
            callback(students);
        })
    },

    loginChk : function (name, pw, telno,callback) {
        console.log("loginChk");

        var data1 = new Object(); // 디테일 데이터
        console.log(telno);
        const User = mongoose.model('users', user);

        User.findOne({empRid:name, pw:pw, telno:telno},{_id:0,empRid:1,empName:1,empNo:1,workInTime:1,workOutTime:1},function(error, users){
            console.log('--- Read all ---');

            var jsonStr = null;
            var jsonObj = {};

            if(error){
                console.log('--- error ---');
                console.log(error);
                jsonObj.success= false;
                data1.success= false;
            }else{
                if(users == null){
                    jsonObj = {success:false}
                }else{
                    jsonStr = JSON.stringify(users); //객체를 JSON 문자열로 변환
                    jsonObj = JSON.parse(jsonStr); //문자를 다시 json 형태로 객체로 변환
                    console.log(users);
                    jsonObj.success= true;

                    data1.success= true;
                    data1.userInfo= users;
                }

        //        console.log(JSON.stringify(temp3));
            }
            callback(data1);
        });
/*        console.log("Swt");
        const Swt = mongoose.model('workonoffs', swt);
        const today_date = moment().format('YYYYMMDD');

        Swt.find({usrId:name, wrkInOutDate:today_date},function(error, worktime){
            console.log('--- Read all ---');
            var jsonStr = null;
            var jsonObj = {};

            if(error){
                console.log('--- error ---');
                console.log(error);
                jsonObj.success= false;

            }else{
                if(worktime == null){
                    jsonObj = {success:false}
                }else{
                    jsonStr = JSON.stringify(worktime); //객체를 JSON 문자열로 변환
                    jsonObj = JSON.parse(jsonStr); //문자를 다시 json 형태로 객체로 변환
                    console.log(typeof worktime);
                    jsonObj.success= true;

                    data1.success= true;
                    data1.workInOutList= worktime;
                }

                //   console.log(JSON.stringify(temp3));
            }
            callback(data1);
        });*/

    },

    update : function () {
        console.log("update");

// 12. 특정아이디 수정하기
        Student.findById({_id:'64506a0755157909ca384fde'}, function(error,student){
            console.log('--- Update(PUT) ---');
            if(error){
                console.log(error);
            }else{
                student.name = '수정1';
                student.save(function(error,modified_student){
                    if(error){
                        console.log(error);
                    }else{
                        console.log(modified_student);
                    }
                });
            }
        });
    },

    saveWorkTime : function (req ,callback) {
        console.log("saveWorkTime");

        const today_date = moment().format('YYYYMMDD')
        const today_time = moment().format('HHmmss')
        var data1 = new Object(); // 디테일 데이터

        var Trans = false;

        var req_data = req.body;
        console.log("!!!!!!!!!!!!!");
        console.log(req.body);
        console.log("!!!!!!!!!!!!!");
      //  req_data.empNo = '1001234';
        req_data.wrkInOutDate = today_date;
        req_data.wrkInOutTime = today_time;
        //req_data.tel = req_data.usrId;
        req_data.createBy = req_data.usrId;

        var empNo = req_data.empNo;
        var usrId = req_data.usrId;

        var wrkInOutDate = req_data.wrkInOutDate;
        var wrkInOutTime = req_data.wrkInOutTime;
        var latitudeNum = req_data.latitudeNum;
        var longitudeNum = req_data.longitudeNum;
        var tel = req_data.telno;
        var createBy = req_data.createBy;
        var wrkInOutStatus = req_data.wrkInOutStatus;


        var dist = distance(37.4940468,127.1209413,latitudeNum,longitudeNum);

        console.log("dist:"+dist);
        var workData = null;
        var jsonStr = null;

        if(dist < 300) {

            const Swt = mongoose.model('workonoffs', swt);


            workData = new Swt({
                empNo: empNo,
                wrkInOutDate: wrkInOutDate,
                wrkInOutTime: wrkInOutTime,
                latitudeNum: latitudeNum,
                longitudeNum: longitudeNum
                ,
                telno: tel,
                createBy: createBy,
                wrkInOutStatus: wrkInOutStatus,
                usrId: usrId
            });
            // 9. 데이터 저장
            workData.save(function (error, data) {
                if (error) {
                    console.log(error);
                    jsonObj = {success: false}
                } else {
                    jsonObj = {success: true}
                    console.log('Saved!');

                    Trans = true;
                }
                callback(jsonObj);
            });

        }else{
            jsonObj = {success: false}
            jsonObj.message = '회사에서 멀리 오셨네요~\n퇴근 실패';
            console.log('300!!');
            callback(jsonObj)
        }

/*        if(Trans){
            this.workList(usrId,function(callbackList){

                callback(callbackList);
            });
        }*/




    },

    workList : function (name,callback) {
        console.log("workList");


        var data1 = new Object(); // 디테일 데이터

        const Swt = mongoose.model('workonoffs', swt);
        const today_date = moment().format('YYYYMMDD');


/*        Swt.aggregate([
            {
                $group: {
                    _id: {
                        empNo: "$empNo",
                        usrId: "$usrId",
                   //     wrkInOutTime: "$wrkInTime",
                   //     wrkInOutTime: "$wrkOutTime",
                  //      wrkInOutStatus: "$wrkInOutStatus"

                    },
                    empNo: { $first: "$empNo" },
                    usrId: { $first: "$usrId" },
                    wrkInTime: { $min: "$wrkInOutTime" },
                    wrkOutTime: { $max: "$wrkInOutTime" },
                    wrkInOutStatus: { $max: "$wrkInOutStatus" }
                }
            }
        ])
            .exec((err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            });*/

        Swt.find({usrId:name, wrkInOutDate:today_date},function(error, worktime){
            console.log('--- Read all ---');
            var jsonStr = null;
            var jsonObj = {};

            if(error){
                console.log('--- error ---');
                console.log(error);
                jsonObj.success= false;
                data1.success= false;
            }else{
                if(worktime == null){
                    jsonObj = {success:false}
                    data1.success= false;
                }else{
                    jsonStr = JSON.stringify(worktime); //객체를 JSON 문자열로 변환
                    jsonObj = JSON.parse(jsonStr); //문자를 다시 json 형태로 객체로 변환
                    console.log(typeof worktime);
                    jsonObj.success= true;

                    data1.success= true;
                    data1.workInOutList= worktime;
                }

                //   console.log(JSON.stringify(temp3));
            }
            callback(data1);
        });

    },

    webworkList : function (name,callback) {
        console.log("webworkList");

/*        var dist = distance(37.4940468,127.1209413,37.4926465,127.1179969);

        console.log("dist : "+dist);*/

        var data1 = new Object(); // 디테일 데이터

        const Swt = mongoose.model('workonoffs', swt);
        const today_date = moment().format('YYYYMMDD');


                Swt.aggregate([
                    {
                        $match: {
                            usrId: { $regex: name }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                empNo: "$empNo",
                                usrId: "$usrId",
                                wrkInOutDate: "$wrkInOutDate",
                           //     wrkInOutTime: "$wrkOutTime",
                          //      wrkInOutStatus: "$wrkInOutStatus"

                            },
                            empNo: { $first: "$empNo" },
                            usrId: { $first: "$usrId" },
                            wrkInOutDate: { $first: "$wrkInOutDate" },
                            wrkInTime: { $min: "$wrkInOutTime" },
                            wrkOutTime: { $max: "$wrkInOutTime" },
                            wrkInOutStatus: { $max: "$wrkInOutStatus" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            empNo: 1,
                            usrId: 1,
                            wrkInOutDate: 1,
                            wrkInTime: 1,
                            wrkOutTime: 1,
                            wrkInOutStatus: 1
                        }
                    },
                    {
                         $sort: {
                             wrkInOutDate: -1
                        }
                    }
                ])
                    .exec((err, results) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results);
                            data1.success= true;
                            data1.workInOutList= results;
                            callback(data1);
                        }
                    });


    },

    workChk : function (req ,callback) {
        console.log("workChk");

        const today_date = moment().format('YYYYMMDD')
        const today_time = moment().format('HHmmss')
        var data1 = new Object(); // 디테일 데이터

        var req_data = req.body;
        console.log("!!!!!!!!!!!!!");
        console.log(today_date);
        console.log("!!!!!!!!!!!!!");

        const Swt = mongoose.model('workonoffs', swt);

        Swt.find({usrId:req_data.usrId.toString(),wrkInOutDate:today_date,wrkInOutStatus:req_data.wrkInOutStatus},function(error, worktime){
            console.log(worktime);
            console.log('--- Read all2---'+worktime);
            var jsonStr = null;
            var jsonObj = {};

            if(error){
                console.log('--- error ---');
                console.log(error);
                jsonObj.success= false;
                data1.success= false;

            }else{
                if(worktime == null||worktime.length == 0){
                    jsonObj = {success:false}
                    data1.success= false;
                }else{
                    jsonStr = JSON.stringify(worktime); //객체를 JSON 문자열로 변환
                    jsonObj = JSON.parse(jsonStr); //문자를 다시 json 형태로 객체로 변환
                    console.log(typeof worktime);
                    jsonObj.success= true;

                    data1.success= true;
                    data1.workInOutList= worktime;
                }

                //   console.log(JSON.stringify(temp3));
            }
            callback(data1);
        });
        callback(data1);

    },

    delete : function () {
        console.log("delete");

// 13. 삭제
        Student.remove({_id:'64506a998438ddb03d2f298b'}, function(error,output){
            console.log('--- Delete ---');
            if(error){
                console.log(error);
            }

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
                어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
                이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
                */
            console.log('--- deleted ---');
        });
    },
}