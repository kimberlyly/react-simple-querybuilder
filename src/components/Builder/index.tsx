import * as React from "react";
import { IConfig } from "../../models/Config";
import { ITree, IRowType } from "../../models/Tree";
import { Row } from "../Row";
import { PrimaryButton } from "office-ui-fabric-react/lib-commonjs";

export interface IQuerybuilderRow {}

export interface IBuilderProps {
  config: IConfig;
  loadRows?: IRowType[];
}

export interface IBuilderState {
  queryString: string;
  rows: IRowType[];
}
export class Builder extends React.Component<IBuilderProps, IBuilderState> {
  constructor(props: IBuilderProps) {
    super(props);

    this.state = {
      queryString: props.loadRows ? this.getQueryString(props.loadRows) : "",
      rows: props.loadRows ? props.loadRows : []
    };
  }
  public render() {
    return (
      <div>
        <PrimaryButton onClick={this.addRow}>Add row</PrimaryButton>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Operator</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {this.state.rows.map((row, index) => {
              return (
                <Row
                  config={this.props.config}
                  onChange={this.onRowChange}
                  loadRow={row}
                  index={index}
                  key={`row-${index}`}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  private onRowChange = (row: IRowType, index: number) => {
    const { rows } = this.state;
    rows[index] = row;

    this.setState({
      rows: Object.assign([], rows),
      queryString: this.getQueryString()
    });
  };

  private getQueryString = (rows?: IRowType[]) => {
    let rowsToParse: IRowType[] = [];
    if (!rows) {
      rowsToParse = this.state.rows;
    } else {
      rowsToParse = rows;
    }
    let queryStrings: string[] = [];

    rowsToParse.forEach(row => {
      let query = "";

      if (row.f && row.o && row.v) {
        if (typeof row.v.k === "string") {
          if (
            row.o.k.toUpperCase() === "IN" ||
            row.o.k.toUpperCase() === "NOT IN"
          ) {
            query = `${row.f.k} ${row.o ? row.o.k : " "} (${
              row.v ? row.v.k : ""
            })`;
          } else {
            query = `${row.f.k} ${row.o ? row.o.k : " "} '${
              row.v ? row.v.k : ""
            }'`;
          }
        }
      }

      queryStrings.push(query);
    });

    return queryStrings.join(' OR ');
  };

  private addRow = () => {
    const { rows } = this.state;
    rows.push({
      f: { k: "", v: "" }
    });

    this.setState({
      rows: Object.assign([], rows)
    });
  };
}

export default Builder;
