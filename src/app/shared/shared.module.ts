import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnpjCpfPipe } from '../pipes/cnpj-cpf.pipe';
import { UserTypePipe } from '../pipes/user-type.pipe';
import { NameCutPipe } from '../pipes/name-cut.pipe';
import { ShortMoneyPipe } from '../pipes/short-money.pipe';
import { EntityTypePipe } from '../pipes/entity-type.pipe';


@NgModule({
  declarations: [
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    ShortMoneyPipe,
    EntityTypePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    ShortMoneyPipe,
    EntityTypePipe
  ]
})
export class SharedModule { }
