import React, { useRef } from 'react';
import { Row, Col, Table } from 'reactstrap';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';

export default function ExportBudget({ summary, projects, reportSucess, year }) {
  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `ข้อมูลงบประมาณ ${moment().format('DD/MM')}/${moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543}`,
    sheet: 'ข้อมูลงบประมาณ',
  });
  const initialState = {
    project: 0,
    budget: 0.00,
    project0: 0,
    budget0: 0.00,
    project1: 0,
    budget1: 0.00,
    project2: 0,
    budget2: 0.00,
    project3: 0,
    budget3: 0.00,
  };
  const totals = Object.keys(summary || {}).reduce((acc, key) => {
    const { summary_total_projects, summary_total_project_budget } = summary[key];
    acc.project += summary_total_projects;
    acc.budget += summary_total_project_budget;
    if (['project_status_1', 'project_status_3'].includes(key)) {
      acc.project0 += summary_total_projects;
      acc.budget0 += summary_total_project_budget;
    } else if (key === 'project_status_2') {
      acc.project1 += summary_total_projects;
      acc.budget1 += summary_total_project_budget;
    } else if (['project_status_0', 'project_status_5'].includes(key)) {
      acc.project2 += summary_total_projects;
      acc.budget2 += summary_total_project_budget;
    } else if (key === 'project_status_4') {
      acc.project3 += summary_total_projects;
      acc.budget3 += summary_total_project_budget;
    }
    return acc;
  }, initialState);

  const formatMoney = amount => {
    return amount === 0 ? '0.00' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  const totalsAdditional = projects.reduce((acc, project) => {
    const reportTotals = reportSucess.find(r => r.department_id === project.department_id) || {};
    acc.project01 += reportTotals.total_project_send_inventory || 0;
    acc.budget01 += reportTotals.total_project_progress_budget || 0;
    return acc;
  }, { project01: 0, budget01: 0.0 });
  return (
    <Row className="m-0">
      <div className="box-17 ml-2" onClick={onDownload} style={{ textWrap: 'nowrap' }}>
        ข้อมูลงบประมาณ Excel
      </div>
      <div ref={tableRef} sm={12} className="p-0" style={{ display: 'none' }}>
        <Col sm={12}>
          <Table responsive borderless id="table1" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th rowSpan={3} style={{ border: '1px solid black', textAlign: 'center' }}>
                  หน่วยงาน
                </th>
                <th colSpan={12} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการ / ครุภัณฑ์ ตามแผนดำเนินงาน ประจำปีงบประมาณ พ.ศ. {year}
                </th>
              </tr>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่ตั้งงบประมาณไว้
                </th>
                <th colSpan={4} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่ดำเนินการแล้ว
                </th>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่อยู่ระหว่างดำเนินการ
                </th>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่ยังไม่ได้ดำเนินการ
                </th>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่ขอยกเลิก
                </th>
              </tr>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>จำนวน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินงบประมาณ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>จำนวน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินงบประมาณ</th>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  {'ส่งคลังและเบิกจ่ายแล้ว ข้อมูล ณ วันที่' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543)}
                </th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>จำนวน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินงบประมาณ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>จำนวน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินงบประมาณ</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>จำนวน</th>
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินงบประมาณ</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                projects.sort((a, b) => a.department_name.localeCompare(b.department_name))
                  .map((project, i) => {
                    const data = project.projects_by_status;
                    const reportTotals = reportSucess.find(r => r.department_id === project.department_id) || {};
                    const additionalTotals = {
                      project01: reportTotals.total_project_send_inventory || 0,
                      budget01: reportTotals.total_project_progress_budget || 0,
                    };
                    const projectTotals = Object.keys(data).reduce(
                      (acc, key) => {
                        const numericKey = Number(key); // แปลง key เป็นตัวเลข
                        const { total_projects, total_project_budget } = data[key];
                  
                        acc.total_projects += total_projects;
                        acc.total_project_budget += total_project_budget;
                  
                        if ([1, 3].includes(numericKey)) {
                          acc.total_projects0 += total_projects;
                          acc.total_project_budget0 += total_project_budget;
                        } else if (numericKey === 2) {
                          acc.total_projects1 += total_projects;
                          acc.total_project_budget1 += total_project_budget;
                        } else if ([0, 5].includes(numericKey)) {
                          acc.total_projects2 += total_projects;
                          acc.total_project_budget2 += total_project_budget;
                        } else if (numericKey === 4) {
                          acc.total_projects3 += total_projects;
                          acc.total_project_budget3 += total_project_budget;
                        }
                        return acc;
                      },
                      {
                        total_projects: 0,
                        total_project_budget: 0.0,
                        total_projects0: 0,
                        total_project_budget0: 0.0,
                        total_projects1: 0,
                        total_project_budget1: 0.0,
                        total_projects2: 0,
                        total_project_budget2: 0.0,
                        total_projects3: 0,
                        total_project_budget3: 0.0,
                      }
                    );
                    return (
                      <tr key={i}>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{project.department_name}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{projectTotals.total_projects}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{formatMoney(projectTotals.total_project_budget)}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{projectTotals.total_projects0}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{formatMoney(projectTotals.total_project_budget0)}</td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                            backgroundColor: '#c3c3c3',
                          }}
                        >
                          {additionalTotals.project01 > 0 ? additionalTotals.project01 : '-'}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                            backgroundColor: '#c3c3c3',
                          }}
                        >
                          {additionalTotals.budget01 > 0 ? formatMoney(additionalTotals.budget01) : '-'}
                        </td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{projectTotals.total_projects1}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{formatMoney(projectTotals.total_project_budget1)}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{projectTotals.total_projects2}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{formatMoney(projectTotals.total_project_budget2)}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{projectTotals.total_projects3}</td>
                        <td style={{ border: '1px solid black', textAlign: 'center' }}>{formatMoney(projectTotals.total_project_budget3)}</td>
                      </tr>
                    );
                  })
              )}
              <tr style={{ backgroundColor: '#84ff88' }}>
                <th style={{ textAlign: 'center' }}>รวมทั้งสิ้น</th>
                <th style={{ textAlign: 'center' }}>{totals.project}</th>
                <th style={{ textAlign: 'center' }}>{formatMoney(totals.budget)}</th>
                <th style={{ textAlign: 'center' }}>{totals.project0}</th>
                <th style={{ textAlign: 'center' }}>{formatMoney(totals.budget0)}</th>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'gray',
                  }}
                >
                  {totalsAdditional.project01 > 0 ? totalsAdditional.project01 : '-'}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'gray',
                  }}
                >
                  {totalsAdditional.budget01 > 0 ? formatMoney(totalsAdditional.budget01) : '-'}
                </td>
                <th style={{ textAlign: 'center' }}>{totals.project1}</th>
                <th style={{ textAlign: 'center' }}>{formatMoney(totals.budget1)}</th>
                <th style={{ textAlign: 'center' }}>{totals.project2}</th>
                <th style={{ textAlign: 'center' }}>{formatMoney(totals.budget2)}</th>
                <th style={{ textAlign: 'center' }}>{totals.project3}</th>
                <th style={{ textAlign: 'center' }}>{formatMoney(totals.budget3)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </div>
    </Row>
  );
}
