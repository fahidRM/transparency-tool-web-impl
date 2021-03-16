<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="icon" type="image/png" href="assets/img/favicon.ico">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Administrator | JA'E MIS </title>
	
    
    <link href="assets_v2/css/font-face.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/font-awesome-4.7/css/font-awesome.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/font-awesome-5/css/fontawesome-all.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/mdi-font/css/material-design-iconic-font.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/bootstrap-4.1/bootstrap.min.css" rel="stylesheet" media="all">
    
    <link href="assets_v2/vendor/animsition/animsition.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/bootstrap-progressbar/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/wow/animate.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/css-hamburgers/hamburgers.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/slick/slick.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/select2/select2.min.css" rel="stylesheet" media="all">
    <link href="assets_v2/vendor/perfect-scrollbar/perfect-scrollbar.css" rel="stylesheet" media="all">
    <link href='assets_v2/vendor/fullcalendar-3.10.0/fullcalendar.css' rel='stylesheet' media="all" />
     <link rel="stylesheet" href="bower_components/angular-bootstrap-datetimepicker/src/css/datetimepicker.css"/>
   

 
    <!-- Main CSS-->
    <link href="assets_v2/css/theme.css" rel="stylesheet" media="all">
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ]) !!};
    </script>

</head>
<body ng-app="transmis_jae" class="animsition">
    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
        {{ csrf_field() }}
    </form>
    <div class="page-wrapper">
        <header class="header-desktop4">
            <div class="container">
                <div class="header4-wrap">
                    <div class="header__logo">
                        <a href="#">
                            <h4><br>JA'E Transport - MIS<br><br></h4>
                        </a>
                    </div>
                    <div class="header__tool">
                       <?php

                        if ($ssms == 1) {
                            echo  '<button class="btn btn-sm btn-outline-danger">OUT OF SMS</button>&nbsp;&nbsp' ;
                        }

                        if ($ssub == 1) {
                            echo '<button class="btn btn-sm btn-outline-danger">SUBSCRIPTION EXPIRING SOON</button>&nbsp;&nbsp;';
                        }
                       ?>
                       
                        

                        <div class="account-wrap">
                            <div class="account-item account-item--style2 clearfix js-item-menu">
                                <div class="image">
                                    <img src="assets_v2/images/avatar-01.png" alt="" />
                                </div>
                                <div class="content">
                                    <a class="js-acc-btn" href="#"><?php echo $full_name; ?></a>
                                </div>
                                <div class="account-dropdown js-dropdown">
                                    <div class="info clearfix">
                                        <div class="image">
                                            <a href="#">
                                                <img src="assets_v2/images/avatar-01.png" alt="" />
                                            </a>
                                        </div>
                                        <div class="content">
                                            <h5 class="name">
                                                <a href="#"><?php echo $full_name; ?></a>
                                            </h5>
                                            <span class="email"><?php echo $email; ?></span>
                                        </div>
                                    </div>
                                    <div class="account-dropdown__body">
                                        <div class="account-dropdown__item">
                                            <a href="#!/me">
                                                <i class="zmdi zmdi-account"></i>My Account</a>
                                        </div>
                                        <div class="account-dropdown__item">
                                            <a href="#!/dashboard">
                                                <i class="zmdi zmdi-settings"></i>Dashboard</a>
                                        </div>
                                        <div class="account-dropdown__item">
                                            <a href="#!/config">
                                                <i class="zmdi zmdi-settings"></i>Manage Configurations</a>
                                        </div>
                                        <div class="account-dropdown__item">
                                            <a href="#!/access">
                                                <i class="zmdi zmdi-settings"></i>Manage Logins</a>
                                        </div>
                                        <div class="account-dropdown__item">
                                            <a href="#!/notifications">
                                               <i class="zmdi zmdi-notifications"></i>Manage Notifications</a>
                                        </div>
                                    </div>
                                    <div class="account-dropdown__footer">
                                        <a href="#" id ="qqq">
                                            <i class="zmdi zmdi-power"></i>Logout</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div ng-view>
        </div>
     </div>

 



    <script src="assets/js/jquery-3.2.1.min.js" type="text/javascript"></script>
    <script src="assets_v2/vendor/bootstrap-4.1/popper.min.js"></script>
    <script src="assets_v2/vendor/bootstrap-4.1/bootstrap.min.js"></script>
	<script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-route/angular-route.min.js"></script>
    <script src="js/ui-bootstrap-tpls-3.0.6.min.js"></script>
    <script src="assets_v2/vendor/slick/slick.min.js">
    </script>
    <script src="assets_v2/vendor/wow/wow.min.js"></script>
    <script src="assets_v2/vendor/animsition/animsition.min.js"></script>
    <script src="assets_v2/vendor/bootstrap-progressbar/bootstrap-progressbar.min.js">
    </script>
    <script src="assets_v2/vendor/counter-up/jquery.waypoints.min.js"></script>
    <script src="assets_v2/vendor/counter-up/jquery.counterup.min.js">
    </script>
    <script src="assets_v2/vendor/circle-progress/circle-progress.min.js"></script>
    <script src="assets_v2/vendor/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="assets_v2/vendor/select2/select2.min.js">
    </script>
     <script src="assets_v2/vendor/fullcalendar-3.10.0/lib/moment.min.js"></script>
    <script src="assets_v2/vendor/fullcalendar-3.10.0/fullcalendar.js"></script>


      <script type="text/javascript" src="bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker.js"></script>
    <!-- Main JS-->
    <!--script src="js/main.js"></script-->

    <script src="js/lodash.js"></script>
     <script src="assets_v2/js/main.js"></script>


    <script>
        var sId =  "<?php echo $id; ?>" ;
        var sName =  "<?php echo $full_name; ?>" ;
        var sAccess =  "<?php echo $user_access; ?>" ;

        var sEmail = "<?php echo $email; ?>";
        var sDept = "<?php echo $department; ?>";

     

        function padToTwo (val) {
            return (val + '').length > 1 ? val : '0' + val;
        }


         $("#qqq").click(function () {
            $("#logout-form").submit();
        });

         $(".xxp").click( function(event){
            event.preventDefault();
        });


    </script>
    <!--script src="assets_v2/js/main.js"></script-->

    






    <script src="app/app.js"></script>
    <script src="app/api/api.js"></script>
    <script src="app/util/util.service.js"></script>
    <script src="app/_identity/app_user.js"></script>

    <script src="app/components/sidebar/sidebar.js"></script>

    <script src="app/dashboard/dashboard.js"></script>
    <script src="app/dashboard/dashboard.controller.js"></script>

    <script src="app/organisation/branch/branch.js"></script>
    <script src="app/organisation/branch/branch.controller.js"></script>

    <script src="app/organisation/mods/mods.js"></script>
    <script src="app/organisation/mods/mods.controller.js"></script>

    <script src="app/organisation/client/client.js"></script>
    <script src="app/organisation/client/client.controller.js"></script>

    <script src="app/organisation/investment-bundle/investment-bundle.js"></script>
    <script src="app/organisation/investment-bundle/investment-bundle.controller.js"></script>

    <script src="app/organisation/staff/staff.js"></script>
    <script src="app/organisation/staff/staff.controller.js"></script>

    <script src="app/organisation/vehicle/vehicle.js"></script>
    <script src="app/organisation/vehicle/vehicle.controller.js"></script>

    <script src="app/organisation/contacts/contacts.js"></script>
    <script src="app/organisation/contacts/contacts.controller.js"></script>

    <script src="app/organisation/sms/sms.js"></script>
    <script src="app/organisation/sms/sms.controller.js"></script>


    <script src="app/organisation/debtors/debtor.js"></script>
    <script src="app/organisation/debtors/debtor.controller.js"></script>

    <script src="app/accounts/payment/payment.js"></script>
    <script src="app/accounts/payment/payment.controller.js"></script>


    <script src="app/service/service/service.js"></script>
    <script src="app/service/service/service.controller.js"></script>

    <script src="app/accounts/expense/expense.js"></script>
    <script src="app/accounts/expense/expense.controller.js"></script>

    <script src="app/security/visitor-log/log.js"></script>
    <script src="app/security/visitor-log/log.controller.js"></script>

    <script src="app/security/attendance/attendance.js"></script>
    <script src="app/security/attendance/attendance.controller.js"></script>

    <script src="app/hummer/journey/journey.js"></script>
    <script src="app/hummer/journey/journey.controller.js"></script>

    <script src="app/driving-school/certificate/cert.js"></script>
    <script src="app/driving-school/certificate/cert.controller.js"></script>

    <script src="app/driving-school/consultancy/cons.js"></script>
    <script src="app/driving-school/consultancy/cons.controller.js"></script>

    <script src="app/driving-school/registration/reg.js"></script>
    <script src="app/driving-school/registration/reg.controller.js"></script>

</body>
</html>
