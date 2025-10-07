import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link, NavLink } from 'react-router-dom';

import { Button, Fab, Grid, Icon, Tooltip } from '@material-ui/core';
import Typography from '../Typography';

const bem = bn.create('page');

const EditProjectPage = ({
  title,
  id,
  projectName,
  breadcrumbs,
  tag: Tag,
  className,
  children,
  ...restProps
}) => {
  const classes = bem.b('px-3', className);
  const getBasename1 = window.location.pathname.split('/');

  return (
    <>
      <Tag className={classes} {...restProps}>
        <div className="box-1 mb-2">แก้ไขข้อมูลโครงการ</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      แก้ไขข้อมูลโครงการ
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
                <div className="flex">
                  <NavLink to="/AllProject" className="mr-2">
                    {'ข้อมูลโครงการ'}
                  </NavLink>
                  {' > แก้ไขข้อมูลโครงการ > '}
                  {projectName}
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mt-2">
            <Grid item xs={6} md={3}>
              <Link to={`/AllProject/EditProject1/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'EditProject1' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลหลัก
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/AllProject/EditProject2/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'EditProject2' || getBasename1[2] === 'AddProject2'? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลกิจกรรม
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/AllProject/EditProject3/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'EditProject3' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลตัวชี้วัด
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/AllProject/EditProject4/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'EditProject4' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลความเสี่ยง
                </div>
              </Link>
            </Grid>
          </Grid>
          <hr />
          <div className="mb-3"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

EditProjectPage.propTypes = {
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
EditProjectPage.defaultProps = {
  tag: 'div',
  title: '',
};

export default EditProjectPage;
