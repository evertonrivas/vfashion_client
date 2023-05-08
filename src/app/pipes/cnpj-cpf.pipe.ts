import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpjCpf'
})
export class CnpjCpfPipe implements PipeTransform {
  transform(value:string,hidePart:boolean=false):string{
    const cnpjCpfValue = value;
    if (cnpjCpfValue.length===11){
      if(!hidePart){
        return cnpjCpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }else{
        return 'XXX.'+cnpjCpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(4,7)+'-XX';
      }
    }else if(cnpjCpfValue.length===14){
      if(!hidePart){
        return cnpjCpfValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }else{
        return 'XX.'+cnpjCpfValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').substring(3,11)+'-XX';
      }
      
    }else{
      return value;
    }
  }

  /*transform(value: string): string {
    if (!value) {
      return '';
    }

    value = value.replace(/\D/g, '');

    switch (value.length) {
      case 11:
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 14:
        return value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\\d{2})/,
          '$1.$2.$3/$4-$5',
        );
      default:
        return value;
    }
  }*/
}