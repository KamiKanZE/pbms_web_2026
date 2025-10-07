import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { userID } from '../constants';
const token_id = localStorage.getItem('token');
const MySwal = withReactContent(Swal);
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
const CheckPermission = ({ history }) => {
  useEffect(() => {
    const decodedJwt = parseJwt(token_id);
    if (decodedJwt.exp * 1000 < Date.now()) {
        localStorage.clear();
        window.location = '/';
    }
    const checkUserPermission = () => {
      axios
        .get(`${process.env.REACT_APP_SOURCE_URL}/users/${localStorage.getItem('userID')}`)
        .then(res => {
            const { user_permission } = res.data;
            const storedPermission = JSON.parse(localStorage.getItem('userPermission'));
            // ตรวจสอบว่าข้อมูลไม่เป็น null หรือ undefined ก่อน
            if (user_permission && user_permission[0] && storedPermission && storedPermission[0]) {
                const isPermissionSame = Object.keys(user_permission[0]).every(
                    key => user_permission[0][key] === storedPermission[0][key]
                );
          if (!isPermissionSame) {
            MySwal.fire({
              title: <strong>สิทธิ์การใช้งานของคุณมีการเปลี่ยนแปลง</strong>,
              html: (
                <i>
                  ระบบกำลังนำคุณออกจากระบบ <br />
                  กรุณาเข้าสู่ระบบอีกครั้ง ขออภัยในความไม่สะดวก
                </i>
              ),
              icon: 'warning',
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
            }).then(() => {
              localStorage.clear();
              history.push('/'); // Use history.push to navigate
            });
          }
        } else {
            // กรณีที่ข้อมูลไม่ถูกต้องหรือไม่มีอยู่
            console.error('Permission data is missing or invalid');
        }
        });
    };

    const permissionCheckInterval = setInterval(checkUserPermission, 60000); // 5 นาที
    return () => clearInterval(permissionCheckInterval); // Clear interval on unmount
  }, [history]);

  return null; // This component doesn't render anything
};

export default withRouter(CheckPermission);
