// import React from 'react';
// import FormAdd from 'components/DataBudget/Add';
// import List from 'components/DataBudget/List';
// import Page from 'components/Page';
// import {
//   Col,
//   Row,
//   Card,
//   CardBody,
//   CardHeader,
//   Table,
//   Modal,
//   ModalBody,
//   ModalFooter,
//   ModalHeader,
// } from 'reactstrap';
// import { FormGroup, Fab, Button } from '@material-ui/core';
// import Icon from '@material-ui/core/Icon';
// import Tooltip from '@material-ui/core/Tooltip';
// //import BudgetSouceList from 'components/BudgetSource/BudgetSouceList';
// class Budgetsource extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     this.state = {
//       refreshing: false,
//       modal: false,
//     };
//   }
//   componentDidMount() {
//     this.toggle();
//   }
//   toggle = modalType => () => {
//     if (!modalType) {
//       return this.setState({
//         modal: !this.state.modal,
//       });
//     }

//     this.setState({
//       [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
//     });
//   };
//   // handleReset = () => {
//   //   this.setState({
//   //     plan_id: '',
//   //     plan_name: '',
//   //   });
//   // };

//   // const Budgetsouce = () => {
//   //   return (
//   //     <Page
//   //       title="ข้อมูลแหล่งงบประมาณ(ผลผลิต)"
//   //       breadcrumbs={[{ name: 'ข้อมูลแหล่งงบประมาณ(ผลผลิต)', active: true }]}
//   //       className="Budgetsouce"
//   //     >
//   //       <Row>
//   //         <Col>
//   //             <BudgetSouceList />
//   //         </Col>
//   //       </Row>
//   // </Page>
//   //   );
//   // };

//   // export default Budgetsouce;
//   render() {
//     return (
//       <Page
//         title="ข้อมูลแหล่งงบประมาณ(ผลผลิต)"
//         breadcrumbs={[{ name: 'ข้อมูลแหล่งงบประมาณ(ผลผลิต)', active: true }]}
//         className="Budgetsouce1"
//       >
//         {/* <Modal isOpen={this.state.modal} className={this.props.className}>
//         <ModalHeader>เพิ่มข้อมูลแผนงาน</ModalHeader>
//         <ModalBody />
//       </Modal> */}
//         <Row>
//           <Col>
//             <Card className="mb-12">
//               <Col style={{ textAlign: 'right' }}>
//                 <Tooltip title="Add">
//                   <Fab
//                     className="btn_not_focus"
//                     onClick={this.toggle()}
//                     color="primary"
//                   >
//                     <Icon>add</Icon>
//                   </Fab>
//                 </Tooltip>
//               </Col>
//               <CardBody>
//                 <Row>
//                   <Col xl={8} lg={8} md={8} />
//                   <Col xl={12} lg={12} md={12}>
//                     <Table responsive bordered striped hover>
//                       <thead>
//                         <tr>
//                           {/* <th>No.</th> */}
//                           <th>BudgetSourceID</th>
//                           <th>BudgetSourceName</th>
//                           <th />
//                         </tr>
//                       </thead>
//                       <List />
//                     </Table>
//                   </Col>
//                 </Row>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//         <Modal
//           isOpen={this.state.modal}
//           toggle={this.toggle()}
//           className={this.props.className}
//         >
//           <ModalHeader toggle={this.toggle()}>
//             เพิ่มข้อมูลแหล่งงบประมาณ(ผลผลิต)
//           </ModalHeader>
//           <ModalBody>
//             <FormAdd {...this.state} />
//           </ModalBody>
//         </Modal>
//       </Page>
//     );
//   }
// }

// export default Budgetsource;

import Page from 'components/Page';
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
import BudgetSourceList from 'components/BudgetSource/BudgetSouceList';

function Budgetsource1({page}) {
  return (
    <Page
      title="ข้อมูลแหล่งงบประมาณ(ผลผลิต)"
      breadcrumbs={[{ name: 'ข้อมูลแหล่งงบประมาณ(ผลผลิต)', active: true }]}
      className="Budgetsource1"
    >
      <Row>
        <Col>
          <BudgetSourceList  page={page}/>
        </Col>
      </Row>
    </Page>
  );
};

// export default Budgetsource;
export default class Budgetsource extends React.Component {
  render() {
    let page = this.props.match.params.id;
    return <Budgetsource1 page={page} />;
  }
}