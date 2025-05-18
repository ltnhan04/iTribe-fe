export interface IResponseDeletedCategory {
  message: string;
}
export interface IResponseCategory {
  message: string;
  category: Category;
}

export interface IResponseCategories {
  categories: Category[];
}

export interface Category {
  _id?: string;
  name: string;
  parent_category?: ParentCategory;
}

export interface ParentCategory {
  _id: string;
  name: string;
}
