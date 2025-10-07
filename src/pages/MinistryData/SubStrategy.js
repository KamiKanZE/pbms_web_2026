import React from 'react';
import axios from 'axios';
import { Col } from 'reactstrap';
import SubStrategyList from '../../components/BasicInformation/SubStrategyList';
import Typography from '../../components/Typography';
import { Grid } from '@material-ui/core';
function SubStrategyData({ page, nameMasterPlan }) {
  return (
    <div>
      <Col>
        <div className="box-1 mb-2">จัดการข้อมูลพื้นฐาน</div>
        {/* header หัวข้อ ช่องค้นหา */}
        <div className="col-md-12">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div style={{ textAlign: 'left' }}>
                <div className={'header'}>
                  <Typography type="h5" className={'title'}>
                    ข้อมูลกลยุทธ์
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={6} className="text-right">
              <a href={'/MinistryData/MinistryNon'} className="btn btn-secondary">
                ย้อนกลับ
              </a>
            </Grid>
            <Grid md={12}>
              <div style={{ textAlign: 'left' }}>
                <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-11">{nameMasterPlan}</div>
                </div>
              </div>
            </Grid>
          </Grid>
          <hr />
        </div>
      </Col>
      <Col>
        <SubStrategyList page={page} title="ข้อมูลกลยุทธ์" />
      </Col>
    </div>
  );
}

// export default Plan1;
export default class SubStrategy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MasterPlanName: '',
    };
  }
  componentDidMount() {
    this.loadCommentsFromServer();
  }
  loadCommentsFromServer() {
    let id = this.props.match.params.id ? this.props.match.params.id : '';
    axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataMunicipalityPlans/' + id)
      .then(res => {
        this.setState({
          MasterPlanName: res.data.municipality_strategy_name,
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  render() {
    let page = this.props.match.params.id;
    return <SubStrategyData page={page} nameMasterPlan={this.state.MasterPlanName} />;
  }
}
