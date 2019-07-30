import '../../common/gapi';

let gapi = window.gapi;

// types of action
const Types = {
  LOGIN: "LOGIN",
  LOG_OUT: "LOG_OUT",
  IS_AUTHENTICATED: "IS_AUTHENTICATED",
  GET_FILES: "GET_FILES",
  UPDATE_FILE: "UPDATE_FILE",
  UPLOAD_FILE: "UPLOAD_FILE",
  DELETE_FILE: "DELETE_FILE"
};

// actions
const login = value => ({
  type: Types.LOGIN,
  payload: value
});

const logout = data => ({
  type: Types.LOG_OUT,
  data
});

const googleAuthEvent = isAuthenticated => ({
  type: Types.IS_AUTHENTICATED,
  isAuthenticated
});

const getFilesAction = (data) => dispatch => {
  dispatch({
    type: Types.GET_FILES,
    payload: data
  })
}

function getFiles() {
  return (dispatch) => {
    gapi.client.drive.files.list({
      pageSize: 1000,
      q: "trashed=false",
      fields: "nextPageToken, files (id, description, name, thumbnailLink, webContentLink, mimeType, trashed, modifiedTime)"
    }).then(function (response) {
      if (response.status !== 200) {
        throw new Error("Error Occurred");
      } else {
        dispatch(getFilesAction(response.result.files))
      }
    })
  }
}

const updateFileAction = (data) => dispatch => {
  dispatch({
    type: Types.UPDATE_FILE,
    payload: data
  })
}

function updateFile(file) {
  return (dispatch) => {
    gapi.client.request({
      'path': '/drive/v2/files/' + file.id,
      'method': 'PUT',
      'body': {
        title: file.title,
        description: file.description,
      }
    }).then(function (response) {
      dispatch(updateFileAction(response.result))
    });
  }
}

const deleteFileAction = (data) => dispatch => {
  dispatch({
    type: Types.DELETE_FILE,
    payload: data
  })
}

function deleteFile(fileId) {
  return (dispatch) => {
    gapi.client.drive.files.delete({
      'fileId': fileId,
    }).then(function (response) {
      if (response.status !== 200) {
        throw new Error("Error Occurred");
      } else {
        dispatch(deleteFileAction(response.result))
      }
    })
  }
}

const uploadFileAction = (data) => dispatch => {
  dispatch({
    type: Types.UPLOAD_FILE,
    payload: data
  })
}

function uploadFile(file) {
  return (dispatch) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const mimetype = reader.result.split(",")[0].split(";")[0].split(":")[1];
      const base64 = reader.result.split(',')[1]

      const boundary = '-------314159265358979323846264';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelim = "\r\n--" + boundary + "--";

      const metaData = {
        'name': file.name.split('.')[0],
        'mimeType': mimetype,
      };
      const multipartReqBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metaData) +
        delimiter +
        'Content-Type: ' + mimetype + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64 +
        closeDelim;
      const request = gapi.client.request({
        'path': '/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart', 'fields': '*'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartReqBody
      });
      request.execute(function (response) {
        dispatch(uploadFileAction(response))
      });
    };
    reader.onerror = error => error;
  }
}

export default {
  login,
  logout,
  Types,
  googleAuthEvent,
  getFiles,
  updateFile,
  deleteFile,
  uploadFile
};
