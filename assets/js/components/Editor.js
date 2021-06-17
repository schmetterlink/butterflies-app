import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import NestedList from "../classes/NestedList";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Network from "../classes/Network";

function getModalStyle() {
    const top = 60;
    const left = 40;

    return {
        position: `fixed`,
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 80,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
});


class EditorNaked extends React.Component {
    constructor(props) {
        super(props);
        this.childkey = 0;
        this.state = {
            open: false,
            data: undefined,
            originalData: {}
        }
        ;
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    setEntity(entity = undefined, id = undefined, protectedFields = ["id", "createdAt", "updatedAt"]) {
        this.state.entity = entity;
        this.state.id = id;
        this.state.protectedFields = protectedFields;
    }

    handleOpen(e) {
        this.resetData(e);
        this.setState({open: true});
    };

    handleClose(e) {
        this.resetData(e);
        this.setState({open: false, data: {}, originalData: {}});
    };
    handleChange(e) {
        if (this.state.originalData[e.target.name] === undefined) {
            this.state.originalData[e.target.name] = this.state.data[e.target.name];
        }
        this.state.data[e.target.name] = e.target.value;
    }

    toggle(e) {
        this.state.open ? this.handleClose(e) : this.handleOpen(e);
    }

    setData(data) {
        console.debug(data);
        this.setState({originalData: {}, data: data});
    }
    getFields(data = undefined) {
        if (data === undefined) {
            data = this.state.data;
        }
        let tableRows = [];
        console.debug("creating input fields for data.");
        if (this.state.protectedFields.length) console.debug("protected fields: "+this.state.protectedFields.toString());
        console.debug(data);
        for (let row in data) {
            let cname = "field-row-" + row;
            let readOnly = this.state.protectedFields.includes(row);
            tableRows.push(
                <TableRow key={cname}>
                    <TableCell>{row}</TableCell>
                    <TableCell>
                        <input
                            name={row}
                            readOnly={readOnly}
                            type={"text"}
                            defaultValue={data[row]}
                            onChange={this.handleChange.bind(this)}
                        />
                    </TableCell>
                </TableRow>);
        }
        return tableRows
    }
    submitData(event) {
        event.preventDefault();
        console.debug("submitting data fields for "+this.state.entity+" #"+this.state.ideal);
        if (this.props.submitCallback) {
            this.props.submitCallback(this.state.data, this.state.entity, this.state.id, event);
        }

    }
    resetData(event) {
        console.debug("resetting data fields");
        for (let key in this.state.originalData) {
            this.state.data[key] = this.state.originalData[key];
        }
        this.setState({data: this.state.data, originalData: {}});
    }

    render() {
        ++this.childkey;
        const {classes} = this.props;
        return (
            this.state.open ? (
                    <div style={getModalStyle()} className={classes.paper} key={"editor-"+this.childkey}>
                        <form id={"edit-"+this.state.entity+"-"+this.state.data.id} method="PUT" onSubmit={this.submitData.bind(this)}>
                        <Table>
                            <TableHead><TableRow><TableCell>Editor {this.state.entity} #{this.state.id}</TableCell></TableRow></TableHead>
                            <TableBody>
                                    {this.getFields()}
                            </TableBody>
                        </Table>
                            <Button type="submit" variant="contained" color="primary">save</Button>
                            <Button variant="contained" color="primary" onClick={this.resetData.bind(this)}>reset</Button>
                            <Button variant="contained" color="secondary" onClick={this.handleClose.bind(this)}>X</Button>
                        </form>
                        <div>{/* new NestedList().renderData("data", this.state.data) */}
                        </div>
                    </div>
                ) : (
                    <div></div>
                )

        );
    }
}

EditorNaked.propTypes = {
    classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const Editor = withStyles(styles)(EditorNaked);

export default Editor;