import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Col, Row, Table, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormFeedback, FormText, Input, Label, Button, FormGroup, keyword } from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, FormControl, Grid, LinearProgress, styled, TextField } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-thai-datepickers';

import 'moment/locale/th';

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
const departmentID = localStorage.getItem('userDepartmentID');
const name = localStorage.getItem('userName');

const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
  height: 7,
  borderRadius: 5,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

const BrowserField = <Input />;

export default class AddProjectMainData extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' || this.props.page == '' || this.props.page == undefined ? (id = 1) : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      ID: '',
      isForm: '',
      data: [],
      selected: id,
      currenpage: id - 1,
      offset: 0,
      perPage: 10,
      keyword: '',
      url: process.env.REACT_APP_SOURCE_URL + '/projects/list',
      projectName: '',
      projectObject: '',
      projectObjectGoal: '',
      projectOutcomeGoal: '',
      projectExpectedBenefit: '',
      projectBenefit: '',
      projectType: '',
      projectTypeName: '',
      projectNationalStrategy: '',
      projectNationalStrategyName: '',
      projectPolicy: '',
      projectPolicyName: '',
      projectMasterplan: '',
      projectMasterplanName: '',
      projectDevelopmentPlan: '',
      projectDevelopmentPlanName: '',
      projectDevelopmentGoal: '',
      projectDevelopmentGoalName: '',
      projectProvinceStrategy: '',
      projectProvinceStrategyName: '',
      projectLocalStrategy: '',
      projectLocalStrategyName: '',
      projectMunicipalityStrategy: '',
      projectMunicipalityStrategyName: '',
      projectPlan: '',
      projectPlanName: '',
      projectRevenueBudgetType: '',
      projectRevenueBudgetTypeName: '',
      projectExpenditureBudgetType: '',
      projectExpenditureBudgetTypeName: '',
      projectNonLivable: '',
      projectNonLivableName: '',
      projectSmartCity: '',
      projectSmartCityName: '',
      projectITMasterPlan: '',
      projectITMasterPlanName: '',
      projectStart: new Date().toLocaleString("sv-SE"),
      projectFinish: new Date().toLocaleString("sv-SE"),
      addProjectStart:new Date().toLocaleString("sv-SE"),
      addProjectFinish:new Date().toLocaleString("sv-SE"),
      projectPeriod: '',
      projectTotalBudget: '',
      projectDepartment: departmentID,
      projectResponsible: '',
      subStrategy: '',
      subStrategy_name: '',
      createUserData: '',
      projectNote: '',
      projectStatus: 1,
      // projectTypeList: [],
      projectTypeList: [],
      projectNationalStrategyList: [],
      projectPolicyList: [],
      projectMasterplanList: [],
      projectDevelopmentPlanList: [],
      projectDevelopmentGoalList: [],
      projectProvinceStrategyList: [],
      projectLocalStrategyList: [],
      projectMunicipalityStrategyList: [],
      subStrategyList: [],
      projectNonLivableList: [],
      projectITMasterPlanList: [],
      projectSmartCityList: [],
      projectPlanList: [],
      projectRevenueBudgetTypeList: [],
      projectExpenditureBudgetTypeList: [],
      projectDepartmentList: [],
      // validationError: '',
      validationError: '',
      validationError1: '',
      validationError2: '',
      validationError3: '',
      validationError4: '',
      validationError5: '',
      validationError6: '',
      validationError7: '',
      validationError8: '',
      validationError9: '',
      validationError10: '',
      validationError10_1: '',
      validationError10_2: '',
      validationError10_3: '',
      validationError11: '',
      validationError12: '',
      validationError13: '',
      validationError14: '',
      validationError14_2: '',
      validationError15: '',
      validationError15_2: '',
      validationError16: '',
      validationError17: '',
      validationError18: '',
      isEdit: false,
    };
  }
  componentDidMount() {
    var a = moment(this.state.projectStart);
    var b = moment(this.state.projectFinish);
    var diff = b.diff(a, 'days');
    this.setState({
      projectPeriod: diff >= 0 ? diff + 1 : 0,
    });
    this.getProjectType();
    this.getDataNationPlans();
    this.getDataPolicies();
    this.getDataMasterPlans();
    this.getDataDevelopmentPlans();
    this.getDataDevelopmentGoals();
    this.getDataProvincePlans();
    this.getDataLocalPlans();
    this.getDataMunicipalityPlans();
    this.getDataLivableCities();
    this.getDataITMasterPlan();
    this.getDataSmartCity();
    this.getDataPlans();
    this.getDataRevenueTypes();
    this.getDataExpenditureTypes();
    this.getDataDepartments();
  }
  getProjectType() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/list?size=100').then(res => {
      this.setState({
        projectTypeList: res.data.result,
      });
    });
  }
  getDataNationPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataNationPlans/list?size=100').then(res => {
      this.setState({
        projectNationalStrategyList: res.data.result,
      });
    });
  }
  getDataPolicies() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataPolicies/list?size=100').then(res => {
      this.setState({
        projectPolicyList: res.data.result,
      });
    });
  }
  getDataMasterPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMasterPlans/list?size=100').then(res => {
      this.setState({
        projectMasterplanList: res.data.result,
      });
    });
  }
  getDataDevelopmentPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDevelopmentPlans/list?size=100').then(res => {
      this.setState({
        projectDevelopmentPlanList: res.data.result,
      });
    });
  }
  getDataDevelopmentGoals() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDevelopmentGoals/list?size=100').then(res => {
      this.setState({
        projectDevelopmentGoalList: res.data.result,
      });
    });
  }
  getDataProvincePlans(e) {
    const year = e ? e : moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543;
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataProvincePlans/list?size=100&year='+year).then(res => {
      this.setState({
        projectProvinceStrategyList: res.data.result,
      });
    });
  }
  getDataLocalPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataLocalPlans/list?size=100').then(res => {
      this.setState({
        projectLocalStrategyList: res.data.result,
      });
    });
  }
  getDataMunicipalityPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/list?size=100').then(res => {
      this.setState({
        projectMunicipalityStrategyList: res.data.result,
      });
    });
  }
  getDataSubStrategy(id) {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/subStrategy/list/' + id).then(res => {
      this.setState({
        subStrategyList: res.data,
      });
    });
  }
  getDataLivableCities() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataLivableCities/list?size=100').then(res => {
      this.setState({
        projectNonLivableList: res.data.result,
      });
    });
  }
  getDataITMasterPlan() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataITMasterPlans/list?size=100').then(res => {
      this.setState({
        projectITMasterPlanList: res.data.result,
      });
    });
  }
  getDataSmartCity() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataSmartCities/list?size=100').then(res => {
      this.setState({
        projectSmartCityList: res.data.result,
      });
    });
  }
  getDataPlans() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list?size=100').then(res => {
      this.setState({
        projectPlanList: res.data.result,
      });
    });
  }
  getDataRevenueTypes(e) {
    const year = e ? e : moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543;
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/revenueBudgets/reports?page=1&size=10&revenue_budget_year=' + year,
      )
      .then(res => {
        this.setState({
          projectRevenueBudgetTypeList: res.data.result,
        });
      });
  }
  getDataExpenditureTypes(e) {
    const year = e ? e : moment().month() >= 9 ? moment().year() + 544 : moment().year() + 543;
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          // '/dataExpenditureTypes/list?size=100',
          '/expenditureBudgets/reports?page=0&expenditure_budget_year=' +
          year,
      )
      .then(res => {
        this.setState({
          projectExpenditureBudgetTypeList: res.data.result,
        });
      });
  }
  getDataDepartments() {
    axios.get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?size=100').then(res => {
      this.setState({
        projectDepartmentList: res.data.result,
      });
    });
  }
  handleInputChange = e => {
    if (e.target.name == 'projectRevenueBudgetType') {
      let index = e.nativeEvent.target.selectedIndex;
      let label = e.nativeEvent.target[index].text;
      let value = e.target.value;
      this.setState({
        [e.target.name]: value,
        projectRevenueBudgetTypeName: label,
      });
    } else if (e.target.name == 'projectExpenditureBudgetType') {
      let index = e.nativeEvent.target.selectedIndex;
      let label = e.nativeEvent.target[index].text;
      let value = e.target.value;
      this.setState({
        [e.target.name]: value,
        projectExpenditureBudgetTypeName: label,
      });
    } else if (e.target.name == 'projectMunicipalityStrategy') {
      this.getDataSubStrategy(e.target.value);
      this.setState({
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name == 'subStrategy') {
      let index = e.nativeEvent.target.selectedIndex;
      let label = e.nativeEvent.target[index].text;
      this.setState({
        subStrategy: e.target.value,
        subStrategy_name: label,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  handleInputChangeDateStart = e => {
    const c = new Date(e).toLocaleString("sv-SE");
    var a = moment(new Date(e));
    var b = moment(new Date(this.state.projectFinish));
    let year = moment(e).year() + 543;
    const month = moment(e).month();
    if (month > 8) {
      year = year + 1;
    }
    var diff = b.diff(a, 'days');
    this.setState({
      projectStart: new Date(e),
      addProjectStart:c,
      projectPeriod: diff >= 0 ? diff + 1 : 0,
    });
    this.getDataRevenueTypes(year);
    this.getDataExpenditureTypes(year);
    this.getDataProvincePlans(year);
  };
  handleInputChangeDateFinish = e => {
    const c = new Date(e).toLocaleString("sv-SE");
    var a = moment(new Date(this.state.projectStart));
    var b = moment(new Date(e));
    var diff = b.diff(a, 'days');
    this.setState({
      projectFinish: new Date(e),
      addProjectFinish:c,
      projectPeriod: diff >= 0 ? diff + 1 : 0,
    });
  };
  checkTime = e => {
    var a = moment(this.state.projectStart);
    var b = moment(this.state.projectFinish);
    var sum = a.diff(b);
    if (sum <= 0) {
      return true;
    } else {
      return false;
    }
  };
  handleInputChangeNumber = e => {
    const { name, value } = e.target;

    // Allow empty value or a single decimal point
    if (value === '' || value === '.' || value === ',') {
      this.setState({ [name]: value });
      return;
    }

    // Remove commas for parsing and validate the number
    const numericValue = value.replace(/,/g, '');

    // Check if the value is a valid number with up to 2 decimal places
    if (!isNaN(numericValue) && /^[0-9]*\.?[0-9]{0,2}$/.test(numericValue)) {
      const [integerPart, decimalPart] = numericValue.split('.');
      // Format integer part with commas
      const formattedIntegerPart = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(integerPart || 0));

      // Combine formatted integer and decimal parts with max 2 decimal places
      const formattedValue =
        decimalPart !== undefined
          ? `${formattedIntegerPart}.${decimalPart.slice(0, 2)}` // Limit to 2 decimal places
          : formattedIntegerPart;

      // Set the value back to state
      this.setState({ [name]: formattedValue });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    let data = [
      {
        project_name: this.state.projectName,
        project_object: this.state.projectObject,
        project_output_goal: this.state.projectObjectGoal,
        project_outcome_goal: this.state.projectOutcomeGoal,
        project_expected_benefit: this.state.projectExpectedBenefit,
        project_benefit: this.state.projectBenefit,
        project_type: this.state.projectType,
        project_type_name: this.state.projectTypeList.filter(type => type.project_type_id === this.state.projectType)[0].project_type_name,
        project_policy: this.state.projectPolicy,
        project_policy_name: this.state.projectPolicyList.filter(type => type.policy_id === this.state.projectPolicy)[0].policy_name,
        project_national_strategy: this.state.projectNationalStrategy,
        project_national_strategy_name: this.state.projectNationalStrategyList.filter(type => type.national_strategy_id === this.state.projectNationalStrategy)[0].national_strategy_name,
        project_master_plan: this.state.projectMasterplan,
        project_master_plan_name: this.state.projectMasterplanList.filter(type => type.master_plan_id === this.state.projectMasterplan)[0].master_plan_name,
        project_development_plan: this.state.projectDevelopmentPlan,
        project_development_plan_name: this.state.projectDevelopmentPlanList.filter(type => type.development_plan_id === this.state.projectDevelopmentPlan)[0].development_plan_name,
        project_development_goal: this.state.projectDevelopmentGoal,
        project_development_goal_name: this.state.projectDevelopmentGoalList.filter(type => type.development_goal_id === this.state.projectDevelopmentGoal)[0].development_goal_name,
        project_province_strategy: this.state.projectProvinceStrategy,
        project_province_strategy_name: this.state.projectProvinceStrategyList.filter(type => type.province_strategy_id === this.state.projectProvinceStrategy)[0].province_strategy_name,
        project_local_strategy: this.state.projectLocalStrategy,
        project_local_strategy_name: this.state.projectLocalStrategyList.filter(type => type.local_strategy_id === this.state.projectLocalStrategy)[0].local_strategy_name,
        project_municipality_strategy: this.state.projectMunicipalityStrategy,
        project_municipality_strategy_name: this.state.projectMunicipalityStrategyList.filter(type => type.municipality_strategy_id === this.state.projectMunicipalityStrategy)[0]
          .municipality_strategy_name,
        project_plan: this.state.projectPlan,
        project_plan_name: this.state.projectPlanList.filter(type => type.plan_id === this.state.projectPlan)[0].plan_name,
        project_revenue_budget_type: this.state.projectRevenueBudgetType,
        project_revenue_budget_type_name: this.state.projectRevenueBudgetTypeName,
        project_expenditure_budget_type: this.state.projectExpenditureBudgetType,
        project_expenditure_budget_type_name: this.state.projectExpenditureBudgetTypeName,
        project_non_livable: this.state.projectNonLivable ? this.state.projectNonLivable : '',
        project_non_livable_name: this.state.projectNonLivable ? this.state.projectNonLivableList.filter(type => type.non_livable_id === this.state.projectNonLivable)[0].non_livable_name : '',

        project_smart_city: this.state.projectSmartCity ? this.state.projectSmartCity : '',
        project_smart_city_name: this.state.projectSmartCity ? this.state.projectSmartCityList.filter(type => type.smart_city_id === this.state.projectSmartCity)[0].smart_city_name : '',

        project_it_master_plan: this.state.projectITMasterPlan ? this.state.projectITMasterPlan : '',
        project_it_master_plan_name: this.state.projectITMasterPlan
          ? this.state.projectITMasterPlanList.filter(type => type.it_master_plan_id === this.state.projectITMasterPlan)[0].it_master_plan_name
          : '',
        project_start: this.state.projectStart,
        project_finish: this.state.projectFinish,
        project_count_day: parseFloat(this.state.projectPeriod),
        project_total_budget: parseFloat(this.state.projectTotalBudget),
        project_responsible: this.state.projectResponsible,
        project_department: this.state.projectDepartment,
        project_department_name: this.state.projectDepartmentList.filter(type => type.department_id === this.state.projectDepartment)[0].department_name,
        project_sub_strategy: this.state.subStrategy,
        project_sub_strategy_name: this.state.subStrategy_name,
        project_create_user_data: this.state.createUserData,
        project_note: this.state.projectNote,
        project_disburse: 0,
        project_executive: 0,
      },
    ];
  };

  handleSubmit1 = e => {
    e.preventDefault();
    let moreThanTime = this.checkTime();
    if (
      this.state.projectName.trim() &&
      this.state.projectType &&
      this.state.projectPolicy &&
      this.state.projectNationalStrategy &&
      this.state.projectMasterplan &&
      this.state.projectDevelopmentPlan &&
      this.state.projectDevelopmentGoal &&
      this.state.projectProvinceStrategy &&
      this.state.projectMunicipalityStrategy &&
      this.state.projectLocalStrategy &&
      this.state.projectPlan &&
      this.state.projectRevenueBudgetType &&
      this.state.projectExpenditureBudgetType &&
      this.state.subStrategy &&
      // this.state.projectNonLivable &&
      // this.state.projectSmartCity &&
      // this.state.projectITMasterPlan &&
      this.state.projectStart &&
      this.state.projectFinish &&
      this.state.projectDepartment &&
      this.state.projectTotalBudget &&
      this.state.projectResponsible.trim() &&
      moreThanTime !== false
    ) {
      axios
        .post(
          process.env.REACT_APP_SOURCE_URL + '/projects',
          {
            project_name: this.state.projectName,
            project_object: this.state.projectObject,
            project_output_goal: this.state.projectObjectGoal,
            project_outcome_goal: this.state.projectOutcomeGoal,
            project_expected_benefit: this.state.projectExpectedBenefit,
            project_benefit: this.state.projectBenefit,
            project_type: this.state.projectType,
            project_type_name: this.state.projectTypeList.filter(type => type.project_type_id === this.state.projectType)[0].project_type_name,
            project_policy: this.state.projectPolicy,
            project_policy_name: this.state.projectPolicyList.filter(type => type.policy_id === this.state.projectPolicy)[0].policy_name,
            project_national_strategy: this.state.projectNationalStrategy,
            project_national_strategy_name: this.state.projectNationalStrategyList.filter(type => type.national_strategy_id === this.state.projectNationalStrategy)[0].national_strategy_name,
            project_master_plan: this.state.projectMasterplan,
            project_master_plan_name: this.state.projectMasterplanList.filter(type => type.master_plan_id === this.state.projectMasterplan)[0].master_plan_name,
            project_development_plan: this.state.projectDevelopmentPlan,
            project_development_plan_name: this.state.projectDevelopmentPlanList.filter(type => type.development_plan_id === this.state.projectDevelopmentPlan)[0].development_plan_name,
            project_development_goal: this.state.projectDevelopmentGoal,
            project_development_goal_name: this.state.projectDevelopmentGoalList.filter(type => type.development_goal_id === this.state.projectDevelopmentGoal)[0].development_goal_name,
            project_province_strategy: this.state.projectProvinceStrategy,
            project_province_strategy_name: this.state.projectProvinceStrategyList.filter(type => type.province_strategy_id === this.state.projectProvinceStrategy)[0].province_strategy_name,
            project_local_strategy: this.state.projectLocalStrategy,
            project_local_strategy_name: this.state.projectLocalStrategyList.filter(type => type.local_strategy_id === this.state.projectLocalStrategy)[0].local_strategy_name,
            project_municipality_strategy: this.state.projectMunicipalityStrategy,
            project_municipality_strategy_name: this.state.projectMunicipalityStrategyList.filter(type => type.municipality_strategy_id === this.state.projectMunicipalityStrategy)[0]
              .municipality_strategy_name,
            project_plan: this.state.projectPlan,
            project_plan_name: this.state.projectPlanList.filter(type => type.plan_id === this.state.projectPlan)[0].plan_name,
            project_revenue_budget_type: this.state.projectRevenueBudgetType,
            project_revenue_budget_type_name: this.state.projectRevenueBudgetTypeName,
            project_expenditure_budget_type: this.state.projectExpenditureBudgetType,
            project_expenditure_budget_type_name: this.state.projectExpenditureBudgetTypeName,
            project_non_livable: this.state.projectNonLivable ? this.state.projectNonLivable : '',
            project_non_livable_name: this.state.projectNonLivable ? this.state.projectNonLivableList.filter(type => type.non_livable_id === this.state.projectNonLivable)[0].non_livable_name : '',

            project_smart_city: this.state.projectSmartCity ? this.state.projectSmartCity : '',
            project_smart_city_name: this.state.projectSmartCity ? this.state.projectSmartCityList.filter(type => type.smart_city_id === this.state.projectSmartCity)[0].smart_city_name : '',

            project_it_master_plan: this.state.projectITMasterPlan ? this.state.projectITMasterPlan : '',
            project_it_master_plan_name: this.state.projectITMasterPlan
              ? this.state.projectITMasterPlanList.filter(type => type.it_master_plan_id === this.state.projectITMasterPlan)[0].it_master_plan_name
              : '',
            project_start: this.state.addProjectStart,
            project_finish: this.state.addProjectFinish,
            project_count_day: parseFloat(this.state.projectPeriod),
            project_total_budget:  parseFloat(this.state.projectTotalBudget.replace(/,/g, '')),
            project_responsible: this.state.projectResponsible,
            project_department: this.state.projectDepartment,
            project_department_name: this.state.projectDepartmentList.filter(type => type.department_id === this.state.projectDepartment)[0].department_name,
            project_sub_strategy: this.state.subStrategy,
            project_sub_strategy_name: this.state.subStrategy_name,
            project_create_user_data: this.state.createUserData,
            project_note: this.state.projectNote,
            project_disburse: 0,
            project_executive: 0,
            // project_status: this.state.projectStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          if (res.data.length !== 0) {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลสำเร็จ</strong>,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
            this.setState({
              ID: res.data[0].project_id,
              isEdit: true,
              validationError1: '',
              validationError2: '',
              validationError3: '',
              validationError4: '',
              validationError5: '',
              validationError6: '',
              validationError7: '',
              validationError8: '',
              validationError9: '',
              validationError10: '',
              validationError10_1: '',
              validationError10_2: '',
              validationError10_3: '',
              validationError10_4: '',
              validationError11: '',
              validationError12: '',
              validationError13: '',
              validationError14: '',
              validationError14_2: '',
              validationError15: '',
              validationError15_2: '',
              validationError16: '',
              validationError17: '',
              validationError18: '',
            });
            setTimeout(() => {
              window.location.href = '/AllProject/AddProject2/' + res.data[0].project_id;
            }, 1000);
          } else {
            MySwal.fire({
              title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
              icon: 'error',
              timer: 1000,
              showConfirmButton: false,
            });
          }
        })
        .catch(err => {
          if (err.response === 'This project_name already exists!') {
            const validationError2 = 'มีข้อมูลนี้แล้ว กรุณาลองใหม่อีกครั้ง';

            this.setState({
              validationError2: validationError2,
              validationError3: '',
            });
          }
        });
    } else {
      //validate
      MySwal.fire({
        title: <strong>บันทึกข้อมูลไม่สำเร็จ</strong>,
        html: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
        icon: 'error',
        timer: 1000,
        showConfirmButton: false,
      });
      const validationError1 = this.state.projectName.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.projectType ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.projectNationalStrategy ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4 = this.state.projectPolicy ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError5 = this.state.projectMasterplan ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.projectDevelopmentPlan ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError7 = this.state.projectDevelopmentGoal ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError8 = this.state.projectProvinceStrategy ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError9 = this.state.projectLocalStrategy ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError10 = this.state.projectMunicipalityStrategy ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError10_1 = this.state.projectNonLivable? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError10_2 = this.state.projectSmartCity? ''
      //   : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      // const validationError10_3 = this.state.projectITMasterPlan? ''
      // : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError10_4 = this.state.projectSmartCity ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError11 = this.state.projectPlan ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError12 = this.state.projectRevenueBudgetType ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError13 = this.state.projectExpenditureBudgetType ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError14 = this.state.projectStart ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError15 = this.state.projectFinish ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError16 = this.state.projectTotalBudget ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError17 = this.state.projectDepartment ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError18 = this.state.projectResponsible.trim() ? '' : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      const validationError14_2 = moreThanTime === true ? '' : 'วันเริ่มต้นห้ามมากกว่าวันสิ้นสุด';
      const validationError15_2 = moreThanTime === true ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';

      this.setState({
        validationError1: validationError1,
        validationError2: validationError2,
        validationError3: validationError3,
        validationError4: validationError4,
        validationError5: validationError5,
        validationError6: validationError6,
        validationError7: validationError7,
        validationError8: validationError8,
        validationError9: validationError9,
        validationError10: validationError10,
        // validationError10_1: validationError10_1,
        // validationError10_2: validationError10_2,
        // validationError10_3: validationError10_3,
        validationError10_4: validationError10_4,
        validationError11: validationError11,
        validationError12: validationError12,
        validationError13: validationError13,
        validationError14: validationError14,
        validationError14_2: validationError14_2,
        validationError15: validationError15,
        validationError15_2: validationError15_2,
        validationError16: validationError16,
        validationError17: validationError17,
        validationError18: validationError18,
      });
    }
  };

  render() {
    return (
      <>
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit1}>
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ชื่อโครงการ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="text" name="projectName" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ระยะเวลาดําเนินโครงการ ( เริ่มต้น ) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* <Input
                      type="date"
                      name="projectStart"
                      value={this.state.projectStart}
                      onChange={this.handleInputChangeDate}
                      disabled={this.state.isEdit}
                    ></Input> */}

                    {/* <DatePicker
                      locale="th"
                      className="form-control"
                      //name="projectStart"
                      //value={this.state.projectStart}
                      value={new Date(moment(this.state.projectStart))}
                      clearIcon={null}
                      onChange={this.handleInputChangeDateStart}
                      // dateFormat="dd/MM/yyyy"
                      // disabled={this.state.isEdit}
                    /> */}
                    <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                      <DatePicker
                        //renderInput={params => <TextField {...params} />}
                        className="form-control"
                        format="DD/MM/YYYY"
                        pickerHeaderFormat="ddd D MMM"
                        yearOffset={543}
                        name="projectStart"
                        value={this.state.projectStart}
                        onChange={this.handleInputChangeDateStart}
                        TextFieldComponent={params => <Input {...params} />}
                        cancelLabel="ยกเลิก"
                        okLabel="ตกลง"
                        disabled={this.state.isEdit}
                      />
                    </MuiPickersUtilsProvider>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div>{this.state.validationError14}</div>
                      <div>{this.state.validationError14_2}</div>
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ระยะเวลาดําเนินโครงการ ( สิ้นสุด ) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* <ThaiDatePicker
                      //type="date"
                      name="projectFinish"
                      inputProps={{ class: 'form-control' }}
                      value={this.state.projectFinish}
                      onChange={this.handleInputChangeDate}
                      disabled={this.state.isEdit}
                    /> */}
                    {/* <MuiPickersUtilsProvider
                      dateAdapter={AdapterDateFns}
                      locale={th}
                    >
                      <DatePicker
                        name="projectFinish"
                        renderInput={params => <Input {...params} />}
                        value={this.state.projectFinish}
                        format="DD/MM/YYYY"
                        //pickerHeaderFormat="ddd D MMM"
                        yearOffset={543}
                        onChange={this.handleInputChangeDate}
                        disabled={this.state.isEdit}
                      />
                    </MuiPickersUtilsProvider> */}
                    {/* <ThaiDatePicker
                      value={this.state.projectFinish}
                      //selected={this.state.projectFinish}
                      onChange={this.handleInputChangeDate}
                    /> */}

                    <MuiPickersUtilsProvider utils={MomentUtils} locale={'th'}>
                      <DatePicker
                        //renderInput={params => <TextField {...params} />}
                        className="form-control"
                        format="DD/MM/YYYY"
                        pickerHeaderFormat="ddd D MMM"
                        yearOffset={543}
                        name="projectFinish"
                        value={this.state.projectFinish}
                        onChange={this.handleInputChangeDateFinish}
                        TextFieldComponent={params => <Input {...params} />}
                        cancelLabel="ยกเลิก"
                        okLabel="ตกลง"
                        disabled={this.state.isEdit}
                      />
                    </MuiPickersUtilsProvider>

                    {/* <DatePicker
                      locale="th"
                      className="form-control"
                      //name="projectFinish"
                      value={this.state.projectFinish}
                      clearIcon={null}
                      // value={moment(this.state.projectFinish)
                      //   .add(543, 'y')
                      //   .format('DD/MM/YYYY')}
                      onChange={this.handleInputChangeDateFinish}
                      // dateFormat="dd/MM/yyyy"
                      // disabled={this.state.isEdit}
                    /> */}
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div>{this.state.validationError15}</div>
                      <div>{this.state.validationError15_2}</div>
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    รวมระยะเวลาดําเนินโครงการ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* *คำนวนเอง* */}
                    <Input type="text" name="projectPeriod" value={this.state.projectPeriod + ' วัน'} disabled></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    วัตถุประสงค์โครงการ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="projectObject" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายเชิงผลผลิต :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="projectObjectGoal" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายเชิงผลลัพธ์ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="projectOutcomeGoal" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผลที่คาดว่าจะได้รับ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="projectExpectedBenefit" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    กลุ่มเป้าหมาย/ผู้ที่ได้รับประโยชน์ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="text" name="projectBenefit" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลประเภทโครงการ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectType" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectTypeList &&
                        this.state.projectTypeList
                          .filter(type => parseInt(type.project_type_status) === 1)
                          .map((type, no) => (
                            <option value={type.project_type_id} key={'optionProjectType' + no}>
                              {type.project_type_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์ชาติ 20 ปี <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectNationalStrategy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectNationalStrategyList &&
                        this.state.projectNationalStrategyList
                          .filter(type => parseInt(type.national_strategy_status) === 1)
                          .map((type, no) => (
                            <option value={type.national_strategy_id} key={'optionProjectNationalStrategy' + no}>
                              {type.national_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError3}
                    </Col>
                  </Grid>

                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    แผนแม่บทชาติ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectMasterplan" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectMasterplanList &&
                        this.state.projectMasterplanList
                          .filter(type => parseInt(type.master_plan_status) === 1)
                          .map((type, no) => (
                            <option value={type.master_plan_id} key={'optionProjectMasterplan' + no}>
                              {type.master_plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError5}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    แผนพัฒนาเศรษฐกิจ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectDevelopmentPlan" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDevelopmentPlanList &&
                        this.state.projectDevelopmentPlanList
                          .filter(type => parseInt(type.development_plan_status) === 1)
                          .map((type, no) => (
                            <option value={type.development_plan_id} key={'optionProjectMasterplan' + no}>
                              {type.development_plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError6}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายการพัฒนาที่ยั่งยืน (SDGs) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectDevelopmentGoal" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDevelopmentGoalList &&
                        this.state.projectDevelopmentGoalList
                          .filter(type => parseInt(type.development_goal_status) === 1)
                          .map((type, no) => (
                            <option value={type.development_goal_id} key={'optionProjectMasterplan' + no}>
                              {type.development_goal_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError7}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์จังหวัด <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectProvinceStrategy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectProvinceStrategyList &&
                        this.state.projectProvinceStrategyList
                          .filter(type => parseInt(type.province_strategy_status) === 1)
                          .map((type, no) => (
                            <option value={type.province_strategy_id} key={'optionProjectMasterplan' + no}>
                              {type.province_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError8}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์องค์การปกครองท้องถิ่น (อปท.) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectLocalStrategy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectLocalStrategyList &&
                        this.state.projectLocalStrategyList
                          .filter(type => parseInt(type.local_strategy_status) === 1)
                          .map((type, no) => (
                            <option value={type.local_strategy_id} key={'optionProjectMasterplan' + no}>
                              {type.local_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError9}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์เทศบาลนครนนทบุรี <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectMunicipalityStrategy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectMunicipalityStrategyList &&
                        this.state.projectMunicipalityStrategyList
                          .filter(type => parseInt(type.municipality_strategy_status) === 1)
                          .map((type, no) => (
                            <option value={type.municipality_strategy_id} key={'optionProjectMasterplan' + no}>
                              {type.municipality_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลกลยุทธ์ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="subStrategy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.subStrategyList &&
                        this.state.subStrategyList
                          .filter(type => parseInt(type.sub_strategy_status) === 1)
                          .map((type, no) => (
                            <option value={type.sub_strategy_id} key={'optionSubStrategy' + no}>
                              {type.sub_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_4}
                    </Col>
                  </Grid>
                  {/* <div style={{ display: 'none' }}> */}
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูล 6 ดีของจังหวัดนนทบุรี :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectNonLivable" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}></option>
                      {this.state.projectNonLivableList &&
                        this.state.projectNonLivableList
                          .filter(type => parseInt(type.non_livable_status) === 1)
                          .map((type, no) => (
                            <option value={type.non_livable_id} key={'optionProject6D' + no}>
                              {type.non_livable_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_1}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลแผนปฎิบัติการดิจิทัลระยะ 5 ปี :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectITMasterPlan" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}></option>
                      {this.state.projectITMasterPlanList &&
                        this.state.projectITMasterPlanList
                          .filter(type => parseInt(type.it_master_plan_status) === 1)
                          .map((type, no) => (
                            <option value={type.it_master_plan_id} key={'optionProjectITMasterplan' + no}>
                              {type.it_master_plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_2}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูล Smart City :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectSmartCity" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}></option>
                      {this.state.projectSmartCityList &&
                        this.state.projectSmartCityList
                          .filter(type => parseInt(type.smart_city_status) === 1)
                          .map((type, no) => (
                            <option value={type.smart_city_id} key={'optionProjectSmartCity' + no}>
                              {type.smart_city_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_3}
                    </Col>
                  </Grid>
                  {/* </div> */}
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลแผนงาน <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectPlan" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectPlanList &&
                        this.state.projectPlanList
                          .filter(type => parseInt(type.plan_status) === 1)
                          .map((type, no) => (
                            <option value={type.plan_id} key={'optionProjectMasterplan' + no}>
                              {type.plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError11}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลนโนบายนายกเทศมนตรีประจําปี <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectPolicy" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectPolicyList &&
                        this.state.projectPolicyList
                          .filter(type => parseInt(type.policy_status) === 1)
                          .map((type, no) => (
                            <option value={type.policy_id} key={'optionProjectPolicy' + no}>
                              {type.policy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError4}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    แหล่งที่มาของเงินงบประมาณ (งบประมาณรายรับ) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectRevenueBudgetType" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectRevenueBudgetTypeList &&
                        this.state.projectRevenueBudgetTypeList
                          .filter(type => parseInt(type.revenue_budget_status) === 1)
                          .map((type, no) => (
                            <option value={type.revenue_budget_type} key={'optionProjectMasterplan' + no} title={type.revenue_budget_type_name}>
                              {type.revenue_budget_type_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError12}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เงินงบประมาณ (งบประมาณรายจ่าย) <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectExpenditureBudgetType" onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectExpenditureBudgetTypeList &&
                        this.state.projectExpenditureBudgetTypeList
                          .filter(type => parseInt(type.expenditure_budget_status) === 1)
                          .map((type, no) => (
                            <option value={type.expenditure_budget_type} key={'optionProjectMasterplan' + no} title={type.expenditure_budget_type_name}>
                              {type.expenditure_budget_type_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError13}
                    </Col>
                  </Grid>

                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ยอดงบประมาณโครงการ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="text" name="projectTotalBudget" value={this.state.projectTotalBudget} onChange={this.handleInputChangeNumber} disabled={this.state.isEdit} />
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError16}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    หน่วยงานเจ้าของโครงการ <font style={{ color: 'red' }}>*</font> :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="select" name="projectDepartment" value={this.state.projectDepartment} onChange={this.handleInputChange} disabled={this.state.isEdit}>
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDepartmentList &&
                        this.state.projectDepartmentList
                          .filter(type => parseInt(type.department_status) === 1)
                          .map((type, no) => (
                            <option value={type.department_id} key={'optionProjectMasterplan' + no}>
                              {type.department_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError17}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผู้รับผิดชอบโครงการ <font style={{ color: 'red' }}>*</font> :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="text" name="projectResponsible" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError18}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผู้บันทึกข้อมูล :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="text" name="projectUserCreate" disabled value={name}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลผลการดำเนินงานของเจ้าของโครงการ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="createUserData" value={this.state.createUserData} onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    หมายเหตุ/บันทึก :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input type="textarea" name="projectNote" onChange={this.handleInputChange} disabled={this.state.isEdit}></Input>
                  </Grid>
                </Grid>
              </FormGroup>
              <FormGroup style={{ textAlign: 'center', marginTop: '3rem' }}>
                {this.state.isEdit === false ? (
                  <Button color="success">บันทึก</Button>
                ) : (
                  <Button color="warning" onClick={() => (window.location.href = `/AllProject/EditProject1/${this.state.ID}`)}>
                    แก้ไขข้อมูล
                  </Button>
                )}
                &nbsp;
                <Button color="danger" onClick={() => (window.location.href = '/AllProject')}>
                  ยกเลิก
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}
