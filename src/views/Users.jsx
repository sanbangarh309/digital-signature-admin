import React, { Component } from "react";
import swal from 'sweetalert';
import { Grid, Row, Col, Table, NavDropdown, MenuItem } from "react-bootstrap";


import Card from "components/Card/Card.jsx";
// import { thArray, tdArray } from "variables/Variables.jsx";
import axios from 'axios';
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('jwtToken'),
            users: [],
            pageLimit:4,
            currentPage: 1,
            current_pages: null,
            total_records: 0,
        }
    }
    componentWillMount() {
        this.getUsers();
    }

    getUsers = (page=1) => {
        this.loaderToggle('show');
        axios.post(process.env.REACT_APP_API_URL + '/api/users', { token: this.state.token, page: page ? page : this.state.currentPage, pageLimit: this.state.pageLimit }).then((res) => {
            this.setState({
                users: res.data.users, current_pages: res.data.page, total_records: res.data.total_pages
            });
            this.loaderToggle('hide');
        }).catch(error => {
            console.log(error.response);
        });
    }

    loaderToggle = (action) => {
        if (action == 'hide') {
            let elem = document.getElementById('san_loader');
            elem.remove();
        }else{
            let elem = document.createElement('div');
            // elem.className = 'fa fa-spinner fa-spin fa-5x';
            elem.style.fontSize = '24px';
            elem.id = 'san_loader';
            document.body.insertBefore(elem, document.body.childNodes[0]);
        }
    }

    deleteUser = (id, e) => {
        axios.delete(process.env.REACT_APP_API_URL + '/api/users/' + id).then((res) => {
            this.getUsers();
            swal("Deleted!", "User has been deleted", "success");
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
                        onClick={this.handleClick.bind(this,'current')}
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
                                title="Users List"
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th key={'0'}>Name</th>
                                                <th key={'1'}>Email</th>
                                                <th key={'2'}>Date</th>
                                                <th key={'3'}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.users.map((prop, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td key={key + 1}>{prop.lastname}</td>
                                                        <td key={key + 2}>{prop.email}</td>
                                                        <td key={key + 3}>{prop.createdAt}</td>
                                                        <td key={key + 4}>
                                                            <NavDropdown
                                                                eventKey={2}
                                                                style={{ listStyle: 'none' }}
                                                                title="More"
                                                                id="basic-nav-dropdown-right"
                                                            >
                                                                <MenuItem onClick={this.deleteUser.bind(this, prop._id)} eventKey={2.1}>Delete</MenuItem>
                                                            </NavDropdown>
                                                        </td>
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

export default Users;
