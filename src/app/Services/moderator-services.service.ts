import { Injectable, signal } from '@angular/core';
import { Filter } from '../models/rquest';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {
  moderators = signal<any[]>([]);
  total = signal<number>(0);
  pageNumber = signal<number>(0);
  pageSize = signal<number>(10);
  filters = signal<Filter[]>([])
  constructor() { }

  deleteModerator(oid:string){}
  reloadModerators(pageNumber: number) {}
}
