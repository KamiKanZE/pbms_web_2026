import React from 'react';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {
  Button,
  Col,
  FormGroup,
  Label,
  Row,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  FormText,
} from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { red } from '@material-ui/core/colors';
import { confirmAlert } from 'react-confirm-alert';
const projectStatusLabel = status => {
  let statusText = 'ตรงตามเวลาที่กำหนด';
  switch (Number(status)) {
    case 3:
      statusText = 'เร็วกว่าที่กำหนด';
      break;
    case 2:
      statusText = 'ช้ากว่าที่กำหนด';
      break;
    default:
      statusText = 'ตรงตามเวลาที่กำหนด';
      break;
  }
  return statusText;
};
const token_id = localStorage.getItem('token');
export default class FormProject extends React.Component {
  constructor(props) {
    super(props);
    const id = this.props.project_id.split('&');
    this.state = {
      durationOptions: [
        {
          id: 1,
          label: 'ตรงตามเวลาที่กำหนด',
        },
        { id: 2, label: 'ช้ากว่าที่กำหนด' },
        {
          id: 3,
          label: 'เร็วกว่าที่กำหนด',
        },
      ],
      id: id[0],
      id1: id[1],
      PlanOptions: [],
      BudgetOptions: [],
      MainActivitiesOptions: [],
      SubAOptions: [],
      SubBOptions: [],
      NationPlanOptions: [],
      ProjectTypeOptions: [],
      BudgetTypeOptions: [],
      ProjectResponsePersonOptions: [],
      plan_id: '',
      plan_name: '',
      SelectedPlanOptions: [],
      PlanDataError: '',
      budget_source_id: '',
      budget_source_name: '',
      BudgetDataError: '',
      main_plan_id: '',
      main_plan_name: '',
      MainActivityDataError: '',
      sub_plan_A_id: '',
      sub_plan_A_name: '',
      SubplanADataError: '',
      sub_plan_B_id: '',
      sub_plan_B_name: '',
      SubplanBDataError: '',
      nation_plan_id: '',
      nation_plan_name: '',
      project_type: [],
      budget_type_id: '',
      budget_type_name: '',
      project_name: '',
      ProjectNameError: '',
      project_reason: '',
      ProjectReasonError: '',
      project_objective: '',
      projectObjecttiveError: '',
      project_target: '',
      project_targetError: '',
      project_total_budget: '',
      ProjectBudgetError: '',
      project_response_persons: [],
      selected_response_persons: [],
      ProjectOwnerError: '',
      project_status: '',
      project_note: '',
    };
  }

  validate = () => {
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let emptyText = 'กรุณากรอกข้อมูลให้ครบถ้วน';
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      PlanDataError: '',
      BudgetDataError: '',
      MainActivityDataError: '',
      ProjectNameError: '',
      SubplanADataError: '',
      SubplanBDataError: '',
      ProjectReasonError: '',
      projectObjecttiveError: '',
      project_targetError: '',
      ProjectBudgetError: '',
      ProjectOwnerError: '',
      NationPlanError: '',
      ProjectTypeError: '',
      BudgetTypeError: '',
      project_noteError: '',
      project_statusError: '',
    };

    if (
      this.state.nation_plan_id.length <= 0 &&
      this.state.nation_plan_name.length <= 0
    ) {
      isError = true;
      errors.NationPlanError = emptyText;
    }

    if (
      this.state.budget_type_id.length <= 0 &&
      this.state.budget_type_name.length <= 0
    ) {
      isError = true;
      errors.BudgetTypeError = emptyText;
    }

    if (this.state.project_name.length <= 0) {
      isError = true;
      errors.ProjectNameError = emptyText;
    }

    const newvalue = this.state.project_total_budget.replace(/,/g, '');
    if (newvalue.length <= 0) {
      isError = true;
      errors.ProjectBudgetError = emptyText;
    } else if (!newvalue.match(regexp)) {
      isError = true;
      errors.ProjectBudgetError = numberText;
    }

    if (this.state.project_response_persons.length <= 0) {
      isError = true;
      errors.ProjectOwnerError = emptyText;
    }

    if (this.state.plan_id.length <= 0 && this.state.plan_name.length <= 0) {
      isError = true;
      errors.PlanDataError = emptyText;
    }

    if (
      this.state.budget_source_id.length <= 0 &&
      this.state.budget_source_name.length <= 0
    ) {
      isError = true;
      errors.BudgetDataError = emptyText;
    }

    if (
      this.state.main_plan_id.length <= 0 &&
      this.state.main_plan_name.length <= 0
    ) {
      isError = true;
      errors.MainActivityDataError = emptyText;
    }

    if (
      this.state.sub_plan_A_id.length <= 0 &&
      this.state.sub_plan_A_name.length <= 0
    ) {
      isError = true;
      errors.SubplanADataError = emptyText;
    }

    if (
      this.state.sub_plan_B_id.length <= 0 &&
      this.state.sub_plan_B_name.length <= 0
    ) {
      isError = true;
      errors.SubplanBDataError = emptyText;
    }
    if (this.state.project_status.length <= 0) {
      isError = true;
      errors.project_statusError = emptyText;
    }
    if (this.state.project_status == 2) {
      if (this.state.project_note == null || this.state.project_note <= 0) {
        isError = true;
        errors.project_noteError = emptyText;
        // this.project_note.focus();
      }
    }
    this.setState({
      ...this.state,
      ...errors,
    });

    return isError;
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      [e.target.id]: '',
    });
  };

  handleSelectChange(id, name, e) {
    // this.props.onChange({ [e.target.name]: e.target.value });;
    if (id == 'plan_id' && e.length != '') {
      this.setState({
        PlanDataError: '',
      });
    }
    if (id == 'sub_plan_B_id' && e.length != '') {
      this.setState({
        SubplanBDataError: '',
        sub_plan_B: '',
      });
    }
    if (id == 'nation_plan_id' && e.length != '') {
      this.setState({
        NationPlanError: '',
      });
    }
    if (id == 'budget_type_id' && e.length != '') {
      this.setState({
        BudgetTypeError: '',
      });
    }
    if (e[0] != undefined) {
      this.setState({
        [id]: e[0].id,
        [name]: e[0].label,
      });
    } else {
      this.setState({
        [id]: '',
        [name]: '',
      });
    }
  }
  handleInputChange1 = e => {
    //$('#ss').val(commaSeparateNumber(e.target.value));
    // let ss = e.target.value.toString()
    let isError = false;
    const regexp = '^(0|[1-9][0-9]*)$'; //numberic
    let numberText = 'กรุณากรอกเฉพาะตัวเลข';
    const errors = {
      ProjectBudgetError: '',
    };
    const newvalue = e.target.value.replace(/,/g, '');
    if (!String(newvalue).match(regexp)) {
      isError = true;
      errors.ProjectBudgetError = numberText;
      const valuewithcomma = '';
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    } else {
      // isError = false;
      const valuewithcomma = Number(newvalue).toLocaleString('en');
      this.setState({
        ...errors,
        [e.target.name]: valuewithcomma,
      });
    }
    //let ss = commaSeparateNumber(e.target.value);
    //let numz = Number(ss).toLocaleString('en'); // "10,000"

    return isError;
  };
  handleProjectSelectChange(e) {;
    if (e.length != '') {
      this.setState({ ProjectTypeError: '' });
    }
    const selected = e.map(data => {
      return {
        project_type_id: data.project_type_id,
        project_type_name: data.project_type_name,
      };
    });
    this.setState({ project_type: [] });
    this.setState(prevState => ({
      project_type: prevState.project_type.concat(selected),
    }));
  }

  handlePersonSelectChange(e) {;
    const selected = e.map(data => {
      return {
        person_id: data.person_id,
        person_name: data.person_name,
      };
    });
    this.setState({ project_response_persons: [] });
    this.setState(prevState => ({
      project_response_persons:
        prevState.project_response_persons.concat(selected),
    }));
  }

  onSubmit = e => {
    const err = this.validate();
    if (!err) {
      e.preventDefault();
      const newvalue = this.state.project_total_budget.replace(/,/g, '');
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/' + this.state.id,
          {
            budget_source_id: this.state.budget_source_id,
            budget_source_name: this.state.budget_source_name,
            budget_type_id: this.state.budget_type_id,
            budget_type_name: this.state.budget_type_name,
            main_plan_id: this.state.main_plan_id,
            main_plan_name: this.state.main_plan_name,
            nation_plan_id: this.state.nation_plan_id,
            nation_plan_name: this.state.nation_plan_name,
            plan_id: this.state.plan_id,
            plan_name: this.state.plan_name,
            project_name: this.state.project_name,
            project_objective: this.state.project_objective,
            project_reason: this.state.project_reason,
            project_response_persons: this.state.project_response_persons,
            project_target: this.state.project_target,
            project_total_budget: newvalue,
            project_type: this.state.project_type,
            sub_plan_A_id: this.state.sub_plan_A_id,
            sub_plan_A_name: this.state.sub_plan_A_name,
            sub_plan_B_id: this.state.sub_plan_B_id,
            sub_plan_B_name: this.state.sub_plan_B_name,
            project_status: this.state.project_status,
            project_note: this.state.project_note,
            //  this.state
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(response => {
          // confirmAlert({
          //   //title: 'ยืนยันการลบข้อมูล คุณต้องการจะลบข้อมูลนี้',
          //   message: 'แก้ไขข้อมูลสำเร็จ',
          //   buttons: [
          //     {
          //       label: 'ยืนยัน',
          //     },
          //   ],
          // });
          confirmAlert({
            message: 'แก้ไขข้อมูลสำเร็จ',
            buttons: [],
          });
          setTimeout(
            () => (window.location.href = ' /project1/' + this.state.id1),
            1000,
          );
        })
        .catch(error => {
          throw error;
        });
      // this.props.onSubmit(this.state);

      // clear form

      // this.setState({
      //   ProjectName: '',
      //   ProjectNameError: '',
      //   ProjectReason: '',
      //   ProjectReasonError: '',
      // });
    }
  };

  fetchPlanOptions = () => {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list?page=0&size=0')
      .then(ress => {
        const PlanOptions = ress.data.result.map(id => {
          return { id: id.plan_id, label: id.plan_name };
        });
        this.setState(prevState => ({
          PlanOptions: prevState.PlanOptions.concat(PlanOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchBudgetOptions = () => {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataBudgetSources/list?page=0&size=0',
      )
      .then(ress => {
        const BudgetOptions = ress.data.result.map(id => {
          return { id: id.budget_source_id, label: id.budget_source_name };
        });
        this.setState(prevState => ({
          BudgetOptions: prevState.BudgetOptions.concat(BudgetOptions),
          budget_source: prevState.BudgetOptions.concat(BudgetOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchMainActivitiesOptions(id) {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataMainPlans/budgetsources/' +
          id +
          '?page=0&size=0',
      )
      .then(ress => {
        const MainActivitiesOptions = ress.data.map(id => {
          return { id: id.main_plan_id, label: id.main_plan_name };
        });
        this.setState(prevState => ({
          MainActivitiesOptions: prevState.MainActivitiesOptions.concat(
            MainActivitiesOptions,
          ),
          // main_plan:prevState.MainActivitiesOptions.concat(
          //   MainActivitiesOptions,)
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchSubAOptions(id) {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataSubPlanAs/mainplans/' +
          id +
          '?page=0&size=0',
      )
      .then(ress => {
        const SubAOptions = ress.data.map(id => {
          return { id: id.sub_plan_A_id, label: id.sub_plan_A_name };
        });
        this.setState(prevState => ({
          SubAOptions: prevState.SubAOptions.concat(SubAOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchSubBOptions(id) {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataSubPlanBs/subplanas/' +
          id +
          '?page=0&size=0',
      )
      .then(ress => {
        const SubBOptions = ress.data.map(id => {
          return { id: id.sub_plan_B_id, label: id.sub_plan_B_name };
        });
        this.setState(prevState => ({
          SubBOptions: prevState.SubBOptions.concat(SubBOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchNationPlanOptions() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataNationPlans/list?page=0&size=0',
      )
      .then(ress => {
        const NationPlanOptions = ress.data.result.map(id => {
          return { id: id.nation_plan_id, label: id.nation_plan_name };
        });
        this.setState(prevState => ({
          NationPlanOptions:
            prevState.NationPlanOptions.concat(NationPlanOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchProjectTypeOptions() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataProjectTypes/list?page=0&size=0',
      )
      .then(ress => {
        const ProjectTypeOptions = ress.data.result.map(id => {
          return {
            project_type_id: id._id,
            project_type_name: id.project_type_name,
          };
        });
        this.setState(prevState => ({
          ProjectTypeOptions:
            prevState.ProjectTypeOptions.concat(ProjectTypeOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }
  fetchBudgetTypeOptions() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataBudgetTypes/list?page=0&size=0',
      )
      .then(ress => {
        const BudgetTypeOptions = ress.data.result.map(id => {
          return { id: id.budget_type_id, label: id.budget_type_name };
        });
        this.setState(prevState => ({
          BudgetTypeOptions:
            prevState.BudgetTypeOptions.concat(BudgetTypeOptions),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchProjectResponsePersonOptions() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/users/list?page=0&size=0')
      .then(ress => {
        const ProjectResponsePersonOptions = ress.data.result.map(id => {
          return { person_id: id._id, person_name: id.name };
        });
        this.setState(prevState => ({
          ProjectResponsePersonOptions:
            prevState.ProjectResponsePersonOptions.concat(
              ProjectResponsePersonOptions,
            ),
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchData() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/' + this.state.id)
      .then(res => {
        //  const newvalue =  res.data.project_total_budget.replace(/,/g, '');
        const valuewithcomma = Number(
          res.data.project_total_budget,
        ).toLocaleString('en');
        // let numz = Number(ss).toLocaleString('en');
        // const status
        if (
          res.data.project_status == '' ||
          res.data.project_status == null ||
          res.data.project_status == undefined
        ) {
          res.data.project_status = '2';
        } else {
          res.data.project_status = res.data.project_status;
        }
        let main_plan = [
          {
            id: res.data.main_plan_id,
            label: res.data.main_plan_name,
          },
        ];
        let budget_source = [
          {
            id: res.data.budget_source_id,
            label: res.data.budget_source_name,
          },
        ];
        let sub_plan_A = [
          {
            id: res.data.sub_plan_A_id,
            label: res.data.sub_plan_A_name,
          },
        ];
        let sub_plan_B = [
          {
            id: res.data.sub_plan_B_id,
            label: res.data.sub_plan_B_name,
          },
        ];
        this.setState({
          project_type: res.data.project_type,
          project_response_persons: res.data.project_response_persons,
          plan_id: res.data.plan_id,
          plan_name: res.data.plan_name,
          budget_source_id: res.data.budget_source_id,
          budget_source_name: res.data.budget_source_name,
          main_plan_id: res.data.main_plan_id,
          main_plan_name: res.data.main_plan_name,
          sub_plan_A_id: res.data.sub_plan_A_id,
          sub_plan_A_name: res.data.sub_plan_A_name,
          sub_plan_B_id: res.data.sub_plan_B_id,
          sub_plan_B_name: res.data.sub_plan_B_name,
          nation_plan_id: res.data.nation_plan_id,
          nation_plan_name: res.data.nation_plan_name,
          budget_type_id: res.data.budget_type_id,
          budget_type_name: res.data.budget_type_name,
          project_name: res.data.project_name,
          project_reason: res.data.project_reason,
          project_objective: res.data.project_objective,
          project_target: res.data.project_target,
          project_total_budget: valuewithcomma,
          project_status: res.data.project_status,
          project_note: res.data.project_note,
          main_plan: main_plan,
          budget_source: budget_source,
          sub_plan_A: sub_plan_A,
          sub_plan_B: sub_plan_B,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.fetchPlanOptions();
    this.fetchBudgetOptions();
    this.fetchNationPlanOptions();
    this.fetchProjectTypeOptions();
    this.fetchBudgetTypeOptions();
    this.fetchProjectResponsePersonOptions();
    this.fetchData();
  }

  formSelect = (key, value) => {
    if (value.options[0]) {
      this.setState(prevState => ({
        selected: {
          ...prevState.selected,
          [key]: value.options[0].id,
        },
      }));
      switch (key) {
        case 'MainActivitiesOptions':
          this.setState({
            budget_source_id: value.options[0].id,
            budget_source_name: value.options[0].label,
            // BudgetOptions:[],
            main_plan: [],
            MainActivitiesOptions: [],
            budget_source: '',
            SubAOptions: [],
            SubBOptions: [],

            sub_plan_A: [],
            sub_plan_B: [],
            BudgetDataError: '',
          });
          // this.refs.SubjectTypeahead.getInstance().clear()
          // this.MainActivityData.getInstance().clear();
          // this.SubActivitiesA.getInstance().clear();
          // this.SubActivitiesB.getInstance().clear();
          this.fetchMainActivitiesOptions(value.options[0].id);
          break;
        case 'SubAOptions':
          this.setState({
            main_plan_id: value.options[0].id,
            main_plan_name: value.options[0].label,
            SubAOptions: [],
            SubBOptions: [],
            sub_plan_A: [],
            sub_plan_B: [],
            main_plan: '',
            MainActivityDataError: '',
          });
          // this.SubActivitiesA.getInstance().clear();
          // this.SubActivitiesB.getInstance().clear();
          this.fetchSubAOptions(value.options[0].id);
          break;
        case 'SubBOptions':
          this.setState({
            sub_plan_A_id: value.options[0].id,
            sub_plan_A_name: value.options[0].label,
            SubBOptions: [],
            sub_plan_A: '',
            sub_plan_B: [],
            SubplanADataError: '',
          });
          // this.SubActivitiesB.getInstance().clear();
          this.fetchSubBOptions(value.options[0].id);
          break;
      }
    }
  };
  cancal() {
    window.location.href = '/project1/' + this.state.id1;
  }
  render() {
    const ColoredLine = ({ color }) => (
      <hr
        style={{
          color: color,
          backgroundColor: color,
          height: 5,
        }}
      />
    );
    return (
      <Form>
        <Row>
          <Col xl={3} lg={3} md={3} sm={12}>
            <Label for="Select" sm={12}>
              <b>แผนงาน/กิจกรรม</b>
            </Label>
          </Col>
          <Col xl={8} lg={8} md={8} sm={12}>
            <Label for="ProjectName" sm={12}>
              ชื่อโครงการ <font color={'red'}>*</font>
            </Label>
            <Col sm={12}>
              <FormGroup>
                <Input
                  name="project_name"
                  value={this.state.project_name}
                  onChange={e => this.handleInputChange(e)}
                  placeholder="ชื่อโครงการ"
                  id="ProjectNameError"
                />
                <FormText>
                  <span className="error">{this.state.ProjectNameError}</span>
                </FormText>
              </FormGroup>
            </Col>
            <Label for="" sm={12}>
              ความสำคัญของโครงการ/หลักการและเหตุผล
            </Label>
            <Col sm={12}>
              <Input
                type="textarea"
                name="project_reason"
                placeholder="ความสำคัญของโครงการ/หลักการและเหตุผล"
                rows={5}
                value={this.state.project_reason}
                onChange={e => this.handleInputChange(e)}
              />
            </Col>
            <Label for="Objective" sm={12}>
              วัตถุประสงค์ของโครงการ
            </Label>
            <Col sm={12}>
              <Input
                type="textarea"
                name="project_objective"
                placeholder="วัตถุประสงค์ของโครงการ"
                rows={5}
                onChange={e => this.handleInputChange(e)}
                value={this.state.project_objective}
              />
            </Col>
            <Label for="PlanName" sm={12}>
              ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย
            </Label>
            <Col sm={12}>
              <Input
                type="textarea"
                name="project_target"
                placeholder="ขอบเขตของโครงการ/พื้นที่เป้าหมาย/กลุ่มเป้าหมาย"
                onChange={e => this.handleInputChange(e)}
                rows={5}
                value={this.state.project_target}
              />
            </Col>
            <Label for="Select" sm={12}>
              ประเภทโครงการ{' '}
              <font size="2" color={'red'}>
                * เลือกได้มากกว่า 1 รายการ
              </font>
            </Label>
            <Col sm={12}>
              <Typeahead
                clearButton
                multiple
                labelKey="project_type_name"
                id="project_type"
                name="project_type"
                placeholder="เลือกประเภทโครงการ"
                options={this.state.ProjectTypeOptions}
                onChange={e => this.handleProjectSelectChange(e)}
                selected={this.state.project_type}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.ProjectTypeError}</span>
              </FormText>
            </Col>
          </Col>
        </Row>
        <ColoredLine />
        <Row>
          <Col xl={3} lg={3} md={3} sm={12} />
          <Col xl={8} lg={8} md={8} sm={12}>
            <Label for="Select" sm={12}>
              แผนงาน <font color={'red'}>*</font>
            </Label>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Typeahead
                clearButton
                id="plan_id"
                name="plan_name"
                placeholder="เลือกข้อมูลแผนงาน"
                options={this.state.PlanOptions}
                onChange={e =>
                  this.handleSelectChange('plan_id', 'plan_name', e)
                }
                selected={[
                  { id: this.state.plan_id, label: this.state.plan_name },
                ]}
              />
              <FormText>
                <span className="error">{this.state.PlanDataError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              แหล่งงบประมาณ(ผลผลิต) <font color={'red'}>*</font>
            </Label>
            <Col xl={12} lg={12} md={12} sm={12}>
              <Typeahead
                clearButton
                id="budget_source_id"
                name="budget_source_name"
                placeholder="เลือกข้อมูลแหล่งงบประมาณ(ผลผลิต)"
                options={this.state.BudgetOptions}
                onChange={options => {
                  this.formSelect('MainActivitiesOptions', { options });
                }}
                selected={this.state.budget_source}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.BudgetDataError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              กิจกรรมหลัก <font color={'red'}>*</font>
            </Label>
            <Col sm={12}>
              <Typeahead
                clearButton
                id="MainActivityData"
                name="main_plan_name"
                placeholder="เลือกข้อมูลกิจกรรมหลัก"
                options={this.state.MainActivitiesOptions}
                onChange={options => {
                  this.formSelect('SubAOptions', { options });
                }}
                selected={this.state.main_plan}
              />
              <FormText style={{ color: red }}>
                <span className="error">
                  {this.state.MainActivityDataError}
                </span>
              </FormText>
            </Col>
            <Label for="SubplanA" sm={12}>
              กิจกรรมรอง A <font color={'red'}>*</font>
            </Label>
            <Col sm={12}>
              <Typeahead
                clearButton
                id="SubActivitiesA"
                name="sub_plan_A_name"
                placeholder="เลือกข้อมูลกิจกรรมรอง A"
                options={this.state.SubAOptions}
                onChange={options => {
                  this.formSelect('SubBOptions', { options });
                }}
                selected={this.state.sub_plan_A}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.SubplanADataError}</span>
              </FormText>
            </Col>
            <Label for="SubplanB" sm={12}>
              กิจกรรมรอง B <font color={'red'}>*</font>
            </Label>
            <Col sm={12}>
              <Typeahead
                clearButton
                id="SubActivitiesB"
                name="sub_plan_B_name"
                placeholder="เลือกข้อมูลกิจกรรมรอง B"
                options={this.state.SubBOptions}
                onChange={e =>
                  this.handleSelectChange('sub_plan_B_id', 'sub_plan_B_name', e)
                }
                selected={this.state.sub_plan_B}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.SubplanBDataError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              ยุทธศาสตร์กรม <font color={'red'}>*</font>
            </Label>
            <Col sm={12}>
              <Typeahead
                clearButton
                id="NationPlan"
                name="nation_plan_name"
                placeholder="เลือกข้อมูลยุทธศาสตร์กรม"
                options={this.state.NationPlanOptions}
                onChange={e =>
                  this.handleSelectChange(
                    'nation_plan_id',
                    'nation_plan_name',
                    e,
                  )
                }
                selected={[
                  {
                    id: this.state.nation_plan_id,
                    label: this.state.nation_plan_name,
                  },
                ]}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.NationPlanError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              ประเภทเงินงบประมาณ <font color={'red'}>*</font>
            </Label>
            <Col lg={6} md={6} sm={12}>
              <Typeahead
                clearButton
                id="BudgetType"
                name="budget_type_name"
                placeholder="เลือกข้อมูลประเภทเงินงบประมาณ"
                options={this.state.BudgetTypeOptions}
                onChange={e =>
                  this.handleSelectChange(
                    'budget_type_id',
                    'budget_type_name',
                    e,
                  )
                }
                selected={[
                  {
                    id: this.state.budget_type_id,
                    label: this.state.budget_type_name,
                  },
                ]}
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.BudgetTypeError}</span>
              </FormText>
            </Col>
            <Label for="PlanName" sm={12}>
              งบประมาณรวมทั้งโครงการ <font color={'red'}>*</font>
            </Label>
            <Col lg={6} md={6} sm={12}>
              <InputGroup>
                <Input
                  name="project_total_budget"
                  type="text"
                  onChange={e => this.handleInputChange1(e)}
                  value={this.state.project_total_budget}
                  required
                />
                <InputGroupAddon addonType="append">บาท</InputGroupAddon>
              </InputGroup>
              <FormText style={{ color: red }}>
                <span className="error">{this.state.ProjectBudgetError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              ผู้รายงานผล{' '}
              <font color={'red'} size="2">
                * เลือกได้มากกว่า 1 รายการ
              </font>
            </Label>
            <Col lg={12} md={12} sm={12}>
              <Typeahead
                clearButton
                labelKey="person_name"
                id="ProjectOwner"
                name="project_response_persons"
                placeholder="ผู้รายงานผล"
                options={this.state.ProjectResponsePersonOptions}
                onChange={e => this.handlePersonSelectChange(e)}
                selected={this.state.project_response_persons}
                multiple
              />
              <FormText style={{ color: red }}>
                <span className="error">{this.state.ProjectOwnerError}</span>
              </FormText>
            </Col>
            <Label for="Select" sm={12}>
              เลือกความก้าวหน้าโครงการ{' '}
              <font color={'red'} size="2">
                *
              </font>
            </Label>
            <Col lg={12} md={12} sm={12}>
              <Input
                type="select"
                name="project_status"
                onChange={this.handleInputChange}
                value={this.state.project_status}
                required
              >
                {this.state.durationOptions.map(id => (
                  <option key={id.id} value={id.id}>
                    {id.label}
                  </option>
                ))}
              </Input>
              <FormText style={{ color: red }}>
                <span className="error">{this.state.projectStatusError}</span>
              </FormText>
            </Col>
            {this.state.project_status == 2 ? (
              <div sm={12}>
                <Label for="Select" sm={12}>
                  ปัญหาและอุปสรรค
                  <font color={'red'} size="2">
                    *
                  </font>
                </Label>
                <Col lg={12} md={12} sm={12}>
                  <Input
                    type="textarea"
                    name="project_note"
                    placeholder="ปัญหาและอุปสรรค"
                    onChange={this.handleInputChange}
                    value={this.state.project_note}
                  />
                  <FormText style={{ color: red }}>
                    <span className="error">
                      {this.state.project_noteError}
                    </span>
                  </FormText>
                </Col>
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <ColoredLine />
        <Row>
          <Col xl={3} lg={3} md={3} sm={12} />
          <Col xl={8} lg={8} md={8} sm={12} style={{ textAlign: 'right' }}>
            <FormGroup>
              <Button color="primary" onClick={e => this.onSubmit(e)}>
                บันทึก
              </Button>{' '}
              &nbsp;
              <Button onClick={() => this.cancal()}> ยกเลิก</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
