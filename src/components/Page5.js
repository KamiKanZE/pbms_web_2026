import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import Typography from './Typography';
import { Button, Fab, Grid, Icon, Tooltip } from '@material-ui/core';

const bem = bn.create('page');

const Page5 = ({
  title,
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
        <div className="box-1 mb-2">จัดการข้อมูลสิทธิ์ผู้ใช้</div>
        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      {title}
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
              </div>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={10} md={10}>
                  <div style={{ textAlign: 'right' }}>
                    <Input
                      type="text"
                      name="keyword"
                      placeholder={'ค้นหา' + title}
                      // onChange={this.handleInputChange}
                      // value={this.state.keyword}
                      style={{ width: '100%' }}
                    ></Input>
                  </div>
                </Grid>
                <Grid item xs={2} md={2}>
                  <div className="" style={{ textAlign: 'center' }}>
                    <Tooltip title="Search">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: '#ff962d',
                          outline: 'none',
                        }}
                      >
                        <Icon style={{ color: '#ffffff' }}>search</Icon>
                      </Button>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
          {/* <div className="row">
            <div className="col-6" style={{ textAlign: 'right' }}></div>
          </div> */}
          <hr />

          {/* tab ตัวเลือกสี่หัวข้อ */}
          {getBasename1[1] === 'MinistryData' ? (
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Link to="/MinistryData/MinistryLand">
                  <div
                    className={
                      getBasename1[2] === 'MinistryLand' ? 'box-4' : 'box-3'
                    }
                  >
                    ข้อมูลยุทธศาสตร์ชาติ 20 ปี
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/MinistryData/MinistryProvice">
                  <div
                    className={
                      getBasename1[2] === 'MinistryProvice' ? 'box-4' : 'box-3'
                    }
                  >
                    ข้อมูลยุทธศาสตร์จังหวัด
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/MinistryData/MinistryLocal">
                  <div
                    className={
                      getBasename1[2] === 'MinistryLocal' ? 'box-4' : 'box-3'
                    }
                  >
                    ข้อมูลยุทธศาสตร์ <br /> องค์กรปกครองส่วนท้องถิ่น (อปท.)
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/MinistryData/MinistryNon">
                  <div
                    className={
                      getBasename1[2] === 'MinistryNon' ? 'box-4' : 'box-3'
                    }
                  >
                    ข้อมูลยุทธศาสตร์เทศบาลนครนนทบุรี
                  </div>
                </Link>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {getBasename1[1] === 'PlanData' ? (
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Link to="/PlanData/PlanGeneral">
                  <div
                    className={
                      getBasename1[2] === 'PlanGeneral' ? 'box-4' : 'box-3'
                    }
                  >
                    ด้านบริหารทั่วไป
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/PlanData/PlanService">
                  <div
                    className={
                      getBasename1[2] === 'PlanService' ? 'box-4' : 'box-3'
                    }
                  >
                    ด้านบริการชุมชนและสังคม
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/PlanData/PlanEconomy">
                  <div
                    className={
                      getBasename1[2] === 'PlanEconomy' ? 'box-4' : 'box-3'
                    }
                  >
                    ด้านการเศรษฐกิจ
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/PlanData/PlanManagement">
                  <div
                    className={
                      getBasename1[2] === 'PlanManagement' ? 'box-4' : 'box-3'
                    }
                  >
                    ด้านการดำเนินงานอื่น
                  </div>
                </Link>
              </Grid>
            </Grid>
          ) : (
            ''
          )}

          {getBasename1[1] === 'IncomeData' ? (
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Link to="/IncomeData/IncomeSelf">
                  <div
                    className={
                      getBasename1[2] === 'IncomeSelf' ? 'box-4' : 'box-3'
                    }
                  >
                    ประเภท รายได้จัดเก็บเอง
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={4}>
                <Link to="/IncomeData/IncomeGovCollect">
                  <div
                    className={
                      getBasename1[2] === 'IncomeGovCollect' ? 'box-4' : 'box-3'
                    }
                  >
                    ประเภท รายได้ที่รัฐบาลเก็บ
                    แล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={4}>
                <Link to="/IncomeData/IncomeGovSupport">
                  <div
                    className={
                      getBasename1[2] === 'IncomeGovSupport' ? 'box-4' : 'box-3'
                    }
                  >
                    ประเภท รายได้ที่รัฐบาลอุดหนุน
                    แล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น
                  </div>
                </Link>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
          {getBasename1[1] === 'IndicatorData' ? (
            <Grid container spacing={2}>
              {/* <Grid item xs={false} md={3}></Grid> */}
              <Grid item xs={6} md={3}>
                <Link to="/IndicatorData/Internal">
                  <div
                    className={
                      getBasename1[2] === 'Internal' ? 'box-4' : 'box-3'
                    }
                  >
                    ตัวชี้วัดภายใน
                  </div>
                </Link>
              </Grid>
              <Grid item xs={6} md={3}>
                <Link to="/IndicatorData/External">
                  <div
                    className={
                      getBasename1[2] === 'External' ? 'box-4' : 'box-3'
                    }
                  >
                    ตัวชี้วัดภายนอก
                  </div>
                </Link>
              </Grid>
              {/* <Grid item xs={false} md={3}></Grid> */}
            </Grid>
          ) : (
            ''
          )}
          <div className="mb-3"></div>
          {children}
        </div>
      </Tag>
    </>
  );
};

Page5.propTypes = {
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
Page5.defaultProps = {
  tag: 'div',
  title: '',
};

export default Page5;
