import React from 'react';
import axios from 'axios';
import Page from 'components/Page';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  FormFeedback,
  FormText,
  Input,
  Label,
  Button,
  FormGroup,
  keyword,
} from 'reactstrap';
import ReactConfirmAlert, { confirmAlert } from 'react-confirm-alert';
import { Chip, Fab, Grid, LinearProgress, styled } from '@material-ui/core';
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
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import DatePicker from 'react-datepicker';
import th from 'date-fns/locale/th';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('th', th);

const MySwal = withReactContent(Swal);
const token_id = localStorage.getItem('token');
const departmentID = localStorage.getItem('userDepartmentID');
const name = localStorage.getItem('userName');

const userPermission =
  JSON.parse(localStorage.getItem('userPermission')) !== null
    ? JSON.parse(localStorage.getItem('userPermission'))
    : [
        {
          manageUsersData: false,
          manageBasicData: false,
          manageBudgetData: false,
          manageProjectData: false,
          manageReportProjectData: false,
          manageKPIData: false,
          manageReportKPIData: false,
          showProjectData: false,
          showReportProjectData: false,
          showKPIData: false,
          showReportKPIData: false,
        },
      ];

const BorderLinearProgress = styled(LinearProgress)(({ colors, theme }) => ({
  height: 7,
  borderRadius: 5,
  backgroundColor: colors + '50',
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: colors,
  },
}));

export default class ReportMainData extends React.Component {
  constructor(props) {
    super(props);
    let id;
    {
      this.props.page == ':id' ||
      this.props.page == '' ||
      this.props.page == undefined
        ? (id = 1)
        : (id = this.props.page);
    }
    this.state = {
      Budget: [],
      ButgetSources: [],
      refreshing: false,
      modal: false,
      ID: id,
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
      projectStart: '',
      projectFinish: '',
      projectPeriod: '',
      projectTotalBudget: '',
      projectDepartment: '',
      projectResponsible: '',
      projectNote: '',
      projectStatus: 1,
      projectUserCreate: '',
      projectProgressStatus: '',
      projectAccruedMoney: false,
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

      isEdit: this.props.basename[1] === 'ReportActivities' ? true : false,
    };
  }
  componentDidMount() {
    this.getProject();
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
  getProject() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/projects/' + this.state.ID)
      .then(res => {
        const {
          project_id,
          project_name,
          project_object,
          project_output_goal,
          project_outcome_goal,
          project_expected_benefit,
          project_benefit,
          project_type,
          project_type_name,
          project_policy,
          project_policy_name,
          project_national_strategy,
          project_national_strategy_name,
          project_master_plan,
          project_master_plan_name,
          project_development_plan,
          project_development_plan_name,
          project_development_goal,
          project_development_goal_name,
          project_province_strategy,
          project_province_strategy_name,
          project_local_strategy,
          project_local_strategy_name,
          project_municipality_strategy,
          project_municipality_strategy_name,
          project_plan,
          project_plan_name,
          project_revenue_budget_type,
          project_revenue_budget_type_name,
          project_expenditure_budget_type,
          project_expenditure_budget_type_name,
          project_non_livable,
          project_non_livable_name,
          project_smart_city,
          project_smart_city_name,
          project_it_master_plan,
          project_it_master_plan_name,
          project_start,
          project_finish,
          project_total_budget,
          project_budget_used,
          project_responsible,
          project_department,
          project_department_name,
          project_status,
          project_note,
          project_progress,
          budget_progress,
          create_user_name,
          update_user_name,
          project_accrued,
          project_disburse,
          project_executive
        } = res.data.result;
        this.setState({
          projectName: project_name,
          projectObject: project_object,
          projectObjectGoal: project_output_goal,
          projectOutcomeGoal: project_outcome_goal,
          projectExpectedBenefit: project_expected_benefit,
          projectBenefit: project_benefit,
          projectType: project_type,
          projectTypeName: project_type_name,
          projectNationalStrategy: project_national_strategy,
          projectNationalStrategyName: project_national_strategy_name,
          projectPolicy: project_policy,
          projectPolicyName: project_policy_name,
          projectMasterplan: project_master_plan,
          projectMasterplanName: project_master_plan_name,
          projectDevelopmentPlan: project_development_plan,
          projectDevelopmentPlanName: project_development_plan_name,
          projectDevelopmentGoal: project_development_goal,
          projectDevelopmentGoalName: project_development_goal_name,
          projectProvinceStrategy: project_province_strategy,
          projectProvinceStrategyName: project_province_strategy_name,
          projectLocalStrategy: project_local_strategy,
          projectLocalStrategyName: project_local_strategy_name,
          projectMunicipalityStrategy: project_municipality_strategy,
          projectMunicipalityStrategyName: project_municipality_strategy_name,
          projectPlan: project_plan,
          projectPlanName: project_plan_name,
          projectRevenueBudgetType: project_revenue_budget_type,
          projectRevenueBudgetTypeName: project_revenue_budget_type_name,
          projectExpenditureBudgetType: project_expenditure_budget_type,
          projectExpenditureBudgetTypeName:
            project_expenditure_budget_type_name,
          projectNonLivable: project_non_livable,
          projectNonLivableName: project_non_livable_name,
          projectSmartCity: project_smart_city,
          projectSmartCityName: project_smart_city_name,
          projectITMasterPlan: project_it_master_plan,
          projectITMasterPlanName: project_it_master_plan_name,
          projectStart: new Date(moment(project_start)),
          projectFinish: new Date(moment(project_finish)),
          projectPeriod: '',
          projectTotalBudget: project_total_budget,
          projectDepartment: project_department,
          projectResponsible: project_responsible,
          projectNote: project_note,
          projectUserCreate: update_user_name,
          projectAccruedMoney: project_accrued !== 1 ? false : true,
          project_disburse: project_disburse !== 1 ? false : true,
          project_executive: project_executive !== 1 ? false : true,
          projectProgressStatus: project_status,
        });
        var a = moment(this.state.projectStart);
        var b = moment(this.state.projectFinish);
        var diff = b.diff(a, 'days');
        this.setState({
          projectPeriod: diff > 0 ? diff : 0,
        });
        if (res.data.result.project_status == 3 ||res.data.result.project_status == 1) {
          $('#checksucceed').show();
        } else {
          $('#checksucceed').hide();
        }
      });
  }
  getProjectType() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataProjectTypes/list?size=100')
      .then(res => {
        this.setState({
          projectTypeList: res.data.result,
        });
      });
  }
  getDataNationPlans() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataNationPlans/list?size=100')
      .then(res => {
        this.setState({
          projectNationalStrategyList: res.data.result,
        });
      });
  }
  getDataPolicies() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPolicies/list?size=100')
      .then(res => {
        this.setState({
          projectPolicyList: res.data.result,
        });
      });
  }
  getDataMasterPlans() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMasterPlans/list?size=100')
      .then(res => {
        this.setState({
          projectMasterplanList: res.data.result,
        });
      });
  }
  getDataDevelopmentPlans() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataDevelopmentPlans/list?size=100',
      )
      .then(res => {
        this.setState({
          projectDevelopmentPlanList: res.data.result,
        });
      });
  }
  getDataDevelopmentGoals() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataDevelopmentGoals/list?size=100',
      )
      .then(res => {
        this.setState({
          projectDevelopmentGoalList: res.data.result,
        });
      });
  }
  getDataProvincePlans() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataProvincePlans/list?size=100',
      )
      .then(res => {
        this.setState({
          projectProvinceStrategyList: res.data.result,
        });
      });
  }
  getDataLocalPlans() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataLocalPlans/list?size=100')
      .then(res => {
        this.setState({
          projectLocalStrategyList: res.data.result,
        });
      });
  }
  getDataMunicipalityPlans() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataMunicipalityPlans/list?size=100',
      )
      .then(res => {
        this.setState({
          projectMunicipalityStrategyList: res.data.result,
        });
      });
  }
  getDataLivableCities() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataLivableCities/list?size=100',
      )
      .then(res => {
        this.setState({
          projectNonLivableList: res.data.result,
        });
      });
  }
  getDataITMasterPlan() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL + '/dataITMasterPlans/list?size=100',
      )
      .then(res => {
        this.setState({
          projectITMasterPlanList: res.data.result,
        });
      });
  }
  getDataSmartCity() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataSmartCities/list?size=100')
      .then(res => {
        this.setState({
          projectSmartCityList: res.data.result,
        });
      });
  }
  x;
  getDataPlans() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list?size=100')
      .then(res => {
        this.setState({
          projectPlanList: res.data.result,
        });
      });
  }
  getDataRevenueTypes() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataRevenueTypes/list?size=100')
      .then(res => {
        this.setState({
          projectRevenueBudgetTypeList: res.data.result,
        });
      });
  }
  getDataExpenditureTypes() {
    axios
      .get(
        process.env.REACT_APP_SOURCE_URL +
          '/dataExpenditureTypes/list?size=100',
      )
      .then(res => {
        this.setState({
          projectExpenditureBudgetTypeList: res.data.result,
        });
      });
  }
  getDataDepartments() {
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataDepartments/list?size=100')
      .then(res => {
        this.setState({
          projectDepartmentList: res.data.result,
        });
      });
  }
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleInputChangeCheck = e => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };
  handleInputChangeDateStart = e => {
    var a = moment(e);
    var b = moment(this.state.projectFinish);
    var diff = b.diff(a, 'days');
    this.setState({
      projectStart: e,
      projectPeriod: diff > 0 ? diff : 0,
    });
  };
  handleInputChangeDateFinish = e => {
    var a = moment(this.state.projectStart);
    var b = moment(e);
    var diff = b.diff(a, 'days');
    this.setState({
      projectFinish: e,
      projectPeriod: diff > 0 ? diff : 0,
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
    var value = NaN;
    if (
      parseInt(e.target.value) >= 0 &&
      parseInt(e.target.value).toString() !== 'NaN'
    ) {
      value = e.target.value;
    }

    this.setState({
      [e.target.name]: value.toString(),
    });
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
        project_type_name: this.state.projectTypeList.filter(
          type => type.project_type_id === this.state.projectType,
        )[0].project_type_name,
        project_policy: this.state.projectPolicy,
        project_policy_name: this.state.projectPolicyList.filter(
          type => type.policy_id === this.state.projectPolicy,
        )[0].policy_name,
        project_national_strategy: this.state.projectNationalStrategy,
        project_national_strategy_name:
          this.state.projectNationalStrategyList.filter(
            type =>
              type.national_strategy_id === this.state.projectNationalStrategy,
          )[0].national_strategy_name,
        project_master_plan: this.state.projectMasterplan,
        project_master_plan_name: this.state.projectMasterplanList.filter(
          type => type.master_plan_id === this.state.projectMasterplan,
        )[0].master_plan_name,
        project_development_plan: this.state.projectDevelopmentPlan,
        project_development_plan_name:
          this.state.projectDevelopmentPlanList.filter(
            type =>
              type.development_plan_id === this.state.projectDevelopmentPlan,
          )[0].development_plan_name,
        project_development_goal: this.state.projectDevelopmentGoal,
        project_development_goal_name:
          this.state.projectDevelopmentGoalList.filter(
            type =>
              type.development_goal_id === this.state.projectDevelopmentGoal,
          )[0].development_goal_name,
        project_province_strategy: this.state.projectProvinceStrategy,
        project_province_strategy_name:
          this.state.projectProvinceStrategyList.filter(
            type =>
              type.province_strategy_id === this.state.projectProvinceStrategy,
          )[0].province_strategy_name,
        project_local_strategy: this.state.projectLocalStrategy,
        project_local_strategy_name: this.state.projectLocalStrategyList.filter(
          type => type.local_strategy_id === this.state.projectLocalStrategy,
        )[0].local_strategy_name,
        project_municipality_strategy: this.state.projectMunicipalityStrategy,
        project_municipality_strategy_name:
          this.state.projectMunicipalityStrategyList.filter(
            type =>
              type.municipality_strategy_id ===
              this.state.projectMunicipalityStrategy,
          )[0].municipality_strategy_name,
        project_plan: this.state.projectPlan,
        project_plan_name: this.state.projectPlanList.filter(
          type => type.plan_id === this.state.projectPlan,
        )[0].plan_name,
        project_revenue_budget_type: this.state.projectRevenueBudgetType,
        project_revenue_budget_type_name:
          this.state.projectRevenueBudgetTypeList.filter(
            type =>
              type.revenue_type_id === this.state.projectRevenueBudgetType,
          )[0].revenue_type_name,
        project_expenditure_budget_type:
          this.state.projectExpenditureBudgetType,
        project_expenditure_budget_type_name:
          this.state.projectExpenditureBudgetTypeList.filter(
            type =>
              type.expenditure_type_id ===
              this.state.projectExpenditureBudgetType,
          )[0].expenditure_type_name,
        project_non_livable: this.state.projectNonLivable,
        project_non_livable_name: this.state.projectNonLivableList.filter(
          type => type.non_livable_id === this.state.projectNonLivable,
        )[0].non_livable_name,
        project_smart_city: this.state.projectSmartCity,
        project_smart_city_name: this.state.projectSmartCityList.filter(
          type => type.smart_city_id === this.state.projectSmartCity,
        )[0].smart_city_name,
        project_it_master_plan: this.state.projectITMasterPlan,
        project_it_master_plan_name: this.state.projectITMasterPlanList.filter(
          type => type.it_master_plan_id === this.state.projectITMasterPlan,
        )[0].it_master_plan_name,
        project_start: this.state.projectStart,
        project_finish: this.state.projectFinish,
        project_total_budget: this.state.projectTotalBudget,
        project_responsible: this.state.projectResponsible,
        project_department: this.state.projectDepartment,
        project_department_name: this.state.projectDepartmentList.filter(
          type => type.department_id === this.state.projectDepartment,
        )[0].department_name,
        project_note: this.state.projectNote,
        project_accrued: this.state.projectAccruedMoney === false ? 0 : 1,
      },
    ];
  };

  handleSubmit1 = e => {
    e.preventDefault();
    const ID = this.state.ID;
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
      this.state.projectStart &&
      this.state.projectFinish &&
      this.state.projectDepartment &&
      this.state.projectTotalBudget &&
      this.state.projectResponsible.trim() &&
      moreThanTime !== false
    ) {
      axios
        .patch(
          process.env.REACT_APP_SOURCE_URL + '/projects/' + ID,
          {
            project_name: this.state.projectName,
            project_object: this.state.projectObject,
            project_output_goal: this.state.projectObjectGoal,
            project_outcome_goal: this.state.projectOutcomeGoal,
            project_expected_benefit: this.state.projectExpectedBenefit,
            project_benefit: this.state.projectBenefit,
            project_type: this.state.projectType,
            project_type_name: this.state.projectTypeList.filter(
              type => type.project_type_id === this.state.projectType,
            )[0].project_type_name,
            project_policy: this.state.projectPolicy,
            project_policy_name: this.state.projectPolicyList.filter(
              type => type.policy_id === this.state.projectPolicy,
            )[0].policy_name,
            project_national_strategy: this.state.projectNationalStrategy,
            project_national_strategy_name:
              this.state.projectNationalStrategyList.filter(
                type =>
                  type.national_strategy_id ===
                  this.state.projectNationalStrategy,
              )[0].national_strategy_name,
            project_master_plan: this.state.projectMasterplan,
            project_master_plan_name: this.state.projectMasterplanList.filter(
              type => type.master_plan_id === this.state.projectMasterplan,
            )[0].master_plan_name,
            project_development_plan: this.state.projectDevelopmentPlan,
            project_development_plan_name:
              this.state.projectDevelopmentPlanList.filter(
                type =>
                  type.development_plan_id ===
                  this.state.projectDevelopmentPlan,
              )[0].development_plan_name,
            project_development_goal: this.state.projectDevelopmentGoal,
            project_development_goal_name:
              this.state.projectDevelopmentGoalList.filter(
                type =>
                  type.development_goal_id ===
                  this.state.projectDevelopmentGoal,
              )[0].development_goal_name,
            project_province_strategy: this.state.projectProvinceStrategy,
            project_province_strategy_name:
              this.state.projectProvinceStrategyList.filter(
                type =>
                  type.province_strategy_id ===
                  this.state.projectProvinceStrategy,
              )[0].province_strategy_name,
            project_local_strategy: this.state.projectLocalStrategy,
            project_local_strategy_name:
              this.state.projectLocalStrategyList.filter(
                type =>
                  type.local_strategy_id === this.state.projectLocalStrategy,
              )[0].local_strategy_name,
            project_municipality_strategy:
              this.state.projectMunicipalityStrategy,
            project_municipality_strategy_name:
              this.state.projectMunicipalityStrategyList.filter(
                type =>
                  type.municipality_strategy_id ===
                  this.state.projectMunicipalityStrategy,
              )[0].municipality_strategy_name,
            project_plan: this.state.projectPlan,
            project_plan_name: this.state.projectPlanList.filter(
              type => type.plan_id === this.state.projectPlan,
            )[0].plan_name,
            project_revenue_budget_type: this.state.projectRevenueBudgetType,
            project_revenue_budget_type_name:
              this.state.projectRevenueBudgetTypeList.filter(
                type =>
                  type.revenue_type_id === this.state.projectRevenueBudgetType,
              )[0].revenue_type_name,
            project_expenditure_budget_type:
              this.state.projectExpenditureBudgetType,
            project_expenditure_budget_type_name:
              this.state.projectExpenditureBudgetTypeList.filter(
                type =>
                  type.expenditure_type_id ===
                  this.state.projectExpenditureBudgetType,
              )[0].expenditure_type_name,
            project_non_livable: this.state.projectNonLivable,
            project_non_livable_name: this.state.projectNonLivableList.filter(
              type => type.non_livable_id === this.state.projectNonLivable,
            )[0].non_livable_name,

            project_smart_city: this.state.projectSmartCity,
            project_smart_city_name: this.state.projectSmartCityList.filter(
              type => type.smart_city_id === this.state.projectSmartCity,
            )[0].smart_city_name,

            project_it_master_plan: this.state.projectITMasterPlan,
            project_it_master_plan_name:
              this.state.projectITMasterPlanList.filter(
                type =>
                  type.it_master_plan_id === this.state.projectITMasterPlan,
              )[0].it_master_plan_name,
            project_start: this.state.projectStart,
            project_finish: this.state.projectFinish,
            project_total_budget: this.state.projectTotalBudget,
            project_responsible: this.state.projectResponsible,
            project_department: this.state.projectDepartment,
            project_department_name: this.state.projectDepartmentList.filter(
              type => type.department_id === this.state.projectDepartment,
            )[0].department_name,
            project_note: this.state.projectNote,
            project_accrued: this.state.projectAccruedMoney === false ? 0 : 1,
            project_status: this.state.projectProgressStatus,
          },
          { headers: { Authorization: `Bearer ${token_id}` } },
        )
        .then(res => {
          if (res.data.length !== 0) {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลสำเร็จ</strong>,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
            this.setState({
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
          } else {
            MySwal.fire({
              title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
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
        title: <strong>แก้ไขข้อมูลไม่สำเร็จ</strong>,
        html: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง',
        icon: 'error',
        timer: 1000,
        showConfirmButton: false,
      });
      const validationError1 = this.state.projectName.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError2 = this.state.projectType
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError3 = this.state.projectNationalStrategy
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError4 = this.state.projectPolicy
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError5 = this.state.projectMasterplan
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError6 = this.state.projectDevelopmentPlan
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError7 = this.state.projectDevelopmentGoal
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError8 = this.state.projectProvinceStrategy
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError9 = this.state.projectLocalStrategy
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError10 = this.state.projectMunicipalityStrategy
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError11 = this.state.projectPlan
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError12 = this.state.projectRevenueBudgetType
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError13 = this.state.projectExpenditureBudgetType
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError14 = this.state.projectStart
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError15 = this.state.projectFinish
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError16 = this.state.projectTotalBudget
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError17 = this.state.projectDepartment
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';
      const validationError18 = this.state.projectResponsible.trim()
        ? ''
        : 'กรุณากรอกข้อมูลให้ครบถ้วน';

      const validationError14_2 =
        moreThanTime === true ? '' : 'วันเริ่มต้นห้ามมากกว่าวันสิ้นสุด';
      const validationError15_2 =
        moreThanTime === true ? '' : 'วันสิ้นสุดห้ามน้อยกว่าวันเริ่มต้น';

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
                    <Input
                      type="text"
                      name="projectName"
                      value={this.state.projectName}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError1}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ระยะเวลาดําเนินโครงการ ( เริ่มต้น ){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* <Input
                      type="date"
                      name="projectStart"
                      value={this.state.projectStart}
                      onChange={this.handleInputChangeDate}
                      disabled={this.state.isEdit}
                    ></Input> */}
                    <DatePicker
                      locale="th"
                      className="form-control"
                      name="projectStart"
                      selected={this.state.projectStart}
                      value={moment(this.state.projectStart)
                        .add(543, 'y')
                        .format('DD/MM/YYYY')}
                      onChange={this.handleInputChangeDateStart}
                      dateFormat="dd/MM/yyyy"
                      disabled={this.state.isEdit}
                    />
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      <div>{this.state.validationError14}</div>
                      <div>{this.state.validationError14_2}</div>
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ระยะเวลาดําเนินโครงการ ( สิ้นสุด ){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* <Input
                      type="date"
                      name="projectFinish"
                      value={this.state.projectFinish}
                      onChange={this.handleInputChangeDate}
                      disabled={this.state.isEdit}
                    ></Input> */}
                    <DatePicker
                      locale="th"
                      className="form-control"
                      name="projectFinish"
                      selected={this.state.projectFinish}
                      value={moment(this.state.projectFinish)
                        .add(543, 'y')
                        .format('DD/MM/YYYY')}
                      onChange={this.handleInputChangeDateFinish}
                      dateFormat="dd/MM/yyyy"
                      disabled={this.state.isEdit}
                    />
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
                    <Input
                      type="text"
                      name="projectPeriod"
                      value={this.state.projectPeriod}
                      disabled
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    วัตถุประสงค์โครงการ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="textarea"
                      name="projectObject"
                      value={this.state.projectObject}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายเชิงผลผลิต :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="textarea"
                      name="projectObjectGoal"
                      value={this.state.projectObjectGoal}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายเชิงผลลัพธ์ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="textarea"
                      name="projectOutcomeGoal"
                      value={this.state.projectOutcomeGoal}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผลที่คาดว่าจะได้รับ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="textarea"
                      name="projectExpectedBenefit"
                      value={this.state.projectExpectedBenefit}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    กลุ่มเป้าหมาย/ผู้ที่ได้รับประโยชน์ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="text"
                      name="projectBenefit"
                      value={this.state.projectBenefit}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลประเภทโครงการ <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectType"
                      value={this.state.projectType}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectTypeList &&
                        this.state.projectTypeList
                          .filter(
                            type => parseInt(type.project_type_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.project_type_id}
                              key={'optionProjectType' + no}
                            >
                              {type.project_type_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError2}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์ชาติ 20 ปี{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectNationalStrategy"
                      value={this.state.projectNationalStrategy}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectNationalStrategyList &&
                        this.state.projectNationalStrategyList
                          .filter(
                            type =>
                              parseInt(type.national_strategy_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.national_strategy_id}
                              key={'optionProjectNationalStrategy' + no}
                            >
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
                    <Input
                      type="select"
                      name="projectMasterplan"
                      value={this.state.projectMasterplan}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectMasterplanList &&
                        this.state.projectMasterplanList
                          .filter(
                            type => parseInt(type.master_plan_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.master_plan_id}
                              key={'optionProjectMasterplan' + no}
                            >
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
                    <Input
                      type="select"
                      name="projectDevelopmentPlan"
                      value={this.state.projectDevelopmentPlan}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDevelopmentPlanList &&
                        this.state.projectDevelopmentPlanList
                          .filter(
                            type =>
                              parseInt(type.development_plan_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.development_plan_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.development_plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError6}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เป้าหมายการพัฒนาที่ยั่งยืน (SDGs){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectDevelopmentGoal"
                      value={this.state.projectDevelopmentGoal}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDevelopmentGoalList &&
                        this.state.projectDevelopmentGoalList
                          .filter(
                            type =>
                              parseInt(type.development_goal_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.development_goal_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.development_goal_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError7}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์จังหวัด{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectProvinceStrategy"
                      value={this.state.projectProvinceStrategy}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectProvinceStrategyList &&
                        this.state.projectProvinceStrategyList
                          .filter(
                            type =>
                              parseInt(type.province_strategy_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.province_strategy_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.province_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError8}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์องค์การปกครองท้องถิ่น (อปท.){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectLocalStrategy"
                      value={this.state.projectLocalStrategy}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectLocalStrategyList &&
                        this.state.projectLocalStrategyList
                          .filter(
                            type => parseInt(type.local_strategy_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.local_strategy_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.local_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError9}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลยุทธศาสตร์เทศบาลนครนนทบุรี{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectMunicipalityStrategy"
                      value={this.state.projectMunicipalityStrategy}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectMunicipalityStrategyList &&
                        this.state.projectMunicipalityStrategyList
                          .filter(
                            type =>
                              parseInt(type.municipality_strategy_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.municipality_strategy_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.municipality_strategy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10}
                    </Col>
                  </Grid>
                  {/* <div style={{ display: 'none' }}> */}
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูล 6 ดีของจังหวัดนนทบุรี{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectNonLivable"
                      value={this.state.projectNonLivable}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectNonLivableList &&
                        this.state.projectNonLivableList
                          .filter(
                            type => parseInt(type.non_livable_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.non_livable_id}
                              key={'optionProject6D' + no}
                            >
                              {type.non_livable_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_1}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลแผนปฎิบัติการดิจิทัลระยะ 5 ปี{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectITMasterPlan"
                      value={this.state.projectITMasterPlan}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectITMasterPlanList &&
                        this.state.projectITMasterPlanList
                          .filter(
                            type => parseInt(type.it_master_plan_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.it_master_plan_id}
                              key={'optionProjectITMasterplan' + no}
                            >
                              {type.it_master_plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError10_2}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูล Smart City <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectSmartCity"
                      value={this.state.projectSmartCity}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectSmartCityList &&
                        this.state.projectSmartCityList
                          .filter(
                            type => parseInt(type.smart_city_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.smart_city_id}
                              key={'optionProjectSmartCity' + no}
                            >
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
                    <Input
                      type="select"
                      name="projectPlan"
                      value={this.state.projectPlan}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectPlanList &&
                        this.state.projectPlanList
                          .filter(type => parseInt(type.plan_status) === 1)
                          .map((type, no) => (
                            <option
                              value={type.plan_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.plan_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError11}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ข้อมูลนโนบายนายกเทศมนตรีประจําปี{' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectPolicy"
                      value={this.state.projectPolicy}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectPolicyList &&
                        this.state.projectPolicyList
                          .filter(type => parseInt(type.policy_status) === 1)
                          .map((type, no) => (
                            <option
                              value={type.policy_id}
                              key={'optionProjectPolicy' + no}
                            >
                              {type.policy_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError4}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    แหล่งที่มาของเงินงบประมาณ (งบประมาณรายรับ){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectRevenueBudgetType"
                      value={this.state.projectRevenueBudgetType}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectRevenueBudgetTypeList &&
                        this.state.projectRevenueBudgetTypeList
                          .filter(
                            type => parseInt(type.revenue_type_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.revenue_type_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.revenue_type_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError12}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    เงินงบประมาณ (งบประมาณรายจ่าย){' '}
                    <font style={{ color: 'red' }}>*</font>:
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectExpenditureBudgetType"
                      value={this.state.projectExpenditureBudgetType}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectExpenditureBudgetTypeList &&
                        this.state.projectExpenditureBudgetTypeList
                          .filter(
                            type =>
                              parseInt(type.expenditure_type_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.expenditure_type_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.expenditure_type_name}
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
                    <Input
                      type="number"
                      name="projectTotalBudget"
                      value={this.state.projectTotalBudget}
                      onChange={this.handleInputChangeNumber}
                      disabled={this.state.isEdit}
                    ></Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError16}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    หน่วยงานเจ้าของโครงการ{' '}
                    <font style={{ color: 'red' }}>*</font> :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectDepartment"
                      value={this.state.projectDepartment}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={''}>กรุณาเลือก</option>
                      {this.state.projectDepartmentList &&
                        this.state.projectDepartmentList
                          .filter(
                            type => parseInt(type.department_status) === 1,
                          )
                          .map((type, no) => (
                            <option
                              value={type.department_id}
                              key={'optionProjectMasterplan' + no}
                            >
                              {type.department_name}
                            </option>
                          ))}
                    </Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError17}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผู้รับผิดชอบโครงการ <font style={{ color: 'red' }}>*</font>{' '}
                    :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="text"
                      name="projectResponsible"
                      value={this.state.projectResponsible}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                    <Col sm={12} style={{ color: 'red', marginTop: '5px' }}>
                      {this.state.validationError18}
                    </Col>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    ผู้บันทึกข้อมูล :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="text"
                      name="projectUserCreate"
                      disabled
                      value={this.state.projectUserCreate}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    หมายเหตุ/บันทึก :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="textarea"
                      name="projectNote"
                      value={this.state.projectNote}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    สถานะโครงการ :
                  </Grid>
                  <Grid xs={6} md={8} item>
                    <Input
                      type="select"
                      name="projectProgressStatus"
                      value={this.state.projectProgressStatus}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    >
                      <option value={3}>โครงการเบิกเงินแล้วสิ้นสุด</option>
                      <option value={1}>โครงการได้ตามกำหนดการ</option>
                      <option value={2}>โครงการดำเนินการแล้วแต่ล่าช้า</option>
                      <option value={0}>โครงการยังไม่ดำเนินการ</option>
                      <option value={5}>
                        โครงการเลยเวลามาแล้วยังไม่ดำเนินการทำ
                      </option>
                      <option value={4}>โครงการยกเลิก</option>
                    </Input>
                  </Grid>
                  <Grid xs={6} md={4} item style={{ textAlign: 'right' }}>
                    <font style={{ color: 'red' }}>
                      เงินค้างจ่าย :<br />
                      (กรณีโครงการยังดำเนินการไม่เสร็จในปีงบประมาณนั้นๆ)
                    </font>
                  </Grid>
                  <Grid xs={6} md={8} item>
                    {/* <Input
                      type="checkbox"
                      name="projectProgressStatus"
                      value={this.state.projectProgressStatus}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input> */}
                    <FormGroup check inline>
                      <Input
                        type="checkbox"
                        name="projectAccruedMoney"
                        // value={this.state.projectAccruedMoney}
                        checked={this.state.projectAccruedMoney}
                        onChange={this.handleInputChangeCheck}
                        disabled={this.state.isEdit}
                      />
                      <Label check>มี</Label>
                    </FormGroup>
                  </Grid>
                  <Col className="col-md-12" id="checksucceed" style={{ display: 'none' }}>
                    <Row>
                    <Col className="px-2" xs={6} md={4} item style={{ textAlign: 'right' }}>
                      <font style={{ color: 'blue' }}>
                        ส่งคลังและเบิกจ่ายเรียบร้อย :
                      </font>
                    </Col>
                    <Col className="px-2" xs={6} md={8} item>
                      {/* <Input
                      type="checkbox"
                      name="projectProgressStatus"
                      value={this.state.projectProgressStatus}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input> */}
                      <FormGroup check inline>
                        <Input
                          type="checkbox"
                          name="project_disburse"
                          checked={this.state.project_disburse}
                          onChange={this.handleInputChangeCheck}
                          disabled={this.state.isEdit}
                        />
                        <Label check style={{ color: 'blue' }}>
                          ส่งแล้ว
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col className="px-2" xs={6} md={4} item style={{ textAlign: 'right' }}>
                      <font style={{ color: 'green' }}>รายงานผู้บริหาร</font>
                    </Col>
                    <Col className="px-2" xs={6} md={8} item>
                      {/* <Input
                      type="checkbox"
                      name="projectProgressStatus"
                      value={this.state.projectProgressStatus}
                      onChange={this.handleInputChange}
                      disabled={this.state.isEdit}
                    ></Input> */}
                      <FormGroup check inline>
                        <Input
                          type="checkbox"
                          name="project_executive"
                          checked={this.state.project_executive}
                          onChange={this.handleInputChangeCheck}
                          disabled={this.state.isEdit}
                        />
                        <Label check style={{ color: 'green' }}>
                          รายงานเรียบร้อยแล้ว
                        </Label>
                      </FormGroup>
                    </Col>
                    </Row>
                  </Col>
                </Grid>
              </FormGroup>
              {/* {userPermission[0].manageProjectData === true ? (
                <FormGroup style={{ textAlign: 'center', marginTop: '3rem' }}>
                  {this.state.isEdit === false ? (
                    <Button color="success">บันทึก</Button>
                  ) : (
                    <Button
                      color="warning"
                      onClick={() =>
                        (window.location.href = `/AllProject/EditProject1/${this.state.ID}`)
                      }
                    >
                      แก้ไขข้อมูล
                    </Button>
                  )}
                  &nbsp;
                  <Button
                    color="danger"
                    onClick={() => (window.location.href = '/AllProject')}
                  >
                    ยกเลิก
                  </Button>
                </FormGroup>
              ) : (
                ''
              )} */}
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}
