import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { ProfileComponent } from '../profile/profile.component';
import { SalesforceComponent } from './salesforce.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ReturnComponent } from './return/return.component';
import { SuggestionComponent } from './suggestion/suggestion.component';
import { HistoryComponent } from './history/history.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductComponent } from './product/product.component';
import { CatalogComponent } from './catalog/catalog.component';

const routes: Routes = [{ 
  path: '', 
  component: SalesforceComponent,
  children:[{
    path: 'gallery',
    component:GalleryComponent
  },{
    path: 'profile',
    component:ProfileComponent
  },{
    path: 'help',
    component:HelpComponent
  },{
    path: 'return',
    component:ReturnComponent
  },{
    path: 'suggestion',
    component:SuggestionComponent
  },{
    path: 'history',
    component:HistoryComponent
  },{
    path: 'checkout',
    component: CheckoutComponent
  },{
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'catalog',
    component: CatalogComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesforceRoutingModule { }
