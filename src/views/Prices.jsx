import React, { Component } from "react";
import swal from 'sweetalert';
import {
    Grid, Row, Col, Table, NavDropdown, MenuItem, Button, Modal, FormGroup,ControlLabel,FormControl } from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";

import Card from "components/Card/Card.jsx";
// import { thArray, tdArray } from "variables/Variables.jsx";
import axios from 'axios';
class Prices extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            token: localStorage.getItem('jwtToken'),
            prices: [],
            show: false,
            price:null,
            plan_type:null,
            content:null
        }
    }
    componentWillMount() {
        this.getPrices();
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    getPrices = () => {
        this.loaderToggle('show');
        axios.get(process.env.REACT_APP_API_URL + '/api/prices').then((res) => {
            this.setState({
                prices: res.data
            });
            this.loaderToggle('hide')
        }).catch(error => {
            console.log(error.response);
        });
    }

    deletePrice = (id, e) => {
        axios.delete(process.env.REACT_APP_API_URL + '/api/prices/' + id).then((res) => {
            var tbody = document.getElementById('price_table');
            tbody.removeChild(document.getElementById(id));
            swal("Deleted!", "Price has been deleted", "success");
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

    addPrice = (e) => {
        if (this.state.price && this.state.plan_type) {
            axios.post(process.env.REACT_APP_API_URL + '/api/addprice', this.state).then((res) => {
                this.getPrices();
                this.setState({ show: false });
                swal("Added!", "Price Added Successfully", "success");
            }).catch(error => {
                console.log(error.response);
            }); 
        }else{
            swal("Error!", "price and plan type required", "danger");
        }
        return false;
    }

    onChange = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Button variant="primary" onClick={this.handleShow}>
                        Add Price
                    </Button>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Price List"
                                ctTableFullWidth
                                ctTableResponsive
                                Card    content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th key={'0'}>Price</th>
                                                <th key={'1'}>Plan Type</th>
                                                <th key={'2'}>Date</th>
                                                <th key={'3'}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="price_table">
                                            {this.state.prices.map((prop, key) => {
                                                return (
                                                    <tr key={prop._id} id={prop._id}>
                                                        <td key={key + 1}>{prop.price}</td>
                                                        <td key={key + 2}>{prop.plan}</td>
                                                        <td key={key + 3}>{prop.created_at}</td>
                                                        <td key={key + 4}>
                                                            <NavDropdown
                                                                eventKey={2}
                                                                style={{ listStyle: 'none' }}
                                                                title="More"
                                                                id="basic-nav-dropdown-right"
                                                            >
                                                                <MenuItem onClick={this.deletePrice.bind(this, prop._id)} eventKey={2.1}>Delete</MenuItem>
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
                </Grid>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Body>
                        <Card
                            title="Add Price"
                            content={
                                <form>
                                    <FormInputs
                                        ncols={["col-md-6", "col-md-6"]}
                                        proprieties={[
                                            {
                                                label: "Price",
                                                type: "text",
                                                bsClass: "form-control",
                                                name:'price',
                                                onChange:this.onChange.bind(this),
                                                placeholder: "Enter Price"
                                            },
                                            {
                                                label: "Plan Type",
                                                type: "text",
                                                name:"plan_type",
                                                onChange: this.onChange.bind(this),
                                                bsClass: "form-control",
                                                placeholder: "Enter Plan Type Name"
                                            }
                                        ]}
                                    />
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup controlId="formControlsTextarea">
                                                <ControlLabel>Content</ControlLabel>
                                                <FormControl
                                                    rows="5"
                                                    componentClass="textarea"
                                                    bsClass="form-control"
                                                    name="content"
                                                    onChange={this.onChange.bind(this)}
                                                    placeholder="Enter Description"
                                                    defaultValue=""
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button bsStyle="info" onClick={this.addPrice.bind(this)} type="button">
                                        Add Price
                                    </Button>
                                    <Button variant="secondary" onClick={this.handleClose} style={{ float: 'right'}}>
                                        Cancel
                                    </Button>
                                    <div className="clearfix" />
                                </form>
                            }
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Prices;
