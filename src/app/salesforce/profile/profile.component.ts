import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { faSave,faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Profile } from '../../services/profile.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myProfile:Profile = {
    id: 0,
    city: "",
    postal_code: "",
    email: "",
    state_region: "",
    neighborhood: "",
    phone: "",
    name: "",
    taxvat: "",
    type: "",
    instagram: "",
    date_updated: null,
    date_created: "",
    trash: false
  };
  faSave = faSave;
  faRotateLeft = faRotateLeft;

  frmProfile = new FormGroup({
    txtName: new FormControl('',Validators.required),
    txtEmail: new FormControl('',Validators.required),
    txtTaxvat: new FormControl('',[Validators.required,Validators.minLength(11)]),
    txtPhone: new FormControl('',Validators.required),
    txtPostalCode: new FormControl('',Validators.required),
    slUF: new FormControl('',Validators.required),
    txtCity: new FormControl('',Validators.required),
    txtNeighborhood: new FormControl('',Validators.required),
    txtInstagram: new FormControl('')
  })

  constructor(private authService:AuthService,private toastr: ToastrService, private route:Router){

  }

  ngOnInit(): void {
    this.authService.loadProfile().subscribe({
      next: data =>{
        this.myProfile.id = data.id;
        this.myProfile.city = data.city;
        this.myProfile.postal_code = data.postal_code;
        this.myProfile.email = data.email;
        this.myProfile.state_region = data.state_region;
        this.myProfile.neighborhood = data.neighborhood;
        this.myProfile.phone = data.phone;
        this.myProfile.name  = data.name;
        this.myProfile.taxvat = data.taxvat;
        this.myProfile.instagram = data.instagram;
      },
      complete: () =>{
        this.frmProfile.controls.txtName.setValue(this.myProfile.name);
        this.frmProfile.controls.txtEmail.setValue(this.myProfile.email);
        this.frmProfile.controls.txtTaxvat.setValue(this.myProfile.taxvat);
        this.frmProfile.controls.txtPhone.setValue(this.myProfile.phone);
        this.frmProfile.controls.txtPostalCode.setValue(this.myProfile.postal_code);
        this.frmProfile.controls.slUF.setValue(this.myProfile.state_region);
        this.frmProfile.controls.txtCity.setValue(this.myProfile.city);
        this.frmProfile.controls.txtNeighborhood.setValue(this.myProfile.neighborhood);
        this.frmProfile.controls.txtInstagram.setValue(this.myProfile.instagram);
      }
    });
  }

  onSubmit():void{
    
    this.myProfile.name         = this.frmProfile.controls.txtName.value as string;
    this.myProfile.instagram    = this.frmProfile.controls.txtInstagram.value as string;
    this.myProfile.taxvat       = this.frmProfile.controls.txtTaxvat.value as string;
    this.myProfile.state_region = this.frmProfile.controls.slUF.value as string;
    this.myProfile.city         = this.frmProfile.controls.txtCity.value as string;
    this.myProfile.postal_code  = this.frmProfile.controls.txtPostalCode.value as string;
    this.myProfile.neighborhood = this.frmProfile.controls.txtNeighborhood.value as string;
    this.myProfile.phone        = this.frmProfile.controls.txtPhone.value as string;
    this.myProfile.email        = this.frmProfile.controls.txtEmail.value as string;

    this.authService.saveProfile(this.myProfile).subscribe({
      next: data => {
        if ((data as boolean)==true){
          this.toastr.success('Registro salvo com sucesso!','Alerta!').onHidden.subscribe({
            next: data =>{
              this.route.navigate(["/shopkeeper/gallery"]);
            }
          });
        }
      }
    })
  }
}
