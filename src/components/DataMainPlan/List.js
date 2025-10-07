import React from 'react';
import { connect } from 'react-redux';
import { deletePost } from '../../actions/mainPlan';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

function PostList({ posts, onDelete }) {
  if (!posts.length) {
    return (
      <tr>
        <td colSpan="4">No Posts</td>
      </tr>
    );
  }
  return (
    <tbody>
      {posts.map(post => {
        return (
          <tr>
            <td>{post.budget_source_id}</td>
            <td>{post.main_plan_id}</td>
            <td>{post.main_plan_name}</td>
            <td>
              <Tooltip title="แก้ไข">
                <IconButton
                  className="btn_not_focus"
                  size="small"
                  color="default"
                  aria-label="แก้ไข"
                  onClick={() => onEdit(post._id)}
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
                  onClick={() => onDelete(post._id)}
                >
                  <Icon>delete</Icon>
                </IconButton>
              </Tooltip>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

const mapStateToProps = state => {
  return {
    posts: state.posts,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDelete: id => {
      dispatch(deletePost(id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostList);
