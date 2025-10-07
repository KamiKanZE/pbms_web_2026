import { STATE_LOGIN, STATE_FORGOT } from './components/AuthForm';
import GAListener from './components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from './components/Layout';
// import AlertPage from './pages/AlertPage';
// import AuthModalPage from './pages/AuthModalPage';
import AuthPage from './pages/AuthPage';
// import BadgePage from './pages/BadgePage';
// import ButtonGroupPage from './pages/ButtonGroupPage';
// import ButtonPage from './pages/ButtonPage';
// // import CardPage from './pages/CardPage';
// import ChartPage from './pages/ChartPage';
// // import LoginForm from './pages/login';
// // pages
// import DashboardPage from './pages/DashboardPage';
// import DashboardPage1 from './pages/DashboardPage1';
// import Project1 from './pages/Project1';
// import Project1_2 from './pages/Project1-2';
// import Project1_2view from './pages/Project1-2view';
// import Project1_3 from './pages/Project1-3';
// import Project1_4 from './pages/Project1-4';
// import ProjectView from './pages/view';
// import KPI1 from './pages/KPI1';
// import BudgetSource1 from './pages/BudgetSource1';
// //import TablePage from './pages/FormPage';
// import TablePage from './pages/testTable';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import './styles/paginate.css'
// import Plan from './pages/Plan1';
// import MainPlan from './pages/MainPlan';
// import SubPlanA from './pages/SubPlanA';
// import SubPlanB from './pages/SubPlanB';
// import NationPlan from './pages/NationPlan';
// import MinistryPlan from './pages/MinistryPlan';
// import BudgetType from './pages/BudgetType';
// import ProjectType from './pages/ProjectType';
// import Unit from './pages/Unit';
// import Department from './pages/Department';
// import FormProject from './pages/FormProject';
// import FormEditProject from './pages/FormEditProject';
// import Pregress2 from './pages/Pregress-2';
// import Progress1 from './pages/Pregress-1';
// import progress1report from './pages/progress1report';

// import KPI1_1 from './pages/KPI1-1';
// import KPI1_2 from './pages/KPI1-2';
// import KPI1_3 from './pages/KPI1-3';
// import User from './pages/User';
// import UserType from './pages/UserType';
import User1_1 from './pages/User1_1';
// import KpiList from './pages/KpiList';
// import LoginForm from './pages/login';
// import reportProject from './pages/Reportproject';
// import ProjectID from './pages/ProjectID';
import resetPassword from './components/resetPassword';
// import pdf from './components/Project/pdf';
import MinistryLand from './pages/MinistryData/MinistryLand';
import MinistryProvice from './pages/MinistryData/MinistryProvice';
import MinistryLocal from './pages/MinistryData/MinistryLocal';
import MinistryNon from './pages/MinistryData/MinistryNon';
import SubStrategy from './pages/MinistryData/SubStrategy';
import PlanGeneral from './pages/PlanData/PlanGeneral';
import PlanService from './pages/PlanData/PlanService';
import PlanEconomy from './pages/PlanData/PlanEconomy';
import PlanManagement from './pages/PlanData/PlanManagement';
import PolicyPresident from './pages/PolicyData/PolicyPresident';
import IncomeSelf from './pages/Income/IncomeSelf';
import IncomeGovCollect from './pages/Income/IncomeGovCollect';
import IncomeGovSupport from './pages/Income/IncomeGovSupport';
import ExpenceBudget from './pages/Expence/ExpenceBudget';
import Project from './pages/ProjectData/ProjectTypes';
import DepartmentsData from './pages/DepartmentsData/DepartmentsData';
import Internal from './pages/IndicatorData/Internal';
import External from './pages/IndicatorData/External';
import UnitData from './pages/UnitData/UnitData';
import AllProjectData from './pages/AllProject/AllProjectData';
import UserManagement from './pages/User/UserManagement';
import UserPermission from './pages/User/UserPermission';
import ReportPerformance from './pages/ReportPerformance/ReportPerformance';
import ReportKPI from './pages/ReportKPI/ReportKPI';
import IncomeDataManagement from './pages/IncomeData/IncomeDataManagement';
import KPIData from './pages/KPIData/KPIData';
import ExpenceDataManagement from './pages/ExpenceData/ExpenceDataManagement';
import AddProjectData1 from './pages/AllProject/AddProjectData1';
import AddProjectData4 from './pages/AllProject/AddProjectData4';
import AddProjectData3 from './pages/AllProject/AddProjectData3';
// import AddProjectData2 from './pages/AllProject/AddProjectData2';
import ReportDetail1 from './pages/ReportPerformance/ReportDetail1';
import ReportDetail2 from './pages/ReportPerformance/ReportDetail2';
import ReportDetail3 from './pages/ReportPerformance/ReportDetail3';
import ReportDetail4 from './pages/ReportPerformance/ReportDetail4';
import ReportKPIDetail from './pages/ReportKPI/ReportKPIDetail';
import KPIDataDetail from './pages/KPIData/KPIDataDetail';
import MinistryMainPlan from './pages/MinistryData/MinistryMainPlan';
import MinistryEco from './pages/MinistryData/MinistryEco';
import MinistrySDGs from './pages/MinistryData/MinistrySDGs';
import DashboardNew from './pages/DashboardNew';
import EditProjectData1 from './pages/AllProject/EditProjectData1';
import EditProjectData2 from './pages/AllProject/EditProjectData2';
import EditProjectData3 from './pages/AllProject/EditProjectData3';
import EditProjectData4 from './pages/AllProject/EditProjectData4';
import KPIDataDetailProject from './pages/KPIData/KPIDataDetailProject';
import axios from 'axios';
// import DashboardNew2 from './pages/DashboardNew2';
import UserForgetPassword from './pages/User/UserForgetPassword';
import MinistryLivable from './pages/MinistryData/MinistryLivable';
import MinistryITMasterPlan from './pages/MinistryData/MinistryITMasterPlan';
import MinistrySmartCity from './pages/MinistryData/MinistrySmartCity';
import ImportProjectData from './pages/AllProject/ImportProjectData';
import Activity from './components/ActivityLog/Activity';
import DashboardViewer from './pages/DashboardViewer';
const token_id = localStorage.getItem('token');
const userID = localStorage.getItem('userID');
const userPermission =
  JSON.parse(localStorage.getItem('userPermission')) !== null
    ? JSON.parse(localStorage.getItem('userPermission'))
    : [
        {
          manageUsersData: false,
          manageBasicData: false,
          manageBudgetData: false,
          manageProjectData: false,
          manageReportProjectData: false,
          manageKPIData: false,
          manageReportKPIData: false,
          showProjectData: false,
          showReportProjectData: false,
          showKPIData: false,
          showReportKPIData: false,
        },
      ];
const getBasename = () => {
  // let path = window.location.pathname.split('/');
  // return path[1];
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};
const getBasename1 = window.location.pathname.split('/');

class App extends React.Component {
  static URL = 'http://202.44.231.119:5555/api/v1';
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  render() {
    const ss = window.location.pathname;
    //const userRoles = JSON.parse(localStorage.getItem('userRoles'));
    if (!token_id) {
      if (
        getBasename1[1] != '' &&
        getBasename1[1] != 'resetPassword' &&
        getBasename1[1] != 'DashboardPage' &&
        getBasename1[1] != 'forget' &&
        getBasename1[1] != 'login' &&
        getBasename1[1] != 'UserForgetPassword' &&
        getBasename1[1] != 'dashboardviewer'
      ) {
        window.location.href = '/';
      }
      //   return (
      //     <Secured onLogoutPress={() => this.setState({ isLoggedIn: false })} />
      //   );
      // else
      return (
        <BrowserRouter basename={getBasename()}>
          <GAListener>
            <Switch>
              <LayoutRoute
                exact
                path="/"
                layout={EmptyLayout}
                component={props => <AuthPage {...props} authState={STATE_LOGIN} />}
                // component={LoginForm}
              />
              <LayoutRoute
                exact
                path="/login"
                layout={EmptyLayout}
                component={props => <AuthPage {...props} authState={STATE_LOGIN} />}
                // component={LoginForm}
              />
              <LayoutRoute exact path="/forget" layout={EmptyLayout} component={props => <AuthPage {...props} authState={STATE_FORGOT} />} />
              <LayoutRoute exact path="/resetPassword/:id" layout={EmptyLayout} component={resetPassword} />
              <LayoutRoute path="/dashboardviewer" layout={EmptyLayout} component={DashboardViewer} />
              <LayoutRoute exact path="/UserForgetPassword/:id/:token" layout={EmptyLayout} component={UserForgetPassword} />
            </Switch>
          </GAListener>
        </BrowserRouter>
      );
    } else {
      let navUsers = [];
      let navProject = [];
      let navReport = [];
      let navKpi = [];
      let navKpireport = [];
      // if (userRoles != null) {
      //   for (let i = 0; i < userRoles.length; i++) {
      //     if (userRoles[i].user_role_name == '') {
      //       navUsers.push('');
      //       // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="User" && getBasename1[1]!="plan1"
      //       // && getBasename1[1]!="budgetsource1" && getBasename1[1]!="MainPlan" && getBasename1[1]!="SubPlanA" && getBasename1[1]!="SubPlanB"
      //       // && getBasename1[1]!="NationPlan" && getBasename1[1]!="MinistryPlan" && getBasename1[1]!="BudgetType" && getBasename1[1]!="ProjectType"
      //       // && getBasename1[1]!="Unit" && getBasename1[1]!="Department" && getBasename1[1]!="kpilist" && getBasename1[1]!="UserType" && getBasename1[1]!="User1_1"){
      //       // window.location.href = '/';
      //       // }
      //     }
      //     if (userRoles[i].user_role_name == 'ผู้จัดการข้อมูลโครงการ') {
      //       navProject.push('ผู้จัดการข้อมูลโครงการ');
      //       // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="project1" && getBasename1[1]!="User1_1"
      //       // && getBasename1[1]!="project1-2view" && getBasename1[1]!="project1-3" && getBasename1[1]!="project1-4"
      //       // && getBasename1[1]!="FormProject" && getBasename1[1]!="FormEditProject" && getBasename1[1]!="project1-2"    ){
      //       //   // window.location.href = '/';
      //       // }
      //     }
      //     if (userRoles[i].user_role_name == 'ผู้รายงานผลโครงการ') {
      //       navReport.push('ผู้รายงานผลโครงการ');
      //       // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="reportProject" && getBasename1[1]!="User1_1"
      //       // && getBasename1[1]!="progress1report"){
      //       //   // window.location.href = '/';
      //       // }
      //     }
      //     if (userRoles[i].user_role_name == 'ผู้จัดการข้อมูลตัวชี้วัด') {
      //       navKpi.push('ผู้จัดการข้อมูลตัวชี้วัด');
      //       // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="kpi1" && getBasename1[1]!="User1_1" && getBasename1[1]!="KPI1_2" ){
      //       //   // window.location.href = '/';
      //       // }
      //     }
      //     if (userRoles[i].user_role_name == 'ผู้รายงานผลตัวชี้วัด') {
      //       navKpireport.push('ผู้รายงานผลตัวชี้วัด');
      //       // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="KPI1_3" && getBasename1[1]!="User1_1"){
      //       //   // window.location.href = '/';
      //       // }
      //     }
      //     // if(userRoles[i].user_role_name=="ผู้บริหาร"){
      //     //   // if (getBasename1[1] != '' && getBasename1[1] != 'home' && getBasename1[1]!="User1_1"){
      //     //   //   // window.location.href = '/';
      //     //   // }
      //     // }
      //   }
      // }
      return (
        <BrowserRouter basename={getBasename()}>
          <GAListener>
            <Switch>
              <LayoutRoute
                exact
                path="/login"
                layout={EmptyLayout}
                component={props => <AuthPage {...props} authState={STATE_LOGIN} />}
                // component={LoginForm}
              />
              {/* <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            /> */}
              {/* <LayoutRoute
                exact
                path="/pdf"
                layout={MainLayout}
                component={pdf}
              />
              <LayoutRoute
                exact
                path="/pdf/:id"
                layout={MainLayout}
                component={pdf}
              />
              <LayoutRoute
                exact
                path="/login-modal"
                layout={MainLayout}
                component={AuthModalPage}
              /> */}
              <LayoutRoute exact path="/" layout={MainLayout} component={DashboardNew} />
              <LayoutRoute exact path="/home" layout={MainLayout} component={DashboardNew} />
              {/*  <LayoutRoute
                exact
                path="/home1"
                layout={MainLayout}
                component={DashboardPage1}
              />
             <LayoutRoute
                exact
                path="/view/:id"
                layout={MainLayout}
                component={ProjectView}
              />
              <LayoutRoute
                exact
                path="/Project1-2view/:id"
                layout={MainLayout}
                component={Project1_2view}
              />
              <LayoutRoute
                exact
                path="/Project1-3/:id"
                layout={MainLayout}
                component={Project1_3}
              />
              <LayoutRoute
                exact
                path="/Project1-4/:id"
                layout={MainLayout}
                component={Project1_4}
              /> */}
              {userPermission[0].showProjectData === true || userPermission[0].manageProjectData === true ? (
                <LayoutRoute exact path="/AllProject" layout={MainLayout} component={AllProjectData} />
              ) : (
                ''
              )}

              <LayoutRoute exact path="/UserManagement" layout={MainLayout} component={UserManagement} />

              {userPermission[0].manageUsersData === true ? <LayoutRoute exact path="/UserPermission" layout={MainLayout} component={UserPermission} /> : ''}
              {userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                <LayoutRoute exact path="/ReportActivities" layout={MainLayout} component={ReportPerformance} />
              ) : (
                ''
              )}
              {userPermission[0].showKPIData === true || userPermission[0].manageKPIData === true ? <LayoutRoute exact path="/ReportKPI" layout={MainLayout} component={ReportKPI} /> : ''}
              {userPermission[0].manageBudgetData === true ? <LayoutRoute exact path="/IncomeDataManagement" layout={MainLayout} component={IncomeDataManagement} /> : ''}
              {userPermission[0].manageBudgetData === true ? <LayoutRoute exact path="/ExpenceDataManagement" layout={MainLayout} component={ExpenceDataManagement} /> : ''}
              {userPermission[0].showKPIData === true || userPermission[0].manageKPIData === true ? <LayoutRoute exact path="/KPIData" layout={MainLayout} component={KPIData} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/ImportProject" layout={MainLayout} component={ImportProjectData} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/AddProject1" layout={MainLayout} component={AddProjectData1} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/EditProject1/:id" layout={MainLayout} component={EditProjectData1} /> : ''}
              {userPermission[0].manageProjectData === true ? (
                <LayoutRoute
                  exact
                  path="/AllProject/AddProject2/:id"
                  layout={MainLayout}
                  // component={AddProjectData2}
                  component={EditProjectData2}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/EditProject2/:id" layout={MainLayout} component={EditProjectData2} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/AddProject3/:id" layout={MainLayout} component={AddProjectData3} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/EditProject3/:id" layout={MainLayout} component={EditProjectData3} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/AddProject4/:id" layout={MainLayout} component={AddProjectData4} /> : ''}
              {userPermission[0].manageProjectData === true ? <LayoutRoute exact path="/AllProject/EditProject4/:id" layout={MainLayout} component={EditProjectData4} /> : ''}
              {userPermission[0].showProjectData === true || userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                <LayoutRoute exact path="/ReportActivities/ReportDetail1/:id" layout={MainLayout} component={ReportDetail1} />
              ) : (
                ''
              )}
              {userPermission[0].showProjectData === true || userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                <LayoutRoute exact path="/ReportActivities/ReportDetail2/:id" layout={MainLayout} component={ReportDetail2} />
              ) : (
                ''
              )}
              {userPermission[0].showProjectData === true || userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                <LayoutRoute exact path="/ReportActivities/ReportDetail3/:id" layout={MainLayout} component={ReportDetail3} />
              ) : (
                ''
              )}
              {userPermission[0].showProjectData === true || userPermission[0].showReportProjectData === true || userPermission[0].manageReportProjectData === true ? (
                <LayoutRoute exact path="/ReportActivities/ReportDetail4/:id" layout={MainLayout} component={ReportDetail4} />
              ) : (
                ''
              )}
              {userPermission[0].showKPIData === true || userPermission[0].manageKPIData === true ? (
                <LayoutRoute exact path="/KPIData/KPIDataDetail/:id/:kpi_id/:year" layout={MainLayout} component={KPIDataDetail} />
              ) : (
                ''
              )}
              {userPermission[0].showKPIData === true || userPermission[0].manageKPIData === true ? (
                <LayoutRoute exact path="/KPIData/KPIDataDetailProject/:kpi_id/:id/:year" layout={MainLayout} component={KPIDataDetailProject} />
              ) : (
                ''
              )}
              {userPermission[0].showReportKPIData === true || userPermission[0].manageReportKPIData === true ? (
                <LayoutRoute exact path="/ReportKPI/ReportKPIDetail/:kpi_id/:id" layout={MainLayout} component={ReportKPIDetail} />
              ) : (
                ''
              )}

              {/*{ userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/SubPlanA"
                  layout={MainLayout}
                  component={SubPlanA}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/SubPlanA/:id"
                  layout={MainLayout}
                  component={SubPlanA}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/SubPlanB"
                  layout={MainLayout}
                  component={SubPlanB}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/SubPlanB/:id"
                  layout={MainLayout}
                  component={SubPlanB}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/NationPlan"
                  layout={MainLayout}
                  component={NationPlan}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/NationPlan/:id"
                  layout={MainLayout}
                  component={NationPlan}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/MinistryPlan"
                  layout={MainLayout}
                  component={MinistryPlan}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/MinistryPlan/:id"
                  layout={MainLayout}
                  component={MinistryPlan}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/BudgetType"
                  layout={MainLayout}
                  component={BudgetType}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/BudgetType/:id"
                  layout={MainLayout}
                  component={BudgetType}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/ProjectType"
                  layout={MainLayout}
                  component={ProjectType}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/ProjectType/:id"
                  layout={MainLayout}
                  component={ProjectType}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/Unit"
                  layout={MainLayout}
                  component={Unit}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/Unit/:id"
                  layout={MainLayout}
                  component={Unit}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/Department"
                  layout={MainLayout}
                  component={Department}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/Department/:id"
                  layout={MainLayout}
                  component={Department}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/budgetsource1"
                  layout={MainLayout}
                  component={BudgetSource1}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/budgetsource1/:id"
                  layout={MainLayout}
                  component={BudgetSource1}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/User"
                  layout={MainLayout}
                  component={User}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/User/:id"
                  layout={MainLayout}
                  component={User}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/UserType"
                  layout={MainLayout}
                  component={UserType}
                />
              ) : (
                ''
              )}
             { userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/UserType/:id"
                  layout={MainLayout}
                  component={UserType}
                />
              ) : (
                ''
              )} */}

              {/* start NewUpdate ข้อมูลพื้นฐาน by pluem */}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryLand" layout={MainLayout} component={MinistryLand} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryMainPlan" layout={MainLayout} component={MinistryMainPlan} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryEco" layout={MainLayout} component={MinistryEco} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistrySDGs" layout={MainLayout} component={MinistrySDGs} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryProvice" layout={MainLayout} component={MinistryProvice} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryLocal" layout={MainLayout} component={MinistryLocal} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryNon" layout={MainLayout} component={MinistryNon} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryNon/SubStrategy/:id" layout={MainLayout} component={SubStrategy} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryLivable" layout={MainLayout} component={MinistryLivable} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistryITMasterPlan" layout={MainLayout} component={MinistryITMasterPlan} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/MinistryData/MinistrySmartCity" layout={MainLayout} component={MinistrySmartCity} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/PlanData/PlanGeneral" layout={MainLayout} component={PlanGeneral} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/PlanData/PlanService" layout={MainLayout} component={PlanService} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/PlanData/PlanEconomy" layout={MainLayout} component={PlanEconomy} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/PlanData/PlanManagement" layout={MainLayout} component={PlanManagement} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/PolicyData/PolicyPresident" layout={MainLayout} component={PolicyPresident} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/IncomeData/IncomeSelf" layout={MainLayout} component={IncomeSelf} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/IncomeData/IncomeGovCollect" layout={MainLayout} component={IncomeGovCollect} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/IncomeData/IncomeGovSupport" layout={MainLayout} component={IncomeGovSupport} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/ExpenceData/ExpenceBudget" layout={MainLayout} component={ExpenceBudget} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/ProjectData/Project" layout={MainLayout} component={Project} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/DepartmentsData/Departments" layout={MainLayout} component={DepartmentsData} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/IndicatorData/Internal" layout={MainLayout} component={Internal} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/IndicatorData/External" layout={MainLayout} component={External} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/UnitData/Unit" layout={MainLayout} component={UnitData} /> : ''}
              {userPermission[0].manageBasicData === true ? <LayoutRoute exact path="/Activity" layout={MainLayout} component={Activity} /> : ''}
              {/* {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/plan1"
                  layout={MainLayout}
                  component={Plan}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/plan1/:id"
                  layout={MainLayout}
                  component={Plan}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/MainPlan"
                  layout={MainLayout}
                  component={MainPlan}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/MainPlan/:id"
                  layout={MainLayout}
                  component={MainPlan}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/kpilist"
                  layout={MainLayout}
                  component={KpiList}
                />
              ) : (
                ''
              )}
              {userPermission[0].manageBasicData === true ? (
                <LayoutRoute
                  exact
                  path="/kpilist/:id"
                  layout={MainLayout}
                  component={KpiList}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/project1"
                  layout={MainLayout}
                  // component={Project1}
                  component={props => <Project1 {...props} />}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/project1/:id"
                  layout={MainLayout}
                  // component={Project1}
                  component={props => <Project1 {...props} />}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/projectID/:id"
                  layout={MainLayout}
                  component={ProjectID}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Project1-2/:id"
                  layout={MainLayout}
                  component={Project1_2}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Project1-2view/:id"
                  layout={MainLayout}
                  component={Project1_2view}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Project1-3/:id"
                  layout={MainLayout}
                  component={Project1_3}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Project1-4/:id"
                  layout={MainLayout}
                  component={Project1_4}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/FormEditProject/:id"
                  layout={MainLayout}
                  component={FormEditProject}
                />
              ) : (
                ''
              )}
              {navProject == 'ผู้จัดการข้อมูลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/FormProject"
                  layout={MainLayout}
                  component={FormProject}
                />
              ) : (
                ''
              )}
              {navReport == 'ผู้รายงานผลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Pregress2"
                  layout={MainLayout}
                  component={Pregress2}
                />
              ) : (
                ''
              )}
              {navReport == 'ผู้รายงานผลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/Progress1/:id"
                  layout={MainLayout}
                  component={Progress1}
                />
              ) : (
                ''
              )}
              {navReport == 'ผู้รายงานผลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/reportProject"
                  layout={MainLayout}
                  component={reportProject}
                />
              ) : (
                ''
              )}
              {navReport == 'ผู้รายงานผลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/reportProject/:id"
                  layout={MainLayout}
                  component={reportProject}
                />
              ) : (
                ''
              )}
              {navReport == 'ผู้รายงานผลโครงการ' ? (
                <LayoutRoute
                  exact
                  path="/progress1report/:id"
                  layout={MainLayout}
                  component={progress1report}
                />
              ) : (
                ''
              )}
              {navKpi == 'ผู้จัดการข้อมูลตัวชี้วัด' ? (
                <LayoutRoute
                  exact
                  path="/kpi1"
                  layout={MainLayout}
                  component={KPI1}
                />
              ) : (
                ''
              )}
              {navKpi == 'ผู้จัดการข้อมูลตัวชี้วัด' ? (
                <LayoutRoute
                  exact
                  path="/kpi1/:id"
                  layout={MainLayout}
                  component={KPI1}
                />
              ) : (
                ''
              )}
              {navKpi == 'ผู้จัดการข้อมูลตัวชี้วัด' ? (
                <LayoutRoute
                  exact
                  path="/KPI1_2/:id"
                  layout={MainLayout}
                  component={KPI1_2}
                />
              ) : (
                ''
              )}
              {navKpireport == 'ผู้รายงานผลตัวชี้วัด' ? (
                <LayoutRoute
                  exact
                  path="/KPI1_3"
                  layout={MainLayout}
                  component={KPI1_3}
                />
              ) : (
                ''
              )}
              {navKpireport == 'ผู้รายงานผลตัวชี้วัด' ? (
                <LayoutRoute
                  exact
                  path="/KPI1_1"
                  layout={MainLayout}
                  component={KPI1_1}
                />
              ) : (
                ''
              )}
              <LayoutRoute
                exact
                path="/testTable"
                layout={MainLayout}
                component={TablePage}
              /> */}
              <LayoutRoute exact path="/User1_1" layout={MainLayout} component={User1_1} />
              <Redirect to="/" />
            </Switch>
          </GAListener>
        </BrowserRouter>
      );
    }
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
