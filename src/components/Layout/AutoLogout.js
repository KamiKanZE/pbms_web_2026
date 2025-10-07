import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AutoLogout = () => {
  let timeoutId;
  
  const startLogoutTimer = () => {
    let countdown = 60; // 60 seconds countdown
    const interval = setInterval(() => {
      document.getElementById('resultTime').innerHTML = countdown;
      countdown--;
      if (countdown < 0) {
        clearInterval(interval);
        localStorage.clear();
        window.location = '/'; // Redirect to home page
      }
    }, 1000);
    MySwal.fire({
      title: <strong>แจ้งเตือน</strong>,
      html: (
        <i>
          ระบบกำลังจะทำการออกจากระบบอัตโนมัติภายใน 1 นาที <br />
          หากท่านยังใช้งานอยู่กรุณากดปุ่ม 'ใช้งานต่อไป' <br />
          ภายใน <span id="resultTime"></span> วินาที
        </i>
      ),
      icon: 'warning',
      timer: 60000, // 60 seconds
      showConfirmButton: true,
      confirmButtonText: 'ใช้งานต่อไป',
      confirmButtonColor: '#66BB66',
    }).then(result => {
      clearInterval(interval);
      if (result.isConfirmed) {
        MySwal.fire({
          title: <strong>ใช้งานระบบต่อไป</strong>,
          html: <i>ระบบจะแจ้งเตือนอีกครั้งเมื่อครบ 30 นาที</i>,
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } else if (result.isDismissed) {
        localStorage.clear();
        window.location = '/'; // Redirect to home page
      }
    });
  };

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(startLogoutTimer, 1800000); // 30 นาที (30 minutes)
  };

  useEffect(() => {
    const events = ['mousemove', 'keypress', 'click', 'scroll'];

    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize the timer on component mount

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AutoLogout;
