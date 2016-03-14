var myapp = angular.module('myapp', ['ngResource','ionic','ui.router'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
myapp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);
myapp.factory('Mytitles',  function( $resource){
  //http://myprojects101010-shedule111.rhcloud.com
  return $resource('/titles/:titleid/' , { titleid : '@_id' } , {
    update: {
      method: 'PUT'
    },
    remove: {
      method: 'DELETE'
    }
    });
});
myapp.factory('Shedules',  function( $resource){
  return $resource('/shedules/:sheduleId' , { sheduleId : '@_id' } ,{
   getData: { method:'GET', isArray: true } ,
   update: {
      method: 'PUT'
    },
    remove: {
      method: 'DELETE'
    }
  });
});
myapp.controller('SheduleCtrl',function($scope,$resource, Mytitles, $http, Shedules, $ionicPopup){
  $scope.titlesList = Mytitles.query();
  //var post = JSON.parse(window.localStorage['post'] || '{}');
  //$scope.shedulesList = Shedules.getData({ sheduleId :  0 });
  $scope.shedulesList = JSON.parse(window.localStorage['nCurrentShedule'] );
    $scope.times = JSON.parse(window.localStorage['times'] || '["8:15-9:35" ,"9:45-11:05" ,"Добавить"]') ;
  $scope.auds = JSON.parse(window.localStorage['auds'] || '["419" ,"606" ,"Добавить"]');
  $scope.kinds = JSON.parse(window.localStorage['kinds'] || '["Лекция" ,"Практика" ,"Добавить"]');
  $scope.tasks = JSON.parse(window.localStorage['tasks'] || '["Алгебра" ,"Геометрия" ,"Добавить"]');
  $scope.lects = JSON.parse(window.localStorage['lects'] || '["Тихонов Сергей Викторович" ,"Суворов Владимир Васильевич" ,"Добавить"]') ;
  $scope.tab = 1;

  $scope.setTab = function (tabId) {

            $scope.tab = tabId;
            $scope.editBtn = false;
            $scope.delBtn =false;

  };

  $scope.isSet = function (tabId) {
     return $scope.tab === tabId;
  };
  
  $scope.newTitle ={ title: "" };
  $scope.days = [ { "title" : "Понедельник"}, { "title" : "Вторник"}, { "title" : "Среда"}, { "title" : "Четверг"}, { "title" : "Пятница"}, { "title" : "Суббота"} ] ;
  var defaultShedule = [
    [ { "day":"Понедельник"} , [] ] , [ { "day" : "Вторник"}, [] ] , [{ "day" : "Среда"}  , [] ] , [ { "day" : "Четверг"} , [] ] , [ { "day" : "Пятница"} , [] ] , [  { "day" : "Суббота"}, [] ]
  ];
  $scope.addnewShedule = function() {
    $scope.setTab(2);
    $scope.viewShedule = defaultShedule.slice();
  };
  //edit shedule
  var editid;
    editShedule = function(id) {
      $scope.setTab(3);
      editid=id;
      $scope.currentShedule= id;
      $scope.newTitle=$scope.titlesList[id];  
     $scope.viewShedule=Shedules.getData({ sheduleId :  editid });    
  };
  $scope.showeditBtn = function(){
    $scope.editBtn = !$scope.editBtn;
    $scope.delBtn =false;
  };
    $scope.showdelBtn = function(){
    $scope.editBtn = false;
    $scope.delBtn =! $scope.delBtn;
  }


$scope.saveEditShedule = function(){
  $scope.shedulesList = $scope.viewShedule.slice();
    Shedules.update( { sheduleId :  editid } , $scope.viewShedule );
   Mytitles.update( { titleid :  editid } ,  $scope.newTitle );
      $scope.newTitle ={ title: "" };
       $scope.viewShedule =defaultShedule.slice();
  $scope.setTab(1);
  };
  $scope.viewShedule =defaultShedule.slice();
  $scope.addviewShedule = function(dayid){
    $scope.viewShedule[dayid][1].push( {} );
  };


  addNewValue = function(arrayOfvalues, templ, storedKey)
  {


    arrayOfvalues.splice( arrayOfvalues.length-1, 1 );

    if(templ!="время") {

         var prmpt  =  $ionicPopup.prompt({
            title: "Введите " + templ,
            inputType: 'text'
          });

    } else {  

         $scope.data ={};
         prmpt = $ionicPopup.show({
            template: '<input type="time" ng-model="data.start" placeholder="8:15"> <br> <input type="time" ng-model="data.end" placeholder="9:35"> ',
            title: 'Введите время',
            scope: $scope,
            buttons: [
              { text: 'Cancel' },
              {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!($scope.data.start && $scope.data.end) ) {                
                    e.preventDefault();
                  } else {
                    if ($scope.data.start!= ""  &&  $scope.data.end != "") {
                    return $scope.data.start.getHours()+':'+$scope.data.start.getMinutes() + '-' + $scope.data.end.getHours()+':'+$scope.data.end.getMinutes();
                  }
                }
               }
              }
             ]
           });
    }

      prmpt.then(function(res) {

        if (res) {
            arrayOfvalues.push( res);
        };

        arrayOfvalues.push("Добавить" );
        window.localStorage[storedKey] = JSON.stringify(arrayOfvalues);

     })
       

  }


  //добавление аудиторий, преподавателей, формы проведения занятий
  $scope.addnewtime = function(newparam) {
    if(newparam=="Добавить")
    {
      addNewValue($scope.times, "время", 'times');
      
    };
  };
  $scope.addnewaud = function(newparam) {
    if(newparam=="Добавить")
    {
      addNewValue($scope.auds, "номер аудитории",'auds');
    };
  };
    $scope.addnewkind = function(newparam) {
    if(newparam=="Добавить")
    {
      addNewValue($scope.kinds, "тип занятия", 'kinds');
    };
  };
    $scope.addnewtask = function(newparam) {
    if(newparam=="Добавить")
    {
      addNewValue($scope.tasks, "название",'tasks');
    };
  };
    $scope.addnewlect = function(newparam) {
    if(newparam=="Добавить")
    { 
      addNewValue($scope.lects, "ФИО лектора",'lects');
     };
  };


  //удаление
  $scope.deltask = function(dayid,id){

      $scope.viewShedule[dayid][1].splice( id, 1 );
  };



  delShedule = function(id){

    Shedules.remove( { sheduleId :  id });
    Mytitles.remove( { titleid :  id });
    $scope.titlesList.splice( id, 1 );
    $scope.viewShedule =defaultShedule.slice();
    $scope.shedulesList = defaultShedule.slice();

    };


  $scope.saveShedule = function(){

    $scope.setShedule($scope.titlesList.length);
    $scope.shedulesList=$scope.viewShedule;
    Mytitles.save($scope.newTitle);
    $scope.titlesList =Mytitles.query();
    Shedules.save($scope.viewShedule);
    $scope.newTitle ={ title: "" };
    $scope.viewShedule =defaultShedule.slice();
    $scope.setTab(1);

  };


 

//window.localStorage['time'] = JSON.stringify(time);
  $scope.setShedule = function(id) {

    $scope.currentShedule= id;
    $scope.shedulesList = Shedules.getData({ sheduleId :  id},function()
    {
      window.localStorage['nCurrentShedule']=JSON.stringify($scope.shedulesList);
    })
    

    if($scope.editBtn){
      editShedule(id);
    };

    if($scope.delBtn){
      delShedule(id);
    };

  };


})