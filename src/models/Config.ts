export interface IConfig {
  fields: {
    field: { key: string | number; name: string };
    operators: { key: string; name: string }[];
    values: (...params: any) => { key: string | number; name: string }[];
  }[];
}
