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
    const top = 30;
    const left = 40;

    return {
        overflow: `auto`,
        height: `80%`,
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
            metaData: undefined,
            files: {},
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
        if (event.target.files) {
            console.debug("a file has been selected for upload to field '" + e.target.name + "':");
            console.debug(event.target.files);
            this.state.files[e.target.name] = event.target.files;
        }
        this.state.data[e.target.name] = e.target.value;
    }

    toggle(e) {
        this.state.open ? this.handleClose(e) : this.handleOpen(e);
    }

    setMetaData(metaData) {
        this.setState({metaData: metaData});
    }

    getMetaDataFor(field) {
        return this.state.metaData[field];
    }

    setData(data, metaData = undefined) {
        console.debug({"data": data, "metaData": metaData});
        if (metaData === undefined) {
            console.warn("no meta data available for " + this.state.entity + " #" + this.state.id);
        } else {
            this.setMetaData(metaData);
        }
        this.setState({originalData: {}, data: data});
    }

    getFields(data = undefined) {
        if (data === undefined) {
            data = this.state.data;
        }
        let tableRows = [];
        if (this.state.protectedFields.length) console.debug("protected fields: " + this.state.protectedFields.toString());
        for (let row in data) {
            let cname = "field-row-" + row;
            let readOnly = this.state.protectedFields.includes(row);
            let fieldMeta = this.getMetaDataFor(row);
            let comment = fieldMeta?.options?.comment;
            let inputType = comment?.indexOf("upload") !== undefined ? "file" : "text";
            let image = '';
            let value = data[row];
            if (typeof value === "object" && value !== null) {
                value = value?.id ? value.id : '[OBJECT]';
            }

            let inputField = <input
                name={row}
                readOnly={readOnly}
                type={inputType}
                defaultValue={value}
                onChange={this.handleChange.bind(this)}
            />

            if (inputType === "file") {
                image = <img alt={row} src={data[row]} className={"thumbnail"}/>
                inputField = <input
                    name={row}
                    readOnly={readOnly}
                    type="file"
                    onChange={this.handleChange.bind(this)}
                />
            }
            tableRows.push(
                <TableRow key={cname}>
                    <TableCell>{row}</TableCell>
                    <TableCell className={comment}>
                        {inputField}
                    </TableCell>
                    <TableCell>
                        {image}
                    </TableCell>
                </TableRow>);
        }
        return tableRows
    }
    submitData(event) {
        event.preventDefault();
        console.debug("submitting data fields for "+this.state.entity+" #"+this.state.ideal);
        if (this.props.submitCallback) {
            this.props.submitCallback(this.state.data, this.state.files, this.state.entity, this.state.id, event);
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
                    <div style={getModalStyle()} className={classes.paper + " editor-modal"}
                         key={"editor-" + this.childkey}>
                        <form id={"edit-" + this.state.entity + "-" + this.state.data.id} method="PUT"
                              onSubmit={this.submitData.bind(this)}>
                            <Table>
                                <TableHead><TableRow><TableCell
                                    colSpan={3}>Editor {this.state.entity} #{this.state.id}</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {this.getFields()}
                                </TableBody>
                            </Table>
                            <Button type="submit" variant="contained" color="primary">save</Button>
                            <Button variant="contained" color="primary"
                                    onClick={this.resetData.bind(this)}>reset</Button>
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