export interface IResponseCategory {
  categories: Category[];
}

export interface Category {
  _id: string;
  name: string;
  parent_category?: ParentCategory;
  __v: number;
}

export interface ParentCategory {
  _id: string;
  name: string;
}
