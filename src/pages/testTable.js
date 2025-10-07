import moment from 'moment'; // Example for onSort prop
import React from 'react'; // Import React
import { render } from 'react-dom'; // Import render method
import Datatable from 'react-bs-datatable'; // Import this package
import Page from 'components/Page';
import Testtable from './testTable1';
// In your render method
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
} from 'reactstrap';
export default class TablePage extends React.Component {
  render() {
    return (
      <Page
        title="BudgetSouce"
        breadcrumbs={[{ name: 'BudgetSouce', active: true }]}
        className="TablePage"
      >
        <Row>
          <Col>
            <Testtable />
          </Col>
        </Row>
      </Page>
    );
  }
}
// export default TablePage;
