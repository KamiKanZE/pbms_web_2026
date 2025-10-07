// import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from '../../assets/img/bg/background_1920-16.jpg';
import axios from 'axios';
import SourceLink from '../SourceLink';
import React from 'react';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdSettings,
  MdPerson,
  MdPeople,
  MdPowerSettingsNew,
  MdHome,
  MdGroup,
  MdTextSnippet,
} from 'react-icons/md';
import { FaList, FaFileAlt, FaListAlt, FaPowerOff } from 'react-icons/fa';
import { IoIosListBox, IoIosSwitch } from 'react-icons/io';
import { BsBarChartFill, BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { AiFillFile } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { RiArticleLine } from "react-icons/ri";
import { VscChecklist } from "react-icons/vsc";
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';
const token_id = localStorage.getItem('token');
const departmentID = localStorage.getItem('userDepartmentID');
const name = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');
//const userPermission = {};
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

const userID = localStorage.getItem('userID');
const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};
const navSetting =
  userPermission[0].manageBasicData === true
    ? [
      {
        to: '/MinistryData/MinistryLand',
        name: 'ข้อมูลยุทธศาสตร์',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/PlanData/PlanGeneral',
        name: 'ข้อมูลแผนงาน',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/PolicyData/PolicyPresident',
        name: 'ข้อมูลนโยบายนายกเทศมนตรีประจำปี',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/IncomeData/IncomeSelf',
        name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายรับ)',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/ExpenceData/ExpenceBudget',
        name: 'ข้อมูลประเภทงบประมาณ (งบประมาณรายจ่าย)',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/ProjectData/Project',
        name: 'ข้อมูลประเภทโครงการ',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/DepartmentsData/Departments',
        name: 'ข้อมูลหน่วยงาน',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/IndicatorData/Internal',
        name: 'ข้อมูลประเภทตัวชี้วัด',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
      {
        to: '/UnitData/Unit',
        name: 'ข้อมูลหน่วยนับ',
        exact: false,
        Icon: MdRadioButtonChecked,
      },
    ]
    : [];

// const navUsers = [
//   {
//     to: '/User',
//     name: 'จัดการข้อมูลผู้ใช้งาน',
//     exact: false,
//     Icon: MdRadioButtonChecked,
//   },
// ];

const navHome = [{ to: '/home', name: 'Dashboard', exact: true, Icon: MdHome }];
const navProject =
  userPermission[0].showProjectData === true ||
    userPermission[0].manageProjectData === true
    ? [
      {
        to: '/AllProject',
        name: 'ข้อมูลโครงการ',
        exact: true,
        Icon: IoIosListBox,
      },
    ]
    : [];

const navReportProject =
  userPermission[0].showReportProjectData === true ||
    userPermission[0].manageReportProjectData === true
    ? [
      {
        to: '/ReportActivities',
        name: 'รายงานผลปฏิบัติงาน',
        exact: true,
        Icon: AiFillFile,
      },
    ]
    : [];

const navBudget =
  userPermission[0].manageBudgetData === true
    ? [
      {
        to: '/IncomeDataManagement',
        name: 'จัดการข้อมูลงบประมาณ (รายรับ)',
        exact: true,
        Icon: FaList,
      },
      {
        to: '/ExpenceDataManagement',
        name: 'จัดการข้อมูลงบประมาณ (รายจ่าย)',
        exact: true,
        Icon: FaListAlt,
      },
    ]
    : [];
const navKpi =
  userPermission[0].showKPIData === true ||
    userPermission[0].manageKPIData === true
    ? [
      {
        to: '/KPIData',
        name: 'ข้อมูลตัวชี้วัด KPI',
        exact: true,
        Icon: BsBarChartFill,
      },
    ]
    : [];
const navReportKpi =
  userPermission[0].showReportKPIData === true ||
    userPermission[0].manageReportKPIData === true
    ? [
      {
        to: '/ReportKPI',
        name: 'การรายงานผลตัวชี้วัด',
        exact: true,
        Icon: IoIosSwitch,
      },
    ]
    : [];

const navUser = [
  {
    to: '/UserManagement',
    name: 'ข้อมูลผู้ใช้งาน',
    exact: true,
    Icon: MdPerson,
  },
];
const navPermission =
  userPermission[0].manageUsersData === true
    ? [
      {
        to: '/UserPermission',
        name: 'จัดการสิทธิ์ผู้ใช้',
        exact: false,
        Icon: MdGroup,
      },
    ]
    : [];
const navActivity =
  userPermission[0].manageUsersData === true
    ? [
      {
        to: '/Activity',
        name: 'Event Log',
        exact: false,
        Icon: VscChecklist,
      },
    ]
    : [];
// const navProject = [
//   { to: '/project1', name: 'ข้อมูลโครงการ', exact: true, Icon: MdWeb },
// ];
// const navReportProject = [
//   {
//     to: '/reportProject',
//     name: 'รายงานผลปฏิบัติงานโครงการ',
//     exact: true,
//     Icon: MdWeb,
//   },
// ];
// const navKpi = [
//   { to: '/kpi1', name: 'ข้อมูลตัวชี้วัด', exact: true, Icon: MdSend },
// ];
// const navReportKPI = [
//   { to: '/KPI1_3', name: 'รายงานผลตัวชี้วัด', exact: true, Icon: MdSend },
// ];
//const UserType = JSON.parse(localStorage.getItem('userRoles'));
let navItems1 = [];
// let navProject = [];
//const navItems = [];
//const navReportProject = [];
//const navKpi = [];
let navReportKPI = [];
let navUsers = [];
let navEdituser = [];
navItems1.push({
  to: '/home',
  name: 'Dashboard',
  exact: true,
  Icon: MdDashboard,
});
navEdituser.push({
  to: '/User1_1',
  name: 'แก้ไขข้อมูลส่วนตัว',
  exact: true,
  Icon: MdSend,
});
// if (UserType != null) {
//   for (let i = 0; i < UserType.length; i++) {
//     //   result = this.state.typeUser.filter(member => {
//     //     return member.label == user_roles[i].user_role_name;
//     //   });
//     //   // this.setState({ selectedmonthOptions: [] });
//     //   this.setState(prevState => ({
//     //     user_rolex: prevState.user_rolex.concat(result),
//     //   }));
//     // }
//     //  UserType.map(User => {
//     // // if(User.user_role_name=="ผู้บริหาร"){
//     // //   navItems1 = {""}
//     // // }
//     if (UserType[i].user_role_name == 'ผู้จัดการข้อมูลพื้นฐาน') {
//       navItems.push('admin');
//       navUsers.push({
//         to: '/User',
//         name: 'จัดการข้อมูลผู้ใช้งาน',
//         exact: false,
//         Icon: MdRadioButtonChecked,
//       });
//     }
//     if (UserType[i].user_role_name == 'ผู้จัดการข้อมูลโครงการ') {
//       navProject.push({
//         to: '/project1',
//         name: 'ข้อมูลโครงการ',
//         exact: true,
//         Icon: MdViewList,
//       });
//     }
//     if (UserType[i].user_role_name == 'ผู้รายงานผลโครงการ') {
//       navReportProject.push({
//         to: '/reportProject',
//         name: 'รายงานผลปฏิบัติงานโครงการ',
//         exact: true,
//         Icon: MdWeb,
//       });
//     }
//     if (UserType[i].user_role_name == 'ผู้จัดการข้อมูลตัวชี้วัด') {
//       navKpi.push({
//         to: '/kpi1',
//         name: 'ข้อมูลตัวชี้วัด',
//         exact: true,
//         Icon: MdViewList,
//       });
//     }
//     if (UserType[i].user_role_name == 'ผู้รายงานผลตัวชี้วัด') {
//       navReportKPI.push({
//         to: '/KPI1_3',
//         name: 'รายงานผลตัวชี้วัด',
//         exact: true,
//         Icon: MdStar,
//       });
//     }

//     // });
//   }
// }

// const navItems = [
//   { to: '/home', name: 'Dashboard', exact: true, Icon: MdDashboard },
// ];
// const navItems = [
//   { to: '/home', name: 'Dashboard', exact: true, Icon: MdDashboard },
//   { to: '/project1', name: 'Project 1', exact: true, Icon: MdWeb },
//   { to: '/kpi1', name: 'KPI 1', exact: true, Icon: MdSend },
// ];

const bem = bn.create('sidebar');

class SidebarNew extends React.Component {
  constructor(props) {
    super(props);
    const getBasename1 = window.location.pathname.split('/');
    let isOpenSetting = false;
    let isOpenPermission = false;
    if (
      getBasename1[1] != '' &&
      (getBasename1[1] == 'User' ||
        getBasename1[1] == 'plan1' ||
        getBasename1[1] == 'budgetsource1' ||
        getBasename1[1] == 'MainPlan' ||
        getBasename1[1] == 'SubPlanA' ||
        getBasename1[1] == 'SubPlanB' ||
        getBasename1[1] == 'NationPlan' ||
        getBasename1[1] == 'MinistryPlan' ||
        getBasename1[1] == 'BudgetType' ||
        getBasename1[1] == 'ProjectType' ||
        getBasename1[1] == 'Unit' ||
        getBasename1[1] == 'Department' ||
        getBasename1[1] == 'kpilist' ||
        getBasename1[1] == 'UserType' ||
        getBasename1[1] == 'User1_1')
    ) {
      isOpenSetting = true;
    }
    if (getBasename1[1] != '' && getBasename1[1] == 'UserPermission') {
      isOpenPermission = true;
    }
    this.state = {
      isOpenComponents: true,
      isOpenContents: true,
      isOpenPages: true,
      isOpenSetting: isOpenSetting,
      isOpenPermission: isOpenPermission,
    };
  }
  parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  signOut() {
    const decodedJwt = this.parseJwt(token_id);
    if (decodedJwt.exp * 1000 < Date.now()) {
        localStorage.clear();
        window.location = '/';
    }

    axios
      .post(
        process.env.REACT_APP_SOURCE_URL + '/users/logout',
        {
          "email": email
        },
        { headers: { Authorization: `Bearer ${token_id}` } },
      )
      .then(res => {
        localStorage.clear();
        window.location = '/';
      })
  }
  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };
  render() {
    return (
      <>
        <div className="bg-sidebar">
          <div>
            {/* <div style={{ marginTop: '8vh' }} /> */}
            <Navbar
              sm={12}
              style={{ backgroundColor: '#025FDC', paddingTop: '8vh' }}
            >
              <SourceLink
                className="navbar-brand d-flex"
                style={{ width: '100%', textAlign: 'center' }}
              >
                <span
                  className="text-white "
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  เมนูหลัก
                </span>
              </SourceLink>
            </Navbar>
            <Nav vertical style={{ marginTop: 0 }}>
              {navHome.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}

              {navProject.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}

              {navReportProject.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}

              {navBudget.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}
              {navKpi.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}
              {navReportKpi.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ justifyContent: 'flex-end', color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}

              {/* {navItems == 'admin' ? ( */}
              {userPermission[0].manageBasicData === true ? (
                <NavItem
                  className={bem.e('nav-item')}
                  onClick={this.handleClick('Setting')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    className={bem.e('nav-item-collapse')}
                    style={{
                      paddingRight: '0px',
                      justifyContent: 'flex-end',
                      color: '#ffffff',
                    }}
                  >
                    {/* <div className="d-flex"> */}
                    <MdSettings className={bem.e('nav-item-icon')} />
                    {/* <span className="">จัดการข้อมูลพื้นฐาน</span> */}
                    {/* </div> */}
                    {/* <MdKeyboardArrowDown
                      className={bem.e('nav-item-icon')}
                      style={{
                        padding: 0,
                        transform: this.state.isOpenSetting
                          ? 'rotate(0deg)'
                          : 'rotate(-90deg)',
                        transitionDuration: '0.3s',
                        transitionProperty: 'transform',
                      }}
                    /> */}
                  </BSNavLink>
                </NavItem>
              ) : (
                ''
              )}
              {/* ) : (
                ''
              )} */}

              <Collapse isOpen={this.state.isOpenSetting}>
                {navSetting.map(({ to, name, exact, Icon }, index) => (
                  <NavItem
                    key={index}
                    className={bem.e('nav-item')}
                    style={{ marginLeft: 0 }}
                  >
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                      style={{
                        paddingRight: '0px',
                        justifyContent: 'flex-end',
                        color: '#ffffff',
                      }}
                    >
                      &nbsp;&nbsp;
                      {/* <span style={{ opacity: '0' }}>{name}</span> */}
                      <Icon className={bem.e('nav-item-icon')} />
                    </BSNavLink>
                  </NavItem>
                ))}
              </Collapse>

              {navPermission.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{
                      paddingRight: '0px',
                      justifyContent: 'flex-end',
                      color: '#ffffff',
                    }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}
              {navUser.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{
                      paddingRight: '0px',
                      justifyContent: 'flex-end',
                      color: '#ffffff',
                    }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}
              {navActivity.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{
                      paddingRight: '0px',
                      justifyContent: 'flex-end',
                      color: '#ffffff',
                    }}
                  >
                    {/* <span style={{ opacity: '0' }}>{name}</span> */}
                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))}
              <NavItem
                key={0}
                className={bem.e('nav-item')}
                style={{ marginLeft: 0 }}
              >
                <BSNavLink
                  id="signout"
                  className="text-uppercase"
                  tag={NavLink}
                  to={window.location.pathname}
                  activeClassName=""
                  exact={true}
                  onClick={() => this.signOut()}
                  style={{
                    paddingRight: '0px',
                    justifyContent: 'flex-end',
                    color: '#ffffff',
                  }}
                >
                  <span style={{ opacity: '0' }}> ออกจากระบบ</span>
                  {/* <Icon className={bem.e('nav-item-icon')} /> */}
                  <FaPowerOff className={bem.e('nav-item-icon')} />
                </BSNavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
        <div className="bg-sidebar-2">
          <div>
            {/* <div style={{ marginTop: '8vh' }} /> */}
            <Navbar
              sm={12}
              style={{ backgroundColor: '#025FDC', paddingTop: '8vh' }}
            >
              <SourceLink
                className="navbar-brand d-flex"
                style={{ width: '100%', textAlign: 'center' }}
              >
                <span
                  className="text-white "
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }}
                >
                  เมนูหลัก
                </span>
              </SourceLink>
            </Navbar>
            <Nav vertical style={{ marginTop: 0 }}>
              {navHome.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}

              {navProject.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}

              {navReportProject.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              {navBudget.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              {navKpi.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              {navReportKpi.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  // style={{ paddingLeft: 10 }}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}

              {/* {navItems == 'admin' ? ( */}
              {userPermission[0].manageBasicData === true ? (
                <NavItem
                  className={bem.e('nav-item')}
                  onClick={this.handleClick('Setting')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    className={bem.e('nav-item-collapse')}
                    style={{ paddingRight: 0, color: '#ffffff' }}
                  >
                    <div className="d-flex">
                      <MdSettings className={bem.e('nav-item-icon')} />
                      <span className="">จัดการข้อมูลพื้นฐาน</span>
                    </div>
                    <MdKeyboardArrowDown
                      className={bem.e('nav-item-icon')}
                      style={{
                        padding: 0,
                        transform: this.state.isOpenSetting
                          ? 'rotate(0deg)'
                          : 'rotate(-90deg)',
                        transitionDuration: '0.3s',
                        transitionProperty: 'transform',
                      }}
                    />
                  </BSNavLink>
                </NavItem>
              ) : (
                ''
              )}

              <Collapse isOpen={this.state.isOpenSetting}>
                {navSetting.map(({ to, name, exact, Icon }, index) => (
                  <NavItem
                    key={index}
                    className={bem.e('nav-item')}
                    style={{ marginLeft: 0 }}
                  >
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                      style={{ color: '#ffffff' }}
                    >
                      &nbsp;&nbsp;
                      <Icon className={bem.e('nav-item-icon')} />
                      <span className="">{name}</span>
                    </BSNavLink>
                  </NavItem>
                ))}
              </Collapse>

              {navPermission.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  >
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              {navUser.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  >
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              {navActivity.map(({ to, name, exact, Icon }, index) => (
                <NavItem
                  key={index}
                  className={bem.e('nav-item')}
                  style={{ marginLeft: 0 }}
                >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    style={{ color: '#ffffff' }}
                  >
                    {/* <Icon className={bem.e('nav-item-icon')} /> */}
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
              <NavItem
                key={0}
                className={bem.e('nav-item')}
                style={{ marginLeft: 0 }}
              >
                <BSNavLink
                  id="signout"
                  className="text-uppercase"
                  tag={NavLink}
                  to="#"
                  activeClassName=""
                  exact={true}
                  onClick={() => this.signOut()}
                  style={{ color: '#ffffff' }}
                >
                  {/* <Icon className={bem.e('nav-item-icon')} /> */}
                  <FaPowerOff className={bem.e('nav-item-icon')} />
                  <span className="">ออกจากระบบ</span>
                </BSNavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
      </>
    );
  }
}

export default SidebarNew;
