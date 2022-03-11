import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  productsList: any[] = [];
  constructor(private api:ApiService,public dialog: MatDialog,private _snackBar:MatSnackBar) { }
  isReadMore:any = '';
  ngOnInit(): void {
    // Getting all the products while loading the component
      this.getProducts()
  }
  // Function for getting products
  getProducts(){
    this.api.getProductsList().subscribe((resp:any)=>{
      console.log(resp);
      if(resp.status == 200){
        this.productsList = resp.body.data;
      }
    },error =>{
      console.log(error)
      if(error.error.errors){
        var erro = ''
        Object.keys(error.error.errors).forEach((element :any)=> {
          console.log(element)
          erro += error.error.errors[element]
          this._snackBar.open(erro,'Close', {
            duration: 4000
          });
        });
      }
    })
  }

  //delete function removing the record
  deleteFile(id:any){
    console.log(id)
    this.api.deleteProduct(id).subscribe((data:any)=>{
      console.log(data);
      if(data.status == 204){
        this._snackBar.open('Item Deleted Successfully!!','Close', {
          duration: 3000
        });
        this.getProducts()
      }
    },error =>{
      console.log(error)
      if(error.error.errors){
        var erro = ''
        Object.keys(error.error.errors).forEach((element :any)=> {
          console.log(element)
          erro += error.error.errors[element]
          this._snackBar.open(erro,'Close', {
            duration: 4000
          });
        });
      }
    })
  }
  //Edit dialog
  openDialog(item:any): void {
    const dialogRef = this.dialog.open(Editdialogue, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed',result);
      if(result && result == 'saved'){
        this.getProducts()
      }
    });
  }
  readMoreFunction(id:any){
    this.isReadMore == id ? this.isReadMore = '' : this.isReadMore = id
  }
}
// component for edit dialog
@Component({
  selector: 'edit-dialogue',
  templateUrl: 'edit-product.html',
  styleUrls: ['./products-list.component.scss']
})
export class Editdialogue {
  constructor(
    public dialogRef: MatDialogRef<Editdialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}