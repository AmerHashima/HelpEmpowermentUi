import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RoleService } from '../../../Services/role.service';
import { AppLink, Role, RoleLink, SaveRole, SaveRoleLink } from '../../../models/role';
import { createdUpdatedOID } from '../../../data/lookUPS';
import { confirmDelete } from '../../../shared/utils/confirm-delete';

@Component({ selector: 'app-roles', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './roles.component.html', styleUrl: './roles.component.scss' })
export class RolesComponent {
  private service = inject(RoleService);
  roles = signal<Role[]>([]); links = signal<AppLink[]>([]); roleLinks = signal<RoleLink[]>([]);
  loading = signal(false); saving = signal(false); errorMessage = signal(''); editingRoleId = signal(''); activeTab = signal<'details'|'links'>('details');
  role: SaveRole = this.emptyRole(); link: SaveRoleLink = this.emptyLink();
  constructor() { this.loadRoles(); }
  edit(role: Role): void { this.editingRoleId.set(role.oid); this.activeTab.set('details'); this.role = { oid: role.oid, name: role.name, description: role.description, isActive: role.isActive, updatedBy: createdUpdatedOID }; this.loadLinks(role.oid); }
  newRole(): void { this.editingRoleId.set(''); this.activeTab.set('details'); this.role = this.emptyRole(); this.roleLinks.set([]); }
  saveRole(form: NgForm): void { if (form.invalid || this.saving()) { form.control.markAllAsTouched(); return; } this.saving.set(true); const request = this.editingRoleId() ? this.service.update({ ...this.role, oid: this.editingRoleId(), updatedBy: createdUpdatedOID }) : this.service.create({ ...this.role, createdBy: createdUpdatedOID }); request.subscribe({ next: saved => { this.saving.set(false); this.edit(saved); this.loadRoles(); }, error: e => { this.saving.set(false); this.errorMessage.set(this.error(e)); } }); }
  async removeRole(role: Role): Promise<void> { if (await confirmDelete(`Delete role ${role.name}?`)) this.service.delete(role.oid).subscribe({ next: () => { if(this.editingRoleId()===role.oid)this.newRole(); this.loadRoles(); }, error:e=>this.errorMessage.set(this.error(e)) }); }
  saveLink(form: NgForm): void { if(form.invalid || !this.editingRoleId()) { form.control.markAllAsTouched(); return; } this.saving.set(true); const existing=this.roleLinks().find(x=>x.linkId===this.link.linkId); const body={...this.link, oid:existing?.oid, roleId:this.editingRoleId(), ...(existing?{updatedBy:createdUpdatedOID}:{createdBy:createdUpdatedOID})}; const request=existing?this.service.updateRoleLink(body):this.service.createRoleLink(body); request.subscribe({next:()=>{this.saving.set(false);this.link=this.emptyLink();this.loadLinks(this.editingRoleId());},error:e=>{this.saving.set(false);this.errorMessage.set(this.error(e));}}); }
  editLink(item: RoleLink): void { this.link={...item,updatedBy:createdUpdatedOID}; }
  async removeLink(item:RoleLink):Promise<void>{if(await confirmDelete('Remove this link from the role?'))this.service.deleteRoleLink(item.oid).subscribe({next:()=>this.loadLinks(this.editingRoleId()),error:e=>this.errorMessage.set(this.error(e))});}
  linkName(id:string):string{const item=this.links().find(x=>x.oid===id);return item?.nameEn||item?.path||'-';}
  get roleAsItem():Role{return{oid:this.editingRoleId(),name:this.role.name,description:this.role.description,isActive:this.role.isActive};}
  private loadRoles():void{this.loading.set(true);this.service.search().subscribe({next:r=>{this.roles.set(r.data??[]);this.loading.set(false);},error:e=>{this.loading.set(false);this.errorMessage.set(this.error(e));}});}
  private loadLinks(roleId:string):void{forkJoin({links:this.service.links(),assigned:this.service.roleLinks(roleId)}).subscribe({next:r=>{this.links.set(r.links.filter(x=>x.isActive));this.roleLinks.set(r.assigned);},error:e=>this.errorMessage.set(this.error(e))});}
  private emptyRole():SaveRole{return{name:'',description:'',isActive:true};} private emptyLink():SaveRoleLink{return{roleId:'',linkId:'',canRead:true,canWrite:false,canEdit:false,canDelete:false,isActive:true};}
  private error(value:unknown):string{return value instanceof Error?value.message:'The operation could not be completed.';}
}
