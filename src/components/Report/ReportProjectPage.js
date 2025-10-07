import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';

import { Breadcrumb, BreadcrumbItem, Col, Input, Row } from 'reactstrap';
// import Link from '@material-ui/core/Link';
import { Link, NavLink } from 'react-router-dom';

import {
  Button,
  Card,
  CardContent,
  Fab,
  Grid,
  Icon,
  LinearProgress,
  Tooltip,
  styled,
} from '@material-ui/core';
import Typography from '../Typography';
import { Doughnut } from 'react-chartjs-2';

const bem = bn.create('page');

const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
  height: 20,
  borderRadius: 10,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

const ReportProjectPage = ({
  title,
  id,
  projectName,
  projectDetail,
  revenue_type_category,
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
        <div className="box-1 mb-2">ข้อมูลการรายงานผลปฏิบัติงาน</div>

        {/* header หัวข้อ ช่องค้นหา */}
        <div className="box-2">
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <div style={{ textAlign: 'left' }}>
                <div className={bem.e('header')}>
                  {title && typeof title === 'string' ? (
                    <Typography type="h5" className={bem.e('title') + ''}>
                      ข้อมูลการรายงานผลปฏิบัติงาน
                    </Typography>
                  ) : (
                    title
                  )}
                </div>
                <div className="flex">
                  <NavLink to="/ReportActivities" className="mr-2">
                    {'รายงานผลปฏิบัติงาน'}
                  </NavLink>
                  {' > ข้อมูลการรายงานผลปฏิบัติงาน > '}
                  {projectName}
                </div>
              </div>
            </Grid>
          </Grid>
          <hr />
          <div className="box-card" style={{ textAlign: 'left' }}>
            <div className="box-card-body-1">
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{ alignItems: 'center', display: 'flex' }}
                >
                  <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: '600' }}>
                      ความก้าวหน้ารวมของโครงการ
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <BorderLinearProgress
                          variant="determinate"
                          value={parseFloat(projectDetail.project_progress)}
                          colors="#172189"
                        />
                      </div>
                      <div className="col-3">
                        <div
                          style={{ justifyContent: 'center', display: 'flex' }}
                        >
                          <span
                            style={{
                              backgroundColor: '#172189',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              paddingLeft: '12px',
                              paddingRight: '12px',
                              textOverflow: 'ellipsis',
                              borderRadius: '10px',
                              color: '#ffffff',
                              fontSize: '16px',
                              alignItems: 'center',
                              display: 'flex',
                              width: 'fit-content',
                            }}
                          >
                            {parseFloat(projectDetail.project_progress).toFixed(
                              2,
                            ) + '%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontWeight: '600' }}>
                      ยอดงบประมาณที่ใช้ไปของโครงการ{' '}
                      {Intl.NumberFormat().format(
                        projectDetail.project_used_budget,
                      )}{' '}
                      บาท
                    </div>
                    <div className="row">
                      <div className="col-9">
                        <BorderLinearProgress
                          variant="determinate"
                          value={parseFloat(projectDetail.budget_progress)}
                          colors="#22AA99"
                        />
                      </div>
                      <div className="col-3">
                        <div
                          style={{ justifyContent: 'center', display: 'flex' }}
                        >
                          <span
                            style={{
                              backgroundColor: '#22AA99',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              paddingLeft: '12px',
                              paddingRight: '12px',
                              textOverflow: 'ellipsis',
                              borderRadius: '10px',
                              color: '#ffffff',
                              fontSize: '16px',
                              alignItems: 'center',
                              display: 'flex',
                              width: 'fit-content',
                            }}
                          >
                            {parseFloat(projectDetail.budget_progress).toFixed(
                              2,
                            ) + '%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <div>
                    <div
                      className="row col-12"
                      style={{ justifyContent: 'center', margin: '0' }}
                    >
                      <div
                        style={{
                          width: '200px',
                          //height: '100%',
                          alignItems: 'center',
                          display: 'flex',
                        }}
                      >
                        <Doughnut
                          width={200}
                          height={200}
                          options={{
                            legend: {
                              display: false,
                              position: 'bottom',
                            },
                            cutoutPercentage: 60,
                            responsive: true,
                            maintainAspectRatio: true,
                          }}
                          data={{
                            labels: ['ยอดเงินคงเหลือ', 'ยอดเงินที่ใช้ไป'],
                            datasets: [
                              {
                                data: [
                                  parseFloat(
                                    projectDetail.project_total_budget,
                                  ) -
                                    parseFloat(
                                      projectDetail.project_used_budget,
                                    ),
                                  parseFloat(projectDetail.project_used_budget),
                                ],
                                backgroundColor: ['#99cc66', '#22AA99'],
                                borderWidth: 1,
                              },
                            ],
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: '600' }}>
                      ยอดงบประมาณ{' '}
                      <span style={{ color: '#99cc66' }}>
                        {Intl.NumberFormat().format(
                          projectDetail.project_total_budget,
                        )}
                      </span>{' '}
                      บาท
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: '600' }}>
                      ประเภท :{' '}
                      {parseInt(revenue_type_category) === 1
                        ? 'รายได้จัดเก็บเอง'
                        : ''}
                      {parseInt(revenue_type_category) === 2
                        ? 'รายได้ที่รัฐบาลเก็บแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น'
                        : ''}
                      {parseInt(revenue_type_category) === 3
                        ? 'รายได้ที่รัฐบาลอุดหนุนแล้วจัดสรรให้องค์กรปกครองส่วนท้องถิ่น'
                        : ''}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          <hr />
          <Grid container spacing={2} className="mt-2">
            <Grid item xs={6} md={3}>
              <Link to={`/ReportActivities/ReportDetail1/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'ReportDetail1' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลหลัก
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/ReportActivities/ReportDetail2/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'ReportDetail2' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลกิจกรรม
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/ReportActivities/ReportDetail3/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'ReportDetail3' ? 'box-8' : 'box-7'
                  }
                >
                  ข้อมูลตัวชี้วัด
                </div>
              </Link>
            </Grid>
            <Grid item xs={6} md={3}>
              <Link to={`/ReportActivities/ReportDetail4/${id}`}>
                <div
                  className={
                    getBasename1[2] === 'ReportDetail4' ? 'box-8' : 'box-7'
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

ReportProjectPage.propTypes = {
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
ReportProjectPage.defaultProps = {
  tag: 'div',
  title: '',
};

export default ReportProjectPage;
