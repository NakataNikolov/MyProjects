import { Component } from '@angular/core';
import { ApiService } from './api.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import $ from 'jquery';
import {PersistdataService} from './persistdata.service'
import { NgForm } from '@angular/forms';
import { privateEncrypt } from 'crypto';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'job-aplication-angular';
  products;
  totalRec : number;
  page: number = 1;
  categories;
  cartArr = [];
  cartAmount;
  totalPrice = 0;
  discount;
  constructor(
    private apiService: ApiService,
    private dataColection: PersistdataService
  ) { 
  }
  ngOnInit() {
 
    this.getCategories();
    this.getProducts();
    this.cartAmountfunc();
  }
  //retrive all products from db 
  getProducts(){
    var categoryName ;
    this.apiService.getProducts().subscribe((data)=>{
      this.products = data;
      this.totalRec = this.products.length;
      for(var i in this.products){
        categoryName = this.categories.filter(x => x.id ===  this.products[i].category);
        this.products[i].categoryName = categoryName[0].name;
      }
    })

  }
  //create new product 
  createProduct(form : NgForm){
      var newProductObj = {
        name: form.value.product_name,
        description: form.value.product_description,
        price: parseFloat(form.value.product_price),
        quantity: parseInt(form.value.available_quantity),
        category: parseInt(form.value.product_category)
      };
      this.apiService.createNewProduct(newProductObj).subscribe((data)=>{
        this.closeModal();
        this.getProducts();
      })
    }
  //remove product from db
  removeProduct(productId){
    this.apiService.deleteProduct(productId).subscribe((data) =>{
      this.getProducts();
    })
  }
  //retrive all categories from db
  getCategories(){
      this.apiService.getCategories().subscribe((data)=>{
        this.categories= data;
        this.totalRec = this.categories.length;
      })
  }
  //makes new category 
  createCategory(form : NgForm){
    var newCategoryObj = {
      name: form.value.category_name,
      description: form.value.categorie_description,
      available: form.value.category_available,
    };
    this.apiService.createNewCategory(newCategoryObj).subscribe((data)=>{
      this.closeCategoryModal();
      this.getCategories();
    })
  }
  // delete category from db 
  removeCategory(categoryId){
    this.apiService.deleteCategory(categoryId).subscribe((data)=>{
      this.getCategories();
    })
  }
  //opens model that helps to add new category 
  showCategoryModal(){
    var modal = $('#categoriesModal')[0];
    modal.style.display = "block";
  }
  //shows modal that helps removing categories
  showDeleteCategory(){
    var modal = $('#removeCategoriesModal')[0];
    modal.style.display = 'block';
  }
  //edit category 
  editCategory(categoryID){
    var categoryForm = $('#editCategoriesForm'+ categoryID)[0];
    categoryForm.style.display = 'block';
  }
  updateCategory(form : NgForm, categoryId){

    var specificCategory = this.categories.filter(x => x.id === categoryId);
    specificCategory[0].name = form.value.update_category_name;
    specificCategory[0].description = form.value.update_categorie_description;
    specificCategory[0].available = form.value.update_category_available;
    this.apiService.updateCategory(specificCategory[0],categoryId).subscribe((data)=>{
      this.getCategories();
    })
  }
  expandImage() {
    var modal = $('#myModal')[0];
    modal.style.display = "block";
  }
  closeCategoryModal(){
    var modal = $('#categoriesModal')[0];
    modal.style.display = "none";
  }
  closeCategoryForm(categoryID){
    var categoryForm = $('#editCategoriesForm'+ categoryID)[0];
    categoryForm.style.display = 'none';
  }
  closeModal(){
    var modal = $('#myModal')[0];
    modal.style.display = "none";
  }
  closeRemoveCategoryModal(){
    var modal = $('#removeCategoriesModal')[0];
    modal.style.display = 'none';
  }
  //used for activating remove product functionality
  removeProductFunc(){
    var productOptions = $('.container').find('.edit-items');
    if(productOptions.hasClass('hide-edit-products')){
      productOptions.removeClass('hide-edit-products');
      productOptions.addClass('show-edit-products');
    }else{
      productOptions.removeClass('show-edit-products');
      productOptions.addClass('hide-edit-products');
    }
  }
  //changing qty of the selected product
  changeQty(productId, step, maxQty){
    var quantity = parseInt($('#cart-quantity'+ productId).val());
    if(step){
      if(maxQty > quantity)
      $('#cart-quantity' + productId).val(quantity + 1);
    }else{
      if(quantity>0 ){
        $('#cart-quantity' + productId).val(quantity - 1);
      }
    }

  }
  //adding to cart array 
  addToCart(productId){
      var quantity = parseInt($('#cart-quantity'+ productId).val());
      var specificProduct = this.products.filter(x => x.id === productId);
     if(quantity > 0){
      this.cartArr.push({
        prodId: productId,
        prodName: specificProduct[0].name +" "+ specificProduct[0].description,
        prodPrice: specificProduct[0].price * quantity,
        qty:quantity
      });
      this.cartAmountfunc();
     }
  }
  //adding products in cart
  cart(){
    this.totalPrice = 0;
    this.discount = 5;
    var finalPrice = 0;
    if(this.cartArr.length > 0){
      for(var i in this.cartArr){
        finalPrice += this.cartArr[i].prodPrice;
      }
      if(this.cartArr.length > 1){
        this.totalPrice = finalPrice - ((finalPrice * this.discount)/100);
      }else{
        this.totalPrice = finalPrice;
      }
    }
  }
  //showing the current amount of products in cart
  cartAmountfunc(){
    this.cartAmount = 0;
    this.cartAmount = this.cartArr.length;
  }
}
