import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import {
  Breadcrumb,
  BreadcrumbItem,
  Col,
  Input,
  InputGroup,
  Row,
  Button,
} from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import Typography from './Typography';
import { Fab, Grid, Icon, IconButton, Tooltip } from '@material-ui/core';

const bem = bn.create('page');

const Page4 = ({
  title,
  breadcrumbs,
  tag: Tag,
  className,
  children,
  ...restProps
}) => {
  const classes = bem.b('px-3', className);
  const getBasename1 = window.location.pathname.split('/');

  // this.state = {
  //   show_password: false,
  // };

  // function clickShow() {
  //   if (this.state.show_password === false) {
  //     this.setState({
  //       show_password: true,
  //     });
  //   } else {
  //     this.setState({
  //       show_password: false,
  //     });
  //   }
  // }
  return (
    <>
      <Tag className={classes} {...restProps}>
        <div className="box-1 mb-2">จัดการข้อมูลผู้ใช้</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <div className="row">
            <div className="col-6" style={{ textAlign: 'left' }}>
              ข้อมูลผู้ใช้
            </div>
          </div>
          <hr className="mb-4 mt-4" />

          <div className="mt-4 mb-4"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

Page4.propTypes = {
  tag: PropTypes.component,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  children: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      active: PropTypes.bool,
    }),
  ),
};
Page4.defaultProps = {
  tag: 'div',
  title: '',
};

export default Page4;
