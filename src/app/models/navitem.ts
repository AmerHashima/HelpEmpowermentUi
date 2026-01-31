// src\app\models\navitem.ts
export interface Navitem {
  name: string,
  nameAr: string,
  icon: string,
  subItems?: Navitem[];
  route: string
}
