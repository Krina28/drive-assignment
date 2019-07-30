import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../redux/actions/gapi_actions';

let uploadFile = actions.uploadFile;
let getFiles = actions.getFiles;

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this._submitUploadForm = this._submitUploadForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uploadFileRes != nextProps.uploadFileRes) {
      this.props.getFiles();
    }
  }

  _submitUploadForm(event) {
    //dispatching uploadFile action
    this.props.uploadFile(this.fileInput.files[0]);
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <label>
          <input type="file" onChange={this._submitUploadForm} ref={(input) => this.fileInput = input}
            style={{ display: 'none' }} />
        </label>
        <button type="button" className="btn btn-info" onClick={() => this.fileInput.click()}>
          <span className="glyphicon glyphicon-plus"></span> Upload
        </button>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploadFileRes: state.reducer.uploadFileRes,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadFile: (file) => dispatch(uploadFile(file)),
    getFiles: () => dispatch(getFiles()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
