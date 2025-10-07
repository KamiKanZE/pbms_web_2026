import {
  Content,
  Footer,
  Header,
  // Sidebar,
  // Sidebar2,
  // Sidebar3,
  // Sidebar4,
  // Sidebar5,
  // Sidebar6,
} from '../Layout';
import React from 'react';
// import {
//   MdImportantDevices,
//   // MdCardGiftcard,
//   MdLoyalty,
// } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SidebarNew from './SidebarNew';

class MainLayout extends React.Component {
  intervalID = 0;
  constructor(props) {
    super(props);
    this.state = {
      currentCount: 3600,
    };
  }

  removeToken() {
    //   // let countDown = this.state.count;
    clearInterval(this.intervalID);
    // this.state.currentCount =60;
    let newCount = this.state.currentCount;
    function timer() {
      if (newCount > 0) {
        newCount -= 1;
      } else {
        localStorage.removeItem('token');
        window.location = '/';
      }
    }

    this.intervalID = setInterval(timer, 1000);
    //   setTimeout(function(){
    //     if(newCount != 0){
    //      newCount -=1;
    //     }else{
    //       // localStorage.removeItem('token');
    //       // window.location = '/';
    //     }
    // //     this.setState({
    // //       count: countDown1,
    // //     })
    // },2000);
    // }
    // this.state.count *= 60;
    // //   let countDown = this.state.count;
    // //   // const token_id = localStorage.getItem('token');
    //   setTimeout(function(){
    //       // localStorage.removeItem('token');
    //       // window.location = '/';
    // },10000);
  }
  // static isSidebarOpen() {
  //   return document
  //     .querySelector('.cr-sidebar')
  //     .classList.contains('cr-sidebar--open');
  // }

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);
    this.removeToken();
    // setTimeout(() => {
    //   if (!this.notificationSystem) {
    //     return;
    //   }

    //   this.notificationSystem.addNotification({
    //     title: <MdImportantDevices />,
    //     message: 'Welome to Reduction Admin!',
    //     level: 'info',
    //   });
    // }, 1500);

    // setTimeout(() => {
    //   if (!this.notificationSystem) {
    //     return;
    //   }

    //   this.notificationSystem.addNotification({
    //     title: <MdLoyalty />,
    //     message:
    //       'Reduction is carefully designed template powered by React and Bootstrap4!',
    //     level: 'info',
    //   });
    // }, 2500);
  }

  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    // if (
    //   MainLayout.isSidebarOpen() &&
    //   (this.props.breakpoint === 'xs' ||
    //     this.props.breakpoint === 'sm' ||
    //     this.props.breakpoint === 'md')
    // ) {
    //    this.openSidebar('close');
    // }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
      // return this.openSidebar('close');

      case 'lg':
      case 'xl':
      default:
      // return this.openSidebar('open');
    }
  }
  openSidebar(openOrClose) {
    // if (openOrClose === 'open') {
    //   return document
    //     .querySelector('.cr-sidebar')
    //     .classList.add('cr-sidebar--open');
    // }
    // document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }
  renderSidebar() {
    // const userTypeName = localStorage.getItem('userTypeName');

    // const user_role_name= localStorage.getItem('userTypeName');
    // const user_role_id= localStorage.getItem('userTypeID');

    // switch (userTypeName) {
    //   case 'ผู้จัดการข้อมูลพื้นฐาน':
    //     return <Sidebar />;
    //     break;
    //   case 'ผู้จัดการข้อมูลโครงการ':
    //     return <Sidebar2 />;
    //     break;
    //   case 'ผู้รายงานผลโครงการ':
    //     return <Sidebar3 />;
    //     break;
    //   case 'ผู้จัดการข้อมูลตัวชี้วัด':
    //     return <Sidebar4 />;
    //     break;
    //   case 'ผู้รายงานผลตัวชี้วัด':
    //     return <Sidebar5 />;
    //     break;
    //   case 'ผู้บริหาร':
    //     return <Sidebar6 />;
    //     break;
    //   default:
    //     return <Sidebar6 />;
    //     break;
    // }
    // return <Sidebar />;
  }
  render() {
    const { children } = this.props;
    return (
      <>
        <Header />

        <main className="cr-app bg-light" onClick={() => this.removeToken()}>
          {/* {this.renderSidebar()} */}
          <SidebarNew />
          <div style={{ marginRight: '50px' }} />
          <Content fluid onClick={this.handleContentClick}>
            {/* <Header /> */}
            <div style={{ marginTop: '9vh' }} />
            {children}
            <Footer />
          </Content>

          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
        </main>
      </>
    );
  }
}

export default MainLayout;
