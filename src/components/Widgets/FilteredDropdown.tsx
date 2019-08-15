import * as React from "react";
import { TextField } from "office-ui-fabric-react/lib-commonjs";
import "./FilteredDropdown.scss";
import * as KeyCode from "keycode-js";

export interface IFilteredDropdownProps {
  values: { key: string | number; name: string }[];
  currentValue?: { key: string | number; name: string };
  onSelect?: (newValue: any) => void;
}

export interface IFilteredDropdownState {
  showDropdown: boolean;
  visibleValues: { key: string | number; name: string }[];
  value?: { key: string | number; name: string };
}

export class FilteredDropdown extends React.Component<
  IFilteredDropdownProps,
  IFilteredDropdownState
> {
  constructor(props: IFilteredDropdownProps) {
    super(props);

    this.state = {
      showDropdown: false,
      visibleValues: this.props.values,
      value: this.props.currentValue
    };
  }

  public render() {
    return (
      <div>
        <TextField
          onChange={this.onTextChange}
          onFocus={this.onTextfieldFocus}
          value={this.state.value ? this.state.value.name : ''}
          onKeyDown={this.autocomplete}
        />
        <ul
          className={`filtered-dropdown ${
            this.state.showDropdown ? "open-dropdown" : "close-dropdown"
          }`}
          tabIndex={0}
        >
          {this.state.visibleValues.map((value, index) => {
            return (
              <li
                onClick={this.onOptionClick}
                onFocus={this.onOptionFocus}
                data-key={value.key}
                tabIndex={0}
                key={`li-${index}`}
              >
                {value.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  private onTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    if (newValue && newValue !== "") {
      const visibleValues = this.props.values.filter(value => {
        return value.name.toLowerCase().includes(newValue.toLowerCase());
      });

      this.setState({
        showDropdown: true,
        visibleValues,
        value: { key: "", name: newValue }
      });
    } else {
      this.setState({
        showDropdown: false,
        visibleValues: this.props.values,
        value: { key: "", name: "" }
      });
    }
  };

  private onOptionFocus = (event: React.FocusEvent<HTMLLIElement>) => {
    const target = event.target as Element;
    const key = target.getAttribute("data-key");

    this.setState({
      value: { key: key ? key : "", name: target.innerHTML }
    });
  }

  private onOptionClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const target = event.target as Element;
    const key = target.getAttribute("data-key");
    const value = { key: key ? key : "", name: target.innerHTML };
    this.setState({
      value,
      showDropdown: false
    });

    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  };
  private onTextfieldFocus = () => {
    this.setState({
      showDropdown: true,
      visibleValues: this.props.values
    });
  };

  private onBlur = () => {
    this.setState({
      showDropdown: false
    });
  };

  private autocomplete = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const keyPressed = event.keyCode;

    if (keyPressed === KeyCode.KEY_TAB) {
      this.setState({
        value: this.state.visibleValues[0],
        showDropdown: false
      });
    }
  };
}

export default FilteredDropdown;
