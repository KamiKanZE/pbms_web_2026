import React from 'react';
import PropTypes from 'utils/propTypes';
import axios from 'axios';
import { Media } from 'reactstrap';
import $ from 'jquery';
import Avatar from './Avatar';
import { updateLocale } from 'moment';
const token_id = localStorage.getItem('token');
function update(id, person_id, person_name) {
  axios
    .post(
      process.env.REACT_APP_SOURCE_URL + '/projects/notify/' + id,
      // { person_id: person_id },
      {
        project_response_persons: person_id,
        //  this.state
      },
      {
        headers: { Authorization: `Bearer ${token_id}` },
      },
    )
    .then(response => {
      // window.location.href = '/progress1report/' + id;
    })
    .catch(error => {
      throw error;
    });
}
const Notifications = ({ notificationsData }) => {
  if (!notificationsData || notificationsData.length === 0) {
    return 'ไม่มีแจ้งเตือน';
  }

  // จัดเรียงตามจำนวนวันที่น้อยที่สุดก่อน
  const sortedNotifications = notificationsData
    .sort((a, b) => {
      const dateA = parseInt(a.date); // แปลงวันที่เป็นตัวเลขเพื่อใช้ในการเปรียบเทียบ
      const dateB = parseInt(b.date);
      return dateA - dateB; // เรียงจากน้อยไปมาก
    })
    .slice(0, 20); // จำกัดให้แสดงผลเพียง 20 ข้อความ

  return (
    sortedNotifications.map(
      ({ id, message, date, person_name }) => (
        <Media key={id} className="pb-2">
          <Media left className="align-self-center pr-3">
            <a href={'/ReportActivities/ReportDetail2/' + id}>
              <Avatar
                tag={Media}
                object
                src={'http://kpi.nakornnont.go.th/favicon.ico'}
                alt="Avatar"
              />
            </a>
          </Media>
          <Media body middle className="align-self-center">
            <a href={'/ReportActivities/ReportDetail2/' + id}>
              {message}
            </a>
          </Media>
          <Media right className="align-self-center">
            <small className="text-muted">&nbsp;{date}</small>
          </Media>
        </Media>
      ),
    )
  );
};

Notifications.propTypes = {
  notificationsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.ID,
      // avatar: PropTypes.string,
      message: PropTypes.node,
      date: PropTypes.date,
      status: PropTypes.string,
    }),
  ),
};

Notifications.defaultProps = {
  notificationsData: [],
};

export default Notifications;
