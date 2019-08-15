import * as React from "react";
import FilteredDropdown from "../Widgets/FilteredDropdown";
import { IConfig } from "../../models/Config";
import { IRowType } from "../../models/Tree";

export interface IRowProps {
  config: IConfig;
  loadRow?: IRowType;
  onChange?: (row: IRowType, index: number) => void;
  index: number;
}

export interface IRowState {
  row?: IRowType;
  fields: { key: string | number; name: string }[];
  ops: { key: string; name: string }[];
  values: { key: string | number; name: string }[];
}
export class Row extends React.Component<IRowProps, IRowState> {
  constructor(props: IRowProps) {
    super(props);

    this.state = {
      row: props.loadRow,
      fields: [],
      ops: [],
      values: []
    };
  }

  public componentDidMount() {
    let fields: { key: string | number; name: string }[] = [];
    this.props.config.fields.forEach(field => {
      fields.push(field.field);
    });

    this.setState({
      fields
    });

    if (this.state.row) {
      const fieldConfig = this.props.config.fields.find(field => {
        return field.field.key === this.state.row!.f!.k;
      });

      if (fieldConfig) {
        this.setState({
          ops: fieldConfig.operators,
          values: fieldConfig.values()
        });
      }
    }
  }

  public componentDidUpdate(prevProps: IRowProps, prevState: IRowState) {
    if (prevState.row !== this.state.row) {
      const fieldConfig = this.props.config.fields.find(field => {
        return field.field.key === this.state.row!.f!.k;
      });

      if (fieldConfig) {
        this.setState({
          ops: fieldConfig.operators,
          values: fieldConfig.values()
        });
      }

      if (this.state.row && this.props.onChange) {
        this.props.onChange(this.state.row, this.props.index);
      }
    }
  }
  public render() {
    let currentField: { key: string | number; name: string } | undefined;
    let currentOp: { key: string; name: string } | undefined;
    let currentValue: { key: string | number; name: string } | undefined;

    if (this.state.row) {
      currentField = {
        key: this.state.row.f!.k,
        name: this.state.row.f!.v
      };

      if (this.state.row.o) {
        currentOp = {
          key: this.state.row.o.k,
          name: this.state.row.o.v
        };
      }

      if (this.state.row.v) {
        currentValue = {
          key: this.state.row.v.k,
          name: this.state.row.v.v
        };
      }
    }

    return (
      <tr>
        <td>
          <FilteredDropdown
            values={this.state.fields}
            currentValue={currentField}
            onSelect={this.setField}
          />
        </td>
        <td>
          {this.state.row && this.state.row.f ? (
            <FilteredDropdown
              values={this.state.ops}
              currentValue={currentOp}
              onSelect={this.setOperator}
            />
          ) : (
            <></>
          )}
        </td>
        <td>
          {this.state.row && this.state.row.o ? (
            <FilteredDropdown
              values={this.state.values}
              currentValue={currentValue}
              onSelect={this.setValues}
            />
          ) : (
            <></>
          )}
        </td>
      </tr>
    );
  }

  private setField = (newValue: { key: string | number; name: string }) => {
    this.setState({
      row: Object.assign(
        {},
        {
          f: {
            k: newValue.key,
            v: newValue.name
          },
          o: undefined,
          v: undefined
        }
      )
    });
  };

  private setOperator = (newValue: { key: string; name: string }) => {
    this.setState({
      row: {
        ...this.state.row,
        f: this.state.row!.f,
        o: {
          k: newValue.key,
          v: newValue.name
        },
      }
    });
  };
  private setValues = (newValue: { key: string | number; name: string }) => {
    this.setState({
      row: {
        ...this.state.row,
        f: this.state.row!.f,
        v: {
          k: newValue.key,
          v: newValue.name
        }
      }
    });
  };
}
