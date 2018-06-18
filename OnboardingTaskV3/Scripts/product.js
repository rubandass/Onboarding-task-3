$(document).ready(function () {

    ko.applyBindings(new productViewModel());
});

var newProduct = { Id: "", Name: "", Price: "" };

function productModel(data) {
    var self = this;
    self.hideId = ko.observable(false);
    self.Id = ko.observable(data.Id);
    self.Name = ko.observable(data.Name).extend({
        required: true,
        pattern: {
            message: "Please enter Product Name",
            params: "^[a-zA-Z0-9_ ]*$"
        }
    });
    self.Price = ko.observable(data.Price).extend({
        required: true,
        pattern: {
            message: "Please enter valid Price",
            params: "^[0-9]*[.]?[0-9]*$"
        }

    });
    self.ModelErrors = ko.validation.group(self);
    self.IsValid = ko.computed(function () {
        self.ModelErrors.showAllMessages();
        return self.ModelErrors().length === 0;
    });

}

function productViewModel() {
    var self = this;
    self.products = ko.observable();
    self.selectedProduct = ko.observable();
    self.selectedProductDelete = ko.observable();


    loadProducts();
    function loadProducts() {
        $.ajax({
            type: "GET",
            url: "/Products/ProductList",
            success: function (data) {
                self.products(data);
            }
        });
    }

    self.addProductModal = function () {
        self.selectedProduct(new productModel(newProduct));
        $("#modalTitle").html("Add New Product");
        $("#btnAdd").show();
        $("#btnUpdate").hide();
        $("#productModal").modal();
    };

    self.editProductModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedProduct(new productModel(selected));
        $("#modalTitle").html("Edit Product");
        $("#btnAdd").hide();
        $("#btnUpdate").show();
        $("#productModal").modal();
    };

    self.deleteProductModal = function (data) {
        var selected = ko.mapping.toJS(data);
        self.selectedProductDelete(new productModel(selected));
        $("#deleteModal").modal();
    };

    self.addProduct = function () {
        var data = ko.toJSON(self.selectedProduct);
        $.ajax({
            url: "/Products/AddProduct",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadProducts();
                    $("#productModal").hide();
                }
            }
        });
    };

    self.updateProduct = function () {
        var data = ko.toJSON(self.selectedProduct);
        $.ajax({
            url: "/Products/UpdateProduct",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response) {
                    loadProducts();
                    $("#productModal").hide();
                }
            }
        });
    };

    self.deleteProduct = function () {
        var data = ko.toJSON(self.selectedProductDelete);
        $.ajax({
            url: "/Products/DeleteProduct",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: data,
            success: function (response) {
                if (response === "Error") {   //This loop will be executed if the controller thrown exception due to foreign key constraint.
                    $("#DeleteConfirmationForeignKey").modal();
                }
                $("#deleteModal").hide();
                loadProducts();
            }
        });
    };

    self.deleteProductReference = function () {     //Call another function to delete foreign key constraint records on sales table.
        $("#DeleteConfirmationForeignKey").modal("hide");
        var data = ko.toJSON(self.selectedProductDelete);
        $.ajax({
            type: "POST",
            url: "/Sales/DeleteProductReference",
            contentType: "application/json; charset=utf-8",
            data: data,

            success: function (deleteResult) {
                self.deleteProduct();    //Again calling the normal delete function for Product delete.
            }
        });
    };
}

