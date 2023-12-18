import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { detailmodel } from './dashboard.model';
import { cscservice } from '../shared/csc.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public registerForm!: FormGroup;
  details: any;
  data: any;

  countries_one: any;
  states_one: any ;
  cities_one: any;

  selectedCountry_one: any = {
    id: 0, name: ''
  };

  selectedState_one: any = {
    id: 0, name: ''
  };

  selectedCity_one: any = {
    id: 0, name: ''
  };
  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    private cscService: cscservice
  ) {}

  dashboardModelObj: detailmodel = new detailmodel();

  ngOnInit(): void {
    this.getdetails();
    this.registerForm = this.formbuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.cscService.getAll().subscribe(
      (data: any) => {
        this.countries_one = data;
        console.log(this.countries_one);
      }
    );
  }

  getdetails() {
    this.api.getData().subscribe(res => {
      this.details = res;
    });
  }

  deldetails(row: any) {
    this.api.deleteData(row.id).subscribe(res => {
      alert('Data deleted');
      this.getdetails();
    });
  }

  onEdit(row: any) {
    this.dashboardModelObj.id = row.id;
    this.registerForm.patchValue(row);
    this.onSelectCountry_one()
    this.onSelectState_one()
  }

  updetails() {
    this.dashboardModelObj = { ...this.registerForm.value, id: this.dashboardModelObj.id };

    this.api.updateData(this.dashboardModelObj, this.dashboardModelObj.id).subscribe(res => {
      alert('Updated Successfully');
      let ref = document.getElementById('close');
      ref?.click();
      this.registerForm.reset();
      this.getdetails();
    });
  }

  // On selection of country changing state
  onSelectCountry_one() {
    const selectedcountry = this.registerForm.get('country')?.value;
    console.log(selectedcountry)
    if(selectedcountry){
      this.cscService.getAll().subscribe((res: any) => {
      this.states_one = res['states'].filter(
        (data: any) => data.country_name === selectedcountry
      ),
      console.log(this.states_one);
    })
  }
}


  // On selection of state changing cities
  onSelectState_one() {
    const selectedstate = this.registerForm.get('state')?.value;
    console.log(selectedstate)
    if (selectedstate) {
      this.cscService.getAll().subscribe((res: any) => {
        this.cities_one = res['cities'].filter(
          (data: any) => data.state_name === selectedstate
        );
        console.log(this.cities_one);
      });
    }
  }
}
