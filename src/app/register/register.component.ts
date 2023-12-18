import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { datamodel } from './register.model';
import{ cscservice }from '../shared/csc.services';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  registerModelObj: datamodel = new datamodel();

  countries:any;
  states:any;
  cities:any;

  selectedCountry:any={
    id:0,name:''
  }

  selectedState:any={
    id:0,name:''
  }


  constructor(private formbuilder: FormBuilder, private api: ApiService,private cscservice: cscservice ) {}

  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      state: [Validators.required],
    city: [ Validators.required]
    });
    this.showAll()
    this.onSelectCountry(this.selectedCountry.name)
    this.onSelectState(this.selectedState.name)

  }
    

  postdetails(): void {
    this.registerModelObj.firstname = this.registerForm.value.firstname;
    this.registerModelObj.lastname = this.registerForm.value.lastname;
    this.registerModelObj.mobile = this.registerForm.value.mobile;
    this.registerModelObj.email = this.registerForm.value.email;
    this.registerModelObj.gender = this.registerForm.value.gender;
    this.registerModelObj.country = this.registerForm.value.country;
    this.registerModelObj.state = this.registerForm.value.state;
    this.registerModelObj.city = this.registerForm.value.city;

    this.api.postData(this.registerModelObj)
      .subscribe(
        (res: any) => {
          console.log(res);
          alert('Details added successfully');
        },
        (err: any) => {
          alert('Something went wrong');
        }
      );
  }



 // fetching countries,states,cities
 showAll(){
  this.cscservice.getAll().subscribe(
    (data:any)=>{
      this.countries =data,
      console.log(this.countries)
    }
  )
} 

// Onselection os country changing state
onSelectCountry(country_name:any){
  this.cscservice.getAll().subscribe((res:any)=>{
    this.states = res['states'].filter(
      (data:any)=> data.country_name == country_name!.value
    ),
    console.log(this.states)
  }
  )
}

// Onselection of state changing cities
onSelectState(state_name:any){
  this.cscservice.getAll().subscribe((res:any)=>{
    this.cities = res['cities'].filter(
      (data:any)=> data.state_name == state_name!.value
    ),
    console.log(this.cities)
  }
  )
}




  registerSubmitted(): void {
    if (this.registerForm && this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      this.api.postData(this.registerModelObj)
        .subscribe(
          (res: any) => {
            console.log(res);
            alert('Details added successfully');
          },
          (err: any) => {
            alert('Something went wrong');
          }
        );
      this.registerForm.reset();
    } else {
      console.log('Form has validation errors.');
    }
  }
}
