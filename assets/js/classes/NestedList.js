import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import React from "react";
import Button from "@material-ui/core/Button";

class NestedList {
    actions = [];
    appendix = 0;
    constructor(actions = []) {
        this.actions = actions;
    }
    getUKI(prefix = "key") {
        ++this.appendix;
        //console.debug("unique key: "+prefix+"-"+this.appendix);
        return prefix + "-" + this.appendix;
    }

    renderData(prefix, data, classes, maxdepth = undefined) {
        let props = [];
        let relations = [];
        if (Object.keys(data).length > 0) {
            for (let key in data) {
                let table = [];
                if (typeof data[key] != "object" || data[key] === null) {
                    props.push(
                        <TableRow key={this.getUKI(prefix + "-row-" + key)}>
                            <TableCell>
                                {key}
                            </TableCell>
                            <TableCell>
                                {data[key]}
                            </TableCell>
                        </TableRow>
                    );
                } else {
                    table = this.renderObject(prefix + "-" + key, data[key], classes, 0, maxdepth);
                    relations.push(<h2 key={this.getUKI(prefix + "-h2-" + key)}>{key}</h2>);
                    relations.push(table);
                }
            }
        }
        return (
            <div>
                <Table className="alternateRows">
                    <TableBody>{props}</TableBody>
                </Table>
                {relations}
            </div>
        );
    }

    renderObject(prefix, object, classes, level = 1, maxdepth = undefined) {
        if (classes === undefined) {
            classes = "sublist";
        }
        if (maxdepth !== undefined && level > maxdepth) {
            console.log("renderObject max nesting level reached (" + level + "/" + maxdepth + ")");
            return object?.id ? object.id : "[OBJECT]";
        }
        let head = [];
        let body = [];
        if (typeof object == "object") {
            if (level % 2 === 1) {
                /* horizontal */
                let cols = []
                for (let key in object) {
                    let cname;
                    cname = "field-" + key;
                    if (parseInt(key) === key) {
                        cname = "field-list";
                    }
                    if (typeof object[key] == 'object') {
                        console.debug(cname);
                        cols.push(<TableCell className={cname} title={key}
                                             key={this.getUKI(prefix + "-" + level + "-" + key)}>{this.renderObject(prefix, object[key], "sublist-item", level + 1, maxdepth)}</TableCell>)
                    } else {
                        cols.push(<TableCell className={cname} title={key} key={this.getUKI(prefix+"-"+level+"-"+key)}>{object[key]}</TableCell>)
                    }
                }
                body.push(<TableRow>{cols}</TableRow>)
            } else {
                /* vertical */
                if (object instanceof Array) {
                    let cols = []
                    let allNumeric = true
                    for (let key in object[0]) {
                        cols.push(<TableCell key={this.getUKI(prefix+"-"+key)}>{key}</TableCell>)
                        if (parseInt(key) !== key) {
                            allNumeric = false;
                        }

                    }
                    cols.push(<TableCell key={this.getUKI(prefix + "-actions")}
                                         className={"action-panel"}>actions</TableCell>);
                    if (!allNumeric) {
                        head.push(<TableRow key={this.getUKI(prefix+"-fieldame")}>{cols}</TableRow>)
                    }
                    body.push(this.renderRows(prefix, object, classes, level + 1, maxdepth));
                } else {
                    for (let key in object) {
                        let cname;
                        cname = "field-"+key;
                        if (parseInt(key) === key) {
                            cname = "field-list";
                        }
                        if (typeof object[key] == 'object') {
                            body.push(<TableRow key={this.getUKI(prefix + "-" + key)}><TableCell className={cname}
                                                                                                 title={key}>{this.renderObject(prefix, object[key], "sublist-item", level + 1, maxdepth)}</TableCell></TableRow>)
                        } else {
                            body.push(<TableRow key={this.getUKI(prefix+"-"+key)}><TableCell className={cname} title={key}>{object[key]}</TableCell></TableRow>)
                        }
                    }

                }
            }
            return (<Table className={classes+" objectTable level-"+level}><TableHead>{head}</TableHead><TableBody>{body}</TableBody></Table>)
        } else {
            return (<Table
                className={classes + " flatTable level-" + level}><TableBody><TableRow><TableCell>{object}</TableCell></TableRow></TableBody></Table>)
        }
    }

    editEntry(data, action, event = undefined) {
        console.debug("trigger callback function for action " + action.name);
        if (action.callback) {
            action.callback(data, action, event);
        }
    }

    renderRows(prefix, rows, classes, level = 1, maxdepth = undefined) {
        if (maxdepth !== undefined && level > maxdepth) {
            console.log("renderRows max nesting level reached (" + level + "/" + maxdepth + ")");
            return null;
        }
        let tableRows = [];
        if (rows.length > 0) console.debug("rendering [" + rows.length + "] rows");
        for (let row in rows) {
            let cname = "field-row-" + row;
            if (typeof rows[row] == 'object' && rows[row] !== undefined) {
                let cols = [];
                for (let key in rows[row]) {
                    let cname;
                    let object = rows[row][key];
                    cname = "field-" + key;
                    if (parseInt(key) === key) {
                        cname = "field-list";
                    }
                    let keyName = this.getUKI(prefix+"-"+row+"-"+key);
                    if (typeof object == 'object') {
                        cols.push(<TableCell className={cname} title={key}
                                             key={keyName}>{this.renderObject(prefix + "-" + key, object, "sublist-item", level + 1, maxdepth)}</TableCell>)
                    } else {
                        cols.push(<TableCell className={cname} title={key} key={keyName}>{object}</TableCell>)
                    }
                }
                let actionButtons = [];
                for (const key in this.actions) {
                    let action = this.actions[key];
                    actionButtons.push(<Button variant="contained" key={this.getUKI(prefix+"-button-"+row+"-"+key)} color={action.class} onClick={this.editEntry.bind(this,rows[row],action)}>{action.name}</Button>);
                }
                cols.push(<TableCell key={this.getUKI(prefix+"-cell-"+row)}>{actionButtons}</TableCell>);
                tableRows.push(<TableRow key={this.getUKI(prefix+"-list-"+row)}>{cols}</TableRow>);
            } else {
                tableRows.push(<TableRow key={this.getUKI(prefix+"-list-"+row)}><TableCell className={cname} title={"#"+(row+1)}>{rows[row]}</TableCell></TableRow>)
            }
        }
        return tableRows;

    }
}

export default NestedList;