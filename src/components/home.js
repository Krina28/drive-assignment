import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
import actions from '../redux/actions/gapi_actions';
import { conf } from '../config/gapi_config';
import '../common/gapi';
import Files from './files';

let gapi = window.gapi;
let googleAuthEvent = actions.googleAuthEvent;
let getFiles = actions.getFiles;
let logout = actions.logout;
let deleteFile = actions.deleteFile;

class Home extends Component {
  constructor(props) {
    super(props);
    this.initilizeGapi = this.initilizeGapi.bind(this);
  }

  componentDidMount() {
    gapi.load('client:auth2', this.initilizeGapi);
  }

  initilizeGapi() {
    gapi.client.init(conf).then(() => {
      this.updateGoogleAuth();
      gapi.auth2.getAuthInstance().isSignedIn.listen(() => this.updateGoogleAuth())
    });
  }

  async updateGoogleAuth() {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.props.getFiles();
    }
    this.props.googleAuthEvent(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  render() {
    return (
      <div className="App">
        <Header isAuthenticated={this.props.isAuthenticated} logoutAction={() => this.props.logout()}
          signin={() => gapi.auth2.getAuthInstance().signIn()} />
        {this.props.files.length > 0 && this.props.files.map(file => <Files key={file.id} file={file} />)}
        <div className="main-row">
          <section className="main-col">
            <h1> Covered Modules</h1>
            <div>
              <ul>
                <li>Google Oauth</li>
                <li>CRUD for Google Drive</li>
                <li>Session Handling</li>
              </ul>
            </div>
          </section>
          <section className="main-col">
            <h1>Functionality</h1>
            <ul>
              <li>React using Redux</li>
              <li>Google Oauth</li>
              <li>Google Drive API</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.reducer.isAuthenticated,
    files: state.reducer.files
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    googleAuthEvent: (message) => dispatch(googleAuthEvent(message)),
    getFiles: () => dispatch(getFiles()),
    logout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
