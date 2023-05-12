var express = require('express');
var db = require('../server_mongo/connect');
var router = express.Router();

/* index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 유저입력 */
router.get('/userReg', function(req, res, next) {
  res.render('userReg', { title: '유저등록' });
});

/* 유저입력 */
router.get('/download', function(req, res, next) {
  res.render('download', { title: '출퇴근앱 다운로드' });
});

/* 출퇴근 조회 */
router.get('/worklist', function(req, res, next) {

  db.webworkList(req.query.id,function(callback){
    console.log("================================");
    console.log(req.body);
    console.log("================================");
    const results = callback.workInOutList;
    res.render('workInOutList', { title: '출퇴근 리스트' , results,moment: require('moment')});
  });


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
        returnData.success = false;
      }else{
        returnData.success = true;
      }

      res.status(200).json(returnData);


    });

   // res.status(200).json(returnData);
  });

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
        db.workList(req.body.usrId,function(callback2){
          chkCallback = callback2;
          res.status(200).json(chkCallback);
        });

      });

    }




  });





});


module.exports = router;
