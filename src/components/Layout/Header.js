import axios from 'axios';
import Notifications from '../Notifications';
import withBadge from 'hocs/withBadge';
import React, { useState, useEffect } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
import { BsPersonFill } from 'react-icons/bs';
import { Nav, Navbar, NavItem, NavLink, Popover, PopoverBody } from 'reactstrap';
import { Link, NavLink as BsLink } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import bn from 'utils/bemnames';
import $ from 'jquery';
import Logo from '../../assets/img/logo/logo_pbms_non.png';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { userID, userName, userEmail, userDepartmentID, userDepartmentName,  monthList, performanceOptions, durationOptions, userPermission, userType } from '../constants';
import CheckPermission from './CheckPermission';
import AutoLogout from './AutoLogout';
import moment from 'moment';

const MySwal = withReactContent(Swal);



const bem = bn.create('header');

const Header = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('Token is missing');
      // ถ้าอยากให้ redirect ไป login ก็ทำได้ที่นี่:
      // window.location.href = process.env.PUBLIC_URL + '/';
    }
  }, []);
  const [isOpenNotificationPopover, setIsOpenNotificationPopover] = useState(false);
  const [isOpentoggleDownload, setIsOpentoggleDownload] = useState(false);
  const [result1, setResult1] = useState([]);
  const [statusNotify, setStatusNotify] = useState('');
  const departmentSearch = userEmail === 'super_admin@mybizthailand.com' ? '' : '&project_department=' + userDepartmentID;

  const toggleNotificationPopover = () => {
    setIsOpenNotificationPopover(!isOpenNotificationPopover);
  };

  const toggleDownload = () => {
    setIsOpentoggleDownload(!isOpentoggleDownload);
  };

  const loadCommentsFromServer = () => {
    $.ajax({
      url: process.env.REACT_APP_SOURCE_URL + '/projects/list?page=0&size=10000&year=' + moment().year() + departmentSearch,
      dataType: 'json',
      type: 'GET',
      success: data => {
        const result = data.result.result.map(data => ({
          _id: data.project_id,
          project_name: data.project_name,
          project_response_persons: data.project_responsible,
          create_date: data.create_date,
        }));
        formatResult(result);
      },
      error: (xhr, status, err) => {
        console.error('Error fetching projects:', err);
      },
    });
  };

  const formatResult = result => {
    const formattedResult = result.map(item => {
      const sDate = new Date(item.create_date);
      const eDate = new Date();
      const difference = eDate - sDate;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      return {
        id: item._id,
        message: item.project_name,
        date: days > 0 ? `${days} วัน` : formatHoursAndMinutes(difference),
        person_name: item.project_response_persons,
      };
    });
    setResult1(formattedResult);
  };

  const formatHoursAndMinutes = difference => {
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours} ชั่วโมง` : `${minutes} นาที`;
  };

  useEffect(() => {
    loadCommentsFromServer();
  }, []);

  const MdNotificationsActiveWithBadge = withBadge({
    size: 'md',
    color: 'primary',
    style: {
      top: -10,
      right: -10,
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    children: <small>{statusNotify}</small>,
  })(MdNotificationsActive);

  return (
    <Navbar light expand className={bem.b('bg-white')} style={{ position: 'fixed', width: '100%', zIndex: '10' }}>
      <CheckPermission /> {/* Include the permission check */}
      <AutoLogout /> {/* Include auto logout */}
      <Nav navbar className="mr-2">
        <Link to="/home">
          <img src={Logo} style={{ width: '50px', height: 'auto' }} alt="logo" />
        </Link>
      </Nav>
      <Nav navbar className="mr-2">
        <div className="ml-2" style={{ textAlign: 'center' }}>
          <div className="text-main-1 text-left">เทศบาลนครนนทบุรี</div>
          <div className="text-main-2 text-left">ระบบติดตามโครงการและงบประมาณ </div>
          <div className="text-main-2 text-left">ตามโครงการระบบฐานข้อมูลสารสนเทศด้านบริการและเผยแพร่ข้อมูล ของเทศบาลนครนนทบุรี</div>
        </div>
      </Nav>
      <Nav navbar className={bem.e('nav-right')}>
        <NavItem className="d-inline-flex">
          <NavLink id="Popover3" className="position-relative">
            <FaFileDownload size={25} className="text-icon-1 can-click" onClick={toggleDownload} /> <span className="text-main-3 can-click">คู่มือการใช้งาน</span>
          </NavLink>
          <Popover placement="bottom" isOpen={isOpentoggleDownload} toggle={toggleDownload} target="Popover3">
            <PopoverBody>
              <a href="https://mbth.sharepoint.com/:b:/s/MybizThailand/EUNCzOleotpBsIT3DP6-lIQBF_AghjdVlmhogNi1ydf3rQ?e=R4lwq2" target="_blank" download="คู่มือการใช้งานหน้า Dashboard">
                <button className="btn btn-defualt text-left">คู่มือการใช้งานหน้า Dashboard</button>
              </a>
              <hr />
              {userType === 1 ? (
                <a href="https://mbth.sharepoint.com/:b:/s/MybizThailand/EZDBM74kvbtEsCt3zG70Ld0BuEAGWQz-pvwuECoS0GCuPw?e=Ey0iLd" target="_blank" download="คู่มือสำหรับผู้ดูแลระบบ">
                  <button className="btn btn-defualt text-left">คู่มือสำหรับผู้ดูแลระบบ</button>
                </a>
              ) : userType === 2 ? (
                <a href="https://mbth.sharepoint.com/:b:/s/MybizThailand/EV2hs36m_XBEtaoscUAK9AcBs7pRjPGx1WOl42HJhSMuTQ?e=sgEjhG" target="_blank" download="คู่มือสำหรับผู้จัดการข้อมูล">
                  <button className="btn btn-defualt text-left">คู่มือสำหรับผู้จัดการข้อมูล</button>
                </a>
              ) : (
                <a href="https://mbth.sharepoint.com/:b:/s/MybizThailand/EcnIfjMwYfxMpr7lTFq49cABlxbtEtJ2o3FuG8Xs_J763A?e=AFmGtc" target="_blank" download="คู่มือสำหรับผู้ใช้งาน">
                  <button className="btn btn-defualt text-left">คู่มือสำหรับผู้ใช้งาน</button>
                </a>
              )}
            </PopoverBody>
          </Popover>
        </NavItem>

        {/* <NavItem className="d-inline-flex">
          <NavLink id="Popover1" className="position-relative">
            <MdNotificationsActiveWithBadge
              size={25}
              className="text-icon-1 can-click animated swing infinite"
              onClick={toggleNotificationPopover}
            />
          </NavLink>
          <Popover
            placement="left"
            isOpen={isOpenNotificationPopover}
            toggle={toggleNotificationPopover}
            target="Popover1"
          >
            <PopoverBody>
              <Notifications notificationsData={result1} />
            </PopoverBody>
          </Popover>
        </NavItem> */}

        <NavItem className="flex text-icon-1">|</NavItem>
        <NavItem>
          <Tooltip title={userDepartmentName}>
            <NavLink id="editUser" className="text-uppercase" tag={BsLink} to="/UserManagement" activeClassName="active" exact={true}>
              <BsPersonFill className="ml-2 mr-2 text-icon-1" />
              <span className="text-main-3">{userName}</span>
            </NavLink>
          </Tooltip>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;
