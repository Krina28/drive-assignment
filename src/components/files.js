import React, {Component} from 'react';
import {connect} from 'react-redux';
import actions from '../redux/actions/gapi_actions';

let deleteFile = actions.deleteFile;
let updateFile = actions.updateFile;
let getFiles = actions.getFiles;

class FileList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showUpdateButton: false,
      form: props.file,
      showEditable: false
    }
  }

  handleChange(event, field) {
    if (field === "name") {
      this.setState({form: {...this.state.form, name: event.target.value}, showUpdateButton: true})
    }

    if (field === "description") {
      this.setState({form: {...this.state.form, description: event.target.value}, showUpdateButton: true})
    }
  }

  _updateFile = async (fileId) => {
    const {name, description} = this.state.form;
    let formData = {
      id: fileId,
      title: name,
      description: description,
    }
    //dispatching updateFile action
    this.props.updateFile(formData);
    setTimeout(() => {
      this.props.getFiles();
    }, 500);
    this.setState({showUpdateButton: false, showEditable:false})
  }

  _confirmDeleteAction = (fileId) => {
    let deleteMsg = window.confirm("Do you want to remove this file from drive?");
    if (deleteMsg == true) {
      //dispatching deleteFile action
      this.props.deleteFile(fileId);
      setTimeout(() => {
        this.props.getFiles();
      }, 500);
    }
  }

  render() {
    const {form, showEditable} = this.state;
    return (
      <React.Fragment>
        <div className="card w-75 card-view ">
          <div className="card-body">
            <div className="card-title">
              <div className="card-img">
                <a target="__new" href="https://google.com">
                  <img className="file-thumbnail" alt="" src={form.thumbnailLink}/>
                </a>
              </div>
            </div>
            <div className="card-text">
              <span>
                <label htmlFor="filename">File Name : </label>
                {showEditable ?
                  <input className="" type="text" name="name" value={form.name}
                         onChange={(event) => this.handleChange(event, 'name')}/>
                  : <label onClick={() => {
                    this.setState({showEditable: true})
                  }}
                           htmlFor="filename">{form.name}</label>
                }
              </span>
              <br/>
              <span>
                <label htmlFor="filedesc">File Description : </label>
                {showEditable ?
                  <input type="text" name="description" value={form.description}
                         onChange={(event) => this.handleChange(event, 'description')}/>
                  : <label onClick={() => {
                    this.setState({showEditable: true})
                  }}
                           htmlFor="filename">{form.description}</label>
                }
              </span>
              <br/>
              <span>
                {this.state.showUpdateButton &&
                <button className="btn btn-primary" onClick={() => this._updateFile(form.id)}>Update</button>}
              </span>
              <span className="delete-btn-view">
                <button className="btn btn-danger"
                        onClick={this._confirmDeleteAction.bind(this, form.id)}>Delete</button>
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state.reducer;
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFiles: () => dispatch(getFiles()),
    deleteFile: (fileId) => dispatch(deleteFile(fileId)),
    updateFile: (file) => dispatch(updateFile(file))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
