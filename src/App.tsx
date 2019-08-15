import React from "react";
import "./App.css";
import { Builder } from "./components/Builder";
import { initializeIcons } from '@uifabric/icons';
import { IConfig } from "./models/Config";
import { IRowType } from "./models/Tree";
initializeIcons();

export class App extends React.Component {

  public render() {
    let fields = [];

    for (let i = 0; i < 10; i++) {
      fields.push({
        key: i,
        name: `kimberly${i}`
      });
    }
  
    const operators = [
      {
        key: '=',
        name: 'Equals'
      },
      {
        key: '<=',
        name: 'Less than or equal to'
      },
      {
        key: '<>',
        name: 'Not equal to'
      }
    ];
  
    const config: IConfig = {
      fields: [
        {
          field: { key: 'StandardTitle', name: 'Standard Title' },
          operators: [{ key: '=', name: 'Equals' }],
          values: this.getStandardTitles
        },
        {
          field: { key: 'Profession', name: 'Profession'},
          operators: [{ key: '<>', name: "Not equals"}],
          values: this.getProfessions
        }
      ]
    }

    const serializedTree = '[{"f":{"k":"StandardTitle","v":"Standard Title"},"o":{"k":"=","v":"Equals"},"v":{"k":"Software Engineer 2","v":"Software Engineer 2"}},{"f":{"k":"Profession","v":"Profession"},"o":{"k":"<>","v":"Not equals"},"v":{"k":"Sales","v":"Sales"}}]';

    const loadRows: IRowType[] = JSON.parse(serializedTree);
    return (
      <div className="App">
        <Builder config={config} loadRows={loadRows}/>
      </div>
    );
  }
 
  private getStandardTitles = () => {
    return [
      {
        key: 'Software Engineer 2',
        name: 'Software Engineer 2'
      },
      {
        key: 'Software Engineer 1',
        name: 'Software Engineer 1'
      }
    ]
  }

  private getProfessions = () => {
    return [
      {
        key: 'Engineer',
        name: 'Engineer'
      },
      {
        key: 'Sales',
        name: 'Sales'
      }
    ]
  }
}

export default App;
