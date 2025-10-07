import React, { useRef } from 'react';
import { Col, Row, Table } from 'reactstrap';
import { useDownloadExcel } from 'react-export-table-to-excel';
import moment from 'moment';
export default function ExportBudget(e) {
  const tableRef = useRef(null);
  const tableRef1 = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'ข้อมูลงบประมาณ ' + moment().format('DD/MM') + '/' + (moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543),
    sheet: 'ข้อมูลงบประมาณ',
  });
  function moneyFormat(e) {
    return e === 0 ? '0.00' : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e);
  }
  let sumaryproject0 = 0;
  let sumaryproject01 = 0;
  let sumaryproject1 = 0;
  let sumaryproject2 = 0;
  let sumaryproject3 = 0;
  let sumarybudget0 = 0;
  let sumarybudget01 = 0;
  let sumarybudget1 = 0;
  let sumarybudget2 = 0;
  let sumarybudget3 = 0;
  let sumaryproject = 0;
  let sumarybudget = 0;
  if (e.summary) {
    for (let y in e.summary) {
      sumarybudget = sumarybudget + e.summary[y].summary_total_project_budget;
      sumaryproject = sumaryproject + e.summary[y].summary_total_projects;
      if (y == 'project_status_1' || y == 'project_status_3') {
        sumaryproject0 = sumaryproject0 + e.summary[y].summary_total_projects;
        sumarybudget0 = sumarybudget0 + e.summary[y].summary_total_project_budget;
      }
      if (y == 'project_status_2') {
        sumaryproject1 = sumaryproject1 + e.summary[y].summary_total_projects;
        sumarybudget1 = sumarybudget1 + e.summary[y].summary_total_project_budget;
      }

      if (y == 'project_status_0' || y == 'project_status_5') {
        sumaryproject2 = sumaryproject2 + e.summary[y].summary_total_projects;
        sumarybudget2 = sumarybudget2 + e.summary[y].summary_total_project_budget;
      }

      if (y == 'project_status_4') {
        sumaryproject3 = sumaryproject3 + e.summary[y].summary_total_projects;
        sumarybudget3 = sumarybudget3 + e.summary[y].summary_total_project_budget;
      }
    }
  }
  return (
    <Row className="m-0">
      <div className="box-17 ml-2" onClick={onDownload} style={{ textWrap: 'nowrap' }}>
        ข้อมูลงบประมาณ Excel
      </div>
      <div ref={tableRef} sm={12} className="p-0" style={{ display: 'none' }}>
        <Col sm={12}>
          {/* <Card className="mb-12">
            <CardBody> */}
          <Table responsive borderless id="table1" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th rowSpan={3} style={{ border: '1px solid black', textAlign: 'center' }}>
                  หน่วยงาน
                </th>
                <th colSpan={12} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการ / ครุภัณฑ์ ตามแผนดำเนินงาน ประจำปีงบประมาณ พ.ศ. {e.year}
                </th>
              </tr>
              <tr style={{ backgroundColor: 'rgb(224, 236, 250)' }}>
                <th colSpan={2} style={{ border: '1px solid black', textAlign: 'center' }}>
                  โครงการที่ตั้งงบประมาณไว้
                </th>
                {/* <th>BudgetSouceID</th> */}
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
                <th style={{ border: '1px solid black', textAlign: 'center' }}>เงินเบิกจ่าย</th>
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
              {e.projects.length == 0 ? (
                <tr>
                  <td colSpan="7" align="center">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                e.projects
                  .sort((a, b) => (a.department_id > b.department_id ? -1 : 1))
                  .map((id, i) => {
                    let data = id.projects_by_status;
                    let total_projects = 0;
                    let total_project_budget = 0;
                    let total_projects0 = 0;
                    let total_projects01 = 0;
                    let total_projects1 = 0;
                    let total_projects2 = 0;
                    let total_projects3 = 0;
                    let total_project_budget0 = 0;
                    let total_project_budget01 = 0;
                    let total_project_budget1 = 0;
                    let total_project_budget2 = 0;
                    let total_project_budget3 = 0;
                    if (e.reportSucess.length > 0) {
                      const check = e.reportSucess.find(element => element.department_id == id.department_id);
                      if (check) {
                        // check.map((item) => {
                        // total_projects0 = check.total_projects
                        // total_project_budget0 = check.total_used_budget
                        total_projects01 = check.total_project_send_inventory;
                        total_project_budget01 = check.total_project_progress_budget;
                        // sumaryproject0 = sumaryproject0+check.total_projects
                        // sumarybudget0 = sumarybudget0+check.total_used_budget
                        sumaryproject01 = sumaryproject01 + check.total_project_send_inventory;
                        sumarybudget01 = sumarybudget01 + check.total_project_progress_budget;
                        // })
                      }
                    }
                    for (let x in data) {
                      total_projects = total_projects + data[x].total_projects;
                      total_project_budget = total_project_budget + data[x].total_project_budget;
                      if (x == 1 || x == 3) {
                        total_projects0 = total_projects0 + data[x].total_projects;
                        total_project_budget0 = total_project_budget0 + data[x].total_project_budget;
                      }
                      if (x == 2) {
                        total_projects1 = total_projects1 + data[x].total_projects;
                        total_project_budget1 = total_project_budget1 + data[x].total_project_budget;
                      }

                      if (x == 0 || x == 5) {
                        total_projects2 = total_projects2 + data[x].total_projects;
                        total_project_budget2 = total_project_budget2 + data[x].total_project_budget;
                      }

                      if (x == 4) {
                        total_projects3 = total_projects3 + data[x].total_projects;
                        total_project_budget3 = total_project_budget3 + data[x].total_project_budget;
                      }
                    }
                    return (
                      <tr key={'table' + i}>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {id.department_name}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {total_projects}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {moneyFormat(total_project_budget)}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {total_projects0}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {moneyFormat(total_project_budget0)}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                            backgroundColor: 'gray',
                          }}
                        >
                          {total_projects01 > 0 ? total_projects01 : '-'}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                            backgroundColor: 'gray',
                          }}
                        >
                          {total_project_budget01 > 0 ? moneyFormat(total_project_budget01) : '-'}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {total_projects1}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {moneyFormat(total_project_budget1)}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {total_projects2}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {moneyFormat(total_project_budget2)}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {total_projects3}
                        </td>
                        <td
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                          }}
                        >
                          {moneyFormat(total_project_budget3)}
                        </td>
                      </tr>
                    );
                  })
              )}
              <tr style={{ backgroundColor: '##0099ff' }}>
                <th style={{ textAlign: 'center' }}>รวมทั้งสิ้น</th>
                <th style={{ textAlign: 'center' }}>{sumaryproject}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(sumarybudget)}</th>
                <th style={{ textAlign: 'center' }}>{sumaryproject0}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(sumarybudget0)}</th>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'gray',
                  }}
                >
                  {sumaryproject01 > 0 ? sumaryproject01 : '-'}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    textAlign: 'center',
                    backgroundColor: 'gray',
                  }}
                >
                  {sumarybudget01 > 0 ? moneyFormat(sumarybudget01) : '-'}
                </td>
                <th style={{ textAlign: 'center' }}>{sumaryproject1}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(sumarybudget1)}</th>
                <th style={{ textAlign: 'center' }}>{sumaryproject2}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(sumarybudget2)}</th>
                <th style={{ textAlign: 'center' }}>{sumaryproject3}</th>
                <th style={{ textAlign: 'center' }}>{moneyFormat(sumarybudget3)}</th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </div>
    </Row>
  );
}
