import React, { Component } from "react";
import swal from 'sweetalert';
import { Grid, Row, Col, Table, NavDropdown, MenuItem } from "react-bootstrap";


import Card from "components/Card/Card.jsx";
// import { thArray, tdArray } from "variables/Variables.jsx";
import axios from 'axios';
class Docs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('jwtToken'),
      docs:[],
      pageLimit: 4,
      currentPage: 1,
      current_pages: null,
      total_records: 0,
    }
  }
  componentWillMount() {
    this.getDocs();
  }

  getDocs = () => {
    this.loaderToggle('show');
    axios.post(process.env.REACT_APP_API_URL + '/api/get_docs', { token: this.state.token }).then((res) => {
      this.setState({
        docs: res.data.docs, current_pages: res.data.page, total_records: res.data.total_pages
      });
      this.loaderToggle('hide');
    }).catch(error => {
      swal("Error!", "Something Went wrong", "danger");
    });
  }

  loaderToggle = (action) => {
    if (action == 'hide') {
      let elem = document.getElementById('san_loader');
      elem.remove();
    } else {
      let elem = document.createElement('div');
      // elem.className = 'fa fa-spinner fa-spin fa-5x';
      elem.style.fontSize = '24px';
      elem.id = 'san_loader';
      document.body.insertBefore(elem, document.body.childNodes[0]);
    }
  }

  deleteDoc = (id,e) => {
    axios.delete(process.env.REACT_APP_API_URL + '/api/doc/' + id).then((res) => {
      this.getDocs();
      swal("Deleted!", "Doc file has been deleted", "success");
    }).catch(error => {
      swal("Error!", "Something Went wrong", "danger");
    }); 
  }

  handleClick = (action, e) => {
    let targetid = e.target.id;
    if (!e.target.id) {
      var children = e.target.parentElement.children;
      for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        if (tableChild.className.includes('active')) {
          targetid = tableChild.id;
        }
      }
      if (action == 'next') {
        targetid = parseInt(targetid) + 1;
      }
      if (action == 'prev') {
        targetid = parseInt(targetid) - 1;
      }
    }
    this.getUsers(targetid);
    this.setState({
      currentPage: Number(targetid)
    });
  }
  render() {
    let renderPageNumbers;
    if (this.state.total_records > this.state.pageLimit) {
      const pageNumbers = [];
      for (let i = 1; i <= this.state.current_pages; i++) {
        pageNumbers.push(i);
      }
      renderPageNumbers = pageNumbers.map(number => {
        let activeClass_ = '';
        if (this.state.currentPage == number) {
          activeClass_ = 'active';
        }
        return (
          <a key={number}
            id={number}
            onClick={this.handleClick.bind(this, 'current')}
            href="javascript:void(0)" className={activeClass_}>{number}</a>
        );
      });
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Documents List"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key={'0'}>Icon</th>
                        <th key={'0'}>Title</th>
                        <th key={'1'}>User</th>
                        <th key={'2'}>Date</th>
                        <th key={'3'}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.docs.map((prop, key) => {
                        let img = process.env.REACT_APP_URL+"files/docs/" + prop.images[0].name || "/assets/img/doc-1.png";
                        return (
                          <tr key={key}>
                            <td key={key + 1}><img src={img} alt="No Thumb" style={{ verticalAlign: 'bottom',width:'40px'}} className="doc-pic" /></td>
                            <td key={key+1}>{prop.title}</td>
                            <td key={key+2}>{prop.user_id.lastname}</td>
                            <td key={key+3}>{prop.created_at}</td>
                            <td key={key + 4}>
                            <NavDropdown
                              eventKey={2}
                              style={{listStyle:'none'}}
                              title="More"
                              id="basic-nav-dropdown-right"
                            >
                                <MenuItem onClick={this.deleteDoc.bind(this, prop._id)} eventKey={2.1}>Delete</MenuItem>
                              {/* <MenuItem eventKey={2.2}>Another action</MenuItem>
                              <MenuItem eventKey={2.3}>Something</MenuItem>
                              <MenuItem eventKey={2.4}>Another action</MenuItem>
                              <MenuItem eventKey={2.5}>Something</MenuItem>
                              <MenuItem divider />
                              <MenuItem eventKey={2.5}>Separated link</MenuItem> */}
                            </NavDropdown>
                            {/* <li className="folder_more_button">
                              <div className="dropdown">
                                <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">More
                                                                <span className="caret"></span></button>
                                <ul className="dropdown-menu" style={{ minWidth: '6rem' }}>
                                  <li><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.deleteFolder.bind(this, prop._id)} href="javascript:void(0)">Delete</a></li>
                                  <li><a className="btn btn-default" style={{ border: 'solid 1px' }} onClick={this.showRenamePop.bind(this, prop._id, 'folder')} href="javascript:void(0)">Rename</a></li>
                                </ul>
                              </div>
                            </li> */}
                            </td>
                            {/* {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })} */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
          <Row>
            {(() => {
              let disablesFields = {};
              let disablesFieldsprev = {};
              if ((this.state.currentPage * this.state.pageLimit) == this.state.total_records) {
                disablesFieldsprev['pointerEvents'] = 'none';
                disablesFieldsprev['color'] = 'burlywood';
              }
              if (this.state.currentPage == this.state.current_pages && this.state.users.length <= this.state.pageLimit) {
                disablesFieldsprev['pointerEvents'] = 'none';
                disablesFieldsprev['color'] = 'burlywood';
              }
              if (this.state.currentPage <= 1) {
                disablesFields['pointerEvents'] = 'none';
                disablesFields['color'] = 'burlywood';
              }
              if (this.state.total_records > this.state.pageLimit) {
                return (<div className="pagination">
                  <a href="javascript:void(0)" style={disablesFields} onClick={this.handleClick.bind(this, 'prev')}>&laquo;</a>
                  {renderPageNumbers}
                  <a href="javascript:void(0)" style={disablesFieldsprev} onClick={this.handleClick.bind(this, 'next')}>&raquo;</a>
                </div>)
              }
            })()}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Docs;
