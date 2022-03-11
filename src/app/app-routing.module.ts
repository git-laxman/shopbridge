import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProductComponent } from './product/product.component';
import { ProductsListComponent } from './products-list/products-list.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children:  [ 
      { path: '', redirectTo: '/list', pathMatch: 'full' },
      { path: 'product', component: ProductComponent},
      { path: 'list', component: ProductsListComponent},
    ]
  },
  {
    path: '**',
    redirectTo: '/list'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
