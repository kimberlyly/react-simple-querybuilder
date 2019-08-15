export interface ITree {
  tree: [
    {
      f: { k: string | number; v: string };
      o: { k: string; v: string };
      v: { k: string | number; v: string };
    }
  ];
}

export interface IRowType {
  f?: { k: string | number; v: string };
  o?: { k: string; v: string };
  v?: { k: string | number; v: string };
}
