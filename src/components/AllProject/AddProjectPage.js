import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link, NavLink } from 'react-router-dom';

import { Button, Fab, Grid, Icon, Tooltip } from '@material-ui/core';
import Typography from '../Typography';

const bem = bn.create('page');

const AddProjectPage = ({
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
        <div className="box-1 mb-2">เพิ่มข้อมูลโครงการ</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      เพิ่มข้อมูลโครงการ
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
                <div className="flex">
                  <NavLink to="/AllProject" className="mr-2">
                    {'ข้อมูลโครงการ'}
                  </NavLink>
                  {' > เพิ่มข้อมูลโครงการ > '}
                  {projectName}
                </div>
              </div>
            </Grid>
          </Grid>
          {id === undefined ? (
            <Grid container spacing={2} className="mt-2">
              <Grid item xs={6} md={3}>
                {/* <Link to="/AllProject/AddProject1"> */}
                  <div
                    className={
                      getBasename1[2] === 'AddProject1' ? 'box-8' : 'box-7'
                    }
                  >
                    ข้อมูลหลัก
                  </div>
                {/* </Link> */}
              </Grid>
              <Grid item xs={6} md={3}>
                {/* <Link to="/AllProject/AddProject2"> */}
                <div
                  className={
                    getBasename1[2] === 'AddProject2' ? 'box-8' : 'box-7-dis'
                  }
                >
                  ข้อมูลกิจกรรม
                </div>
                {/* </Link> */}
              </Grid>
              <Grid item xs={6} md={3}>
                {/* <Link to="/AllProject/AddProject3"> */}
                <div
                  className={
                    getBasename1[2] === 'AddProject3' ? 'box-8' : 'box-7-dis'
                  }
                >
                  ข้อมูลตัวชี้วัด
                </div>
                {/* </Link> */}
              </Grid>
              <Grid item xs={6} md={3}>
                {/* <Link to="/AllProject/AddProject4"> */}
                <div
                  className={
                    getBasename1[2] === 'AddProject4' ? 'box-8' : 'box-7-dis'
                  }
                >
                  ข้อมูลความเสี่ยง
                </div>
                {/* </Link> */}
              </Grid>
            </Grid>
          ) : (
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
                <Link to={`/AllProject/AddProject2/${id}`}>
                  <div
                    className={
                      getBasename1[2] === 'AddProject2' ? 'box-8' : 'box-7'
                    }
                  >
                    ข้อมูลกิจกรรม
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to={`/AllProject/AddProject3/${id}`}>
                  <div
                    className={
                      getBasename1[2] === 'AddProject3' ? 'box-8' : 'box-7'
                    }
                  >
                    ข้อมูลตัวชี้วัด
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to={`/AllProject/AddProject4/${id}`}>
                  <div
                    className={
                      getBasename1[2] === 'AddProject4' ? 'box-8' : 'box-7'
                    }
                  >
                    ข้อมูลความเสี่ยง
                  </div>
                </Link>
              </Grid>
            </Grid>
          )}
          <hr />
          <div className="mb-3"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

AddProjectPage.propTypes = {
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
AddProjectPage.defaultProps = {
  tag: 'div',
  title: '',
};

export default AddProjectPage;
