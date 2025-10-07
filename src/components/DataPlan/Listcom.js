import React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default ({ post: { plan_id, plan_name, _id }, onDelete }) => {
  return (
    <tr>
      <td>..</td>
      <td>{plan_id}</td>
      <td>{plan_name}</td>
      <td>
        <Tooltip title="แก้ไข">
          <IconButton
            className="btn_not_focus"
            size="small"
            color="default"
            aria-label="แก้ไข"
          >
            <Icon>edit_icon</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="ลบ">
          <IconButton
            className="btn_not_focus"
            size="small"
            color="secondary"
            aria-label="ลบ"
            onClick={() => onDelete(_id)}
          >
            <Icon>delete</Icon>
          </IconButton>
        </Tooltip>
      </td>
    </tr>
  );
};
