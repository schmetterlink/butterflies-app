import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import React from "react";

class NestedList {
    renderData(prefix, data, classes) {
        let props = [];
        let relations = [];
        if (Object.keys(data).length > 0) {
            for (let key in data) {
                let table = [];
                if (typeof data[key] != "object" || data[key] === null) {
                    props.push(
                        <TableRow key={prefix+"-data-"+key}>
                            <TableCell>
                                {key}
                            </TableCell>
                            <TableCell>
                                {data[key]}
                            </TableCell>
                        </TableRow>
                    );
                } else {
                    table = this.renderObject(prefix+"-"+key, data[key], classes);
                    relations.push(<h2 key={"headline-"+key}>{key}</h2>);
                    relations.push(table);
                }
            }
        }
        return (
            <div>
                <Table className="alternateRows" key={prefix+"-table"}>
                    <TableBody>{props}</TableBody>
                </Table>
                {relations}
            </div>
        );
    }

    renderObject(prefix, object, classes, level, maxdepth) {
        if (classes === undefined) {
            classes = "sublist";
        }
        if (level === undefined) {
            level = 1;
        }
        if (level > maxdepth && maxdepth !== undefined) {
            return null;
        }
        let head = [];
        let body = [];
        if (typeof object == "object") {
            if (level % 2 === 0) {
                /* horizontal */
                let cols = []
                for (let key in object) {
                    let cname;
                    cname = "field-"+key;
                    if (parseInt(key) === key) {
                        cname = "field-list";
                    }
                    if (typeof object[key] == 'object') {
                        console.debug(cname);
                        cols.push(<TableCell className={cname} title={key} key={prefix+"-cell-"+key}>{this.renderObject(prefix, object[key],"sublist-item", level + 1)}</TableCell>)
                    } else {
                        cols.push(<TableCell className={cname} title={key} key={prefix+"-cell-"+key}>{object[key]}</TableCell>)
                    }
                }
                body.push(<TableRow>{cols}</TableRow>)
            } else {
                /* vertical */
                if (object instanceof Array) {
                    let cols = []
                    let allNumeric = true
                    for (let key in object[0]) {
                        cols.push(<TableCell key={prefix+"-cell-"+key}>{key}</TableCell>)
                        if (parseInt(key) !== key) {
                            allNumeric = false;
                        }

                    }
                    if (!allNumeric) {
                        head.push(<TableRow key={prefix+"-fieldnames"}>{cols}</TableRow>)
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
                            body.push(<TableRow key={prefix+"-"+key}><TableCell className={cname} title={key}>{this.renderObject(prefix, object[key],"sublist-item", level + 1)}</TableCell></TableRow>)
                        } else {
                            body.push(<TableRow key={prefix+"-"+key}><TableCell className={cname} title={key}>{object[key]}</TableCell></TableRow>)
                        }
                    }

                }
            }
            return (<Table className={classes+" objectTable level-"+level}><TableHead>{head}</TableHead><TableBody>{body}</TableBody></Table>)
        } else {
            return (<Table className={classes+" flatTable level-"+level}><TableBody><TableRow><TableCell>{object}</TableCell></TableRow></TableBody></Table>)
        }
    }

    renderRows(prefix, rows, classes, level, maxdepth) {
        let tableRows = [];
        console.debug("rendering ["+rows.length+"] rows");
        for (let row in rows) {
            let cname = "field-row-"+row;
            if (typeof rows[row] == 'object' && rows[row] !== undefined) {
                let cols = [];
                for (let key in rows[row]) {
                    let cname;
                    let object = rows[row][key];
                    cname = "field-"+key;
                    if (parseInt(key) === key) {
                        cname = "field-list";
                    }
                    if (typeof object == 'object') {
                        cols.push(<TableCell className={cname} title={key} key={prefix+"-cell-"+key}>{this.renderObject(prefix+"-"+key, object,"sublist-item", level + 1)}</TableCell>)
                    } else {
                        cols.push(<TableCell className={cname} title={key} key={prefix+"-cell-"+key}>{object}</TableCell>)
                    }
                }
                tableRows.push(<TableRow key={prefix+"-list-"+row}>{cols}</TableRow>);
            } else {
                tableRows.push(<TableRow key={prefix+"-list-"+row}><TableCell className={cname} title={"#"+(row+1)}>{rows[row]}</TableCell></TableRow>)
            }
        }
        return tableRows;

    }
}

export default NestedList;