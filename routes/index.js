var express = require('express');
var db = require('../server_mongo/connect');
var fcm = require('../server_mongo/fcmPush');
var cron = require('../server_mongo/cron');


//var db2 = require('../server_mongo/oracleDB');
var router = express.Router();
/* index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
/*  const token = "eAta5OViRLua0NQcRkFFRy:APA91bFoX50oUUNciqHvenxLrD-93FIphIb3cM3fRt4OgqiV8jIifITGn1KgyDn8eIMmDAiXTzmk1xWBlH5j4_WNXuEOVpxoz2pcUem8sitdCFChpA7TfhTjLRhsne8eNNMMhRCKV1Xh";
  const title = "출퇴근앱 테스트"
  const body = "출퇴근 체크 잘해주세요."

  fcm.sendPushNotification(token,title,body);*/
});

/* 유저입력 */
router.get('/userReg', function(req, res, next) {
  res.render('userReg', { title: '유저등록' });
});

/* 다운로드 */
router.get('/download', function(req, res, next) {
  res.render('download', { title: '출퇴근앱 다운로드' });
});

router.get('/json/download', function(req, res, next) {
  res.render('download', { title: '출퇴근앱 다운로드' });
});



/* 출퇴근 조회 */
router.get('/worklist', function(req, res, next) {

  try{
    db.webworkList(req.query.id,function(callback){
      console.log("================================");
      console.log(req.body);
      console.log("================================");
      const results = callback.workInOutList;
      res.render('workInOutList', { title: '출퇴근 리스트' , results,moment: require('moment')});
    });

  }catch (err) {
    res.status(500).json({"success":false})
  }



});

/* 버전체크 */
router.get('/json/output', function(req, res, next) {
  return res.sendFile(__dirname + '/output.json');
});

/* 사용자 저장 */
router.post('/signup', function(req, res, next) {

  db.save("user",req);
  res.status(200).json({"msessage":"save"})
});

/* 사용자 저장 */
router.get('/test/api/save', function(req, res, next) {

  db.save("user","");
  res.status(200).json({"msessage":"save"})
});

/* GET home page. */
router.post('/test/api/list', function(req, res, next) {
  db.list();
  res.status(200).json({"msessage":"list"})
});

/* GET home page. */
router.get('/test/api/update', function(req, res, next) {
  db.update();
  res.status(200).json({"msessage":"update"})
});

/* GET home page. */
router.get('/test/api/delete', function(req, res, next) {
  db.delete();
  res.status(200).json({"msessage":"delete"})
});

/* 로그인 로직 */
router.post('/test/api/loginChk', function(req, res, next) {

  var name = req.param('userId');
  var pw = req.param('userPW');
//  var name = 'Hong';
//  var pw = '1';
  var tel = req.param('telNo');
  console.log(tel);
/*  var returnData = {"empRid":"1000","empName":"test","empNo":"1001","prmryDivNm":"eeee","position":"121","success":true};
  console.log(typeof returnData);
  console.log(name);
  console.log(pw);
  console.log(tel);*/

  db.loginChk(name,pw,tel,function(callback){
    console.log("================================");
    console.log(callback);
    console.log("================================");
    userData = callback;
    console.log(userData);
    //res.status(200).json({"empRid":"1000","empName":"test","empNo":"1001","prmryDivNm":"eeee","position":"121","success":true})

    var returnData = new Object(); // 디테일 데이터
    db.workList(name,function(callback2){
      workInfo = callback2;
      console.log(workInfo);
      returnData.userInfo = userData.userInfo;
      returnData.workInOutList = workInfo.workInOutList;

      if(userData.userInfo==null){
        returnData.message = '로그인 실패\n다시 확인해주세요.';
        returnData.success = false;
      }else{
        returnData.success = true;
      }

      res.status(200).json(returnData);


    });

   // res.status(200).json(returnData);
  });

});

router.post('/api/logout', function(req, res, next) {
  var returnData = new Object();
  returnData.success = true;
  res.status(200).json(returnData)
});

/* 출퇴근 체크 */
router.post('/test/api/saveWorkTime', function(req, res, next) {



  db.workChk(req,function(chkCallback){

    var returnData = null;

    if(chkCallback.success && chkCallback.success!=null){
      chkCallback.success = false;
      chkCallback.message = '노노!!\n이미 체크하셨네요.^^';
      //res.status(200).json(chkCallback);
      res.status(200).json(chkCallback);

    }else if(chkCallback.success!=null){
      db.saveWorkTime(req,function(callback){
        console.log(callback);
        chkCallback = callback;

        if(callback.success){
          db.workList(req.body.usrId,function(callback2){
            chkCallback = callback2;
            res.status(200).json(chkCallback);
          });
        }else{
          res.status(200).json(chkCallback);
        }


      });

    }




  });

});



router.post('/api/loginIos', function(req, res, next) {

  var name = req.param('userId');
  var pw = req.param('userPW');
  var uuid = req.param('telNo');

  db.loginIosChk(name,pw,'',function(callback){
    console.log("================================");
    console.log(callback);
    console.log("================================");
    userData = callback;
    console.log(userData);
    //res.status(200).json({"empRid":"1000","empName":"test","empNo":"1001","prmryDivNm":"eeee","position":"121","success":true})

    var returnData = new Object(); // 디테일 데이터
    db.workList(name,function(callback2){
      workInfo = callback2;
      console.log(workInfo);
      returnData.userInfo = userData.userInfo;
      returnData.workInOutList = workInfo.workInOutList;

      if(userData.userInfo==null){
        returnData.message = '로그인 실패\n다시 확인해주세요.';
        returnData.success = false;
      }else{
        returnData.success = true;
      }

      db.uuIdChkSave(req,function(chkCallback){
        if(chkCallback.success){
          res.status(200).json(returnData);
        }else{
          returnData.success = false;
          returnData.message = 'UUID 값 등록 오류\n 다른 아이디로 확인해주세요.';
          res.status(200).json(returnData);
        }

      });




    });

    // res.status(200).json(returnData);
  });



});


router.post('/api/pushTokenSave', function(req, res, next) {

/*  const token = "eAta5OViRLua0NQcRkFFRy:APA91bFoX50oUUNciqHvenxLrD-93FIphIb3cM3fRt4OgqiV8jIifITGn1KgyDn8eIMmDAiXTzmk1xWBlH5j4_WNXuEOVpxoz2pcUem8sitdCFChpA7TfhTjLRhsne8eNNMMhRCKV1Xh";
  const title = "출퇴근앱 테스트"
  const body = "출퇴근 체크 잘해주세요."

  fcm.sendPushNotification(token,title,body);*/

  db.pushTokenSave(req,function(chkCallback){
    if(chkCallback.success){
      res.status(200).json(chkCallback);
    }else{
      returnData.success = false;
      returnData.message = '푸쉬 토큰 저장오류 확인해주세요.';
      res.status(200).json(chkCallback);
    }
  });



});

router.get('/workPushSend', function(req, res, next) {

  try{
    db.WorkPushSend(req.query.id,function(callback){
      console.log("================================");
      console.log(req.body);
      console.log("================================");
      const results = callback.workInOutList;
      res.status(200).json({"success":true})
    });

  }catch (err) {
    res.status(500).json({"success":false})
  }



});


module.exports = router;
