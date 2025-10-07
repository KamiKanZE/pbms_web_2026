import Page9 from 'components/Page9';
import axios from 'axios';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Progress,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Input,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  ButtonGroup,
  DropdownMenu,
  keyword,
} from 'reactstrap';
// import PlanList from 'components/Plan/PlanList';
// import BudgetList from '../../components/ReportBudget/ReBudgetList';
// import KPIDataList from '../../components/KPIDataManagement/KPIDataList';
// import KPIDataDetailList from '../../components/KPIDataManagement/KPIDataDetailList';
// import KPIDataDetailList2 from '../../components/KPIDataManagement/KPIDataDetailList2';
import KPIDataDetailList2_1 from '../../components/KPIDataManagement/KPIDataDetailList2_1';
import { name } from 'faker/lib/locales/az';

function Data({ page, data, year, name }) {
  return (
    <Page9 title="ตัวชี้วัด KPI2 ข้อมูลนโยบายนายก ตามประเภทของ KPI" breadcrumbs={[{ name: 'ข้อมูลตัวชี้วัด KPI', active: true }]} className="Plan1" id={page} name={name} year={year}>
      <Row>
        <Col>
          <KPIDataDetailList2_1 id={page} data={data} page={page} year={year} title="ตัวชี้วัด KPI" />
        </Col>
      </Row>
    </Page9>
  );
}

// export default Plan1;
export default class KPIDataDetailProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      data: [],
    };
  }
  getKpiType = e => {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/projects/list?page=1&size=10&year=' + this.props.match.params.year + '&project_policy=' + this.props.match.params.id).then(res => {
       let data = [];
      if (res.result && res.result.result) {
        data = res.result.result;
      }
      if (Array.isArray(data) && data.length > 0) {
        const { policy_id, project_policy_name } = data[0];
        this.setState({
          data,
          name: project_policy_name,
        });
      }
    });
  };
  componentDidMount() {
    this.getKpiType();
  }
  render() {
    let page = this.props.match.params.id;
    let year = this.props.match.params.year;
    return <Data page={page} data={this.state.data} year={year} name={this.state.name} />;
  }
}
