import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productform: FormGroup;
  imgUrl!: string;
  @Input() editData: any;
  @Output() savedEvent = new EventEmitter();

  constructor(private api: ApiService, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    // form intiation
    this.productform = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      img: [''],
    })
  }

  ngOnInit(): void {
    //handling the edit function (component reusing)
    if (this.editData) {
      console.log(this.editData)
      this.productform.controls['name'].setValue(this.editData.name);
      this.productform.controls['description'].setValue(this.editData.description);
      this.productform.controls['price'].setValue(this.editData.price);
      this.imgUrl = this.editData.image
      this.productform.value.id = this.editData.id;
    }
  }
  //handling image input to store data as a base64 string
  onChangeImage(event: any) {
    var files = event.target.files;
    console.log(files[0])
    if (files) {
      var file = files[0]
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      var that = this;
      reader.onload = function (event: any) {
        that.imgUrl = `data:${file.type};base64,${btoa(
          event.target.result
        )}`;
      };
    }
  }

  //form submission handling the create/edit item functionality in single submit (with error handling)
  onSubmit(formGroupDirective: FormGroupDirective) {
    this.imgUrl ? this.productform.value.image = this.imgUrl : this.productform.value.image = ''
    if (this.imgUrl) {
      this.productform.value.image = this.imgUrl
    } else {
      this.productform.value.image = ''
      this._snackBar.open('Image field is required', 'Close', {
        duration: 3000
      });
    }
    this.editData ? this.productform.value.id = this.editData.id : ''
    console.log(this.productform.value)
    if (this.productform.valid) {
      if (this.productform.value.id) {
        this.api.editProduct(this.productform.value).subscribe((data: any) => {
          console.log(data)
          if (data.status == 200 || 201) {
            this._snackBar.open('Item Edited Successfully!!', 'Close', {
              duration: 3000
            });
            this.savedEvent.emit('saved')
            this.productform.reset()
            formGroupDirective.resetForm();
            this.imgUrl = '';
          }
        }, error => {
          console.log(error)
          if (error.error.errors) {
            var erro = ''
            Object.keys(error.error.errors).forEach((element: any) => {
              console.log(element)
              erro += error.error.errors[element]
              this._snackBar.open(erro, 'Close', {
                duration: 4000
              });
            });
          }
        })
      } else {
        this.api.saveProduct(this.productform.value).subscribe((data: any) => {
          console.log(data)
          if (data.status == 200 || 201) {
            this._snackBar.open('Item Saved Successfully!!', 'Close', {
              duration: 3000
            });
            this.productform.reset()
            formGroupDirective.resetForm();
            this.imgUrl = '';
          }
        }, error => {
          console.log(error)
          if (error.error.errors) {
            var erro = ''
            Object.keys(error.error.errors).forEach((element: any) => {
              console.log(element)
              erro += error.error.errors[element]
              this._snackBar.open(erro, 'Close', {
                duration: 4000
              });
            });
          }
        })
      }
    }

  }
}
